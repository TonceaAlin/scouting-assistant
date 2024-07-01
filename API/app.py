import numpy as np
import pandas as pd
import pickle
from flask import Flask, jsonify, request
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from surprise import Dataset, Reader
from surprise.model_selection import train_test_split as test_train_split_recommended
from surprise import SVD
from tensorflow.keras.models import load_model

# Define weights for different position groups
weights = {
    'forward': {'pace': 0.05, 'shooting': 0.125, 'passing': 0.050, 'dribbling': 0.025, 'defending': 0.01,
                'physic': 0.025, 'attacking_finishing': 0.1, 'overall': 0.3, 'potential': 0.2},
    'midfielder': {'pace': 0.1, 'shooting': 0.1, 'passing': 0.15, 'dribbling': 0.15, 'defending': 0.025, 'physic': 0.05,
                   'attacking_finishing': 0.025, 'overall': 0.3, 'potential': 0.2},
    'defender': {'pace': 0.05, 'shooting': 0.025, 'passing': 0.1, 'dribbling': 0.025, 'defending': 0.2, 'physic': 0.1,
                 'attacking_finishing': 0, 'overall': 0.3, 'potential': 0.2}
}


def get_weights(position):
    if any(pos in position for pos in ['ST', 'CF', 'LW', 'RW', 'LF', 'RF', 'LS', 'RS']):
        return weights['forward']
    elif any(pos in position for pos in ['CM', 'CAM', 'CDM', 'LM', 'RM', 'LCM', 'RCM', 'LAM', 'RAM']):
        return weights['midfielder']
    elif any(pos in position for pos in ['CB', 'LB', 'RB', 'LWB', 'RWB', 'LCB', 'RCB']):
        return weights['defender']
    else:
        return weights['midfielder']  # Default to midfielder weights if position is ambiguous


# Function to prepare input features for the model
def prepare_features(player_id, team_id):
    player = combined_df[combined_df['player_id'] == int(player_id)]
    team_avg = combined_df[combined_df['team_id'] == team_id]

    if player.empty:
        raise ValueError(f"Player ID {player_id} not found in the data.")
    if team_avg.empty:
        raise ValueError(f"Team ID {team_id} not found in the data.")

    player = player.iloc[0]
    team_avg = team_avg.iloc[0]

    features = [
        player['pace'], player['shooting'], player['passing'], player['dribbling'],
        player['defending'], player['physic'], player['attacking_finishing'],
        player['overall_vs_team'], player['potential_vs_team']
    ]
    print(features)
    features = np.array(features).reshape(1, -1)
    print(features)
    return features


app = Flask(__name__)

model = load_model('static/neural_net.h5')
with open('static/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)
players_file_path = 'static/male_players.csv'
teams_file_path = 'static/male_teams.csv'
players_df = pd.read_csv(players_file_path, dtype={'club_team_id': 'string'})
teams_df = pd.read_csv(teams_file_path, dtype={'team_name': 'string', 'team_id': 'string'})
# keep only leagues from FIFA 24 - avoiding duplicates from other versions
teams_df = teams_df.loc[teams_df['fifa_version'] == 24]
# avoid posting national teams
teams_df = teams_df.loc[teams_df['league_name'] != 'Friendly International']

# keep only leagues from FIFA 24 - avoiding duplicates
filtered_players_df = players_df[players_df['fifa_version'] == 24]
players_df = players_df[players_df['fifa_version'] == 24]
# filter relevant player positions (excluding goalkeepers for now)
field_players_df = filtered_players_df[~filtered_players_df['player_positions'].str.contains('GK')]
team_avg_attributes = field_players_df.groupby('club_team_id')[
    ['overall', 'potential', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic',
     'attacking_finishing']].mean().reset_index()

combined_df = pd.merge(field_players_df, team_avg_attributes, on='club_team_id', suffixes=('', '_team_avg'))
combined_df['club_team_id'] = combined_df['club_team_id'].astype(str)
teams_df['team_id'] = teams_df['team_id'].astype(str)
combined_df = pd.merge(combined_df, teams_df[['team_id', 'attack', 'midfield', 'defence']], left_on='club_team_id',
                       right_on='team_id', how='left')

combined_df['overall_vs_team'] = combined_df['overall'] - combined_df['overall_team_avg']
combined_df['potential_vs_team'] = combined_df['potential'] - combined_df['potential_team_avg']
numerical_features = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic', 'attacking_finishing',
                      'overall_vs_team', 'potential_vs_team']
scaler.fit(combined_df[numerical_features])

#############################################################################################
############ SIMILAR PLAYERS RECOMMENDATION #################################################

reader = Reader(rating_scale=(0, 100))  # Define the rating scale
data = Dataset.load_from_df(players_df[['player_id', 'overall', 'potential']], reader)

# Split the data into train and test sets
trainset, testset = test_train_split_recommended(data, test_size=0.2, random_state=42)

algo = SVD()
algo.fit(trainset)

predictions = algo.test(testset)

teams_df['team_id'] = teams_df['team_id'].astype(str)
players_df['club_team_id'] = players_df['club_team_id'].astype(str)
merged_df = pd.merge(players_df, teams_df, left_on='club_team_id', right_on='team_id')
# compute overall average
ex = players_df.groupby('club_name')['overall'].transform('mean')
potential_avg = merged_df.groupby('team_id')['potential'].mean().reset_index()
potential_avg.rename(columns={'potential': 'potential_average'}, inplace=True)
print(potential_avg.head())
# compute overall age
age_avg = merged_df.groupby('team_id')['age'].mean().reset_index()

teams_df = pd.merge(teams_df, potential_avg, on='team_id', how='left')

def get_top_n_recommendations(input_predictions, n=5):
    # map player ID to their predicted ratings
    player_ratings = {}
    for uid, iid, true_r, est, _ in input_predictions:
        if uid not in player_ratings:
            player_ratings[uid] = []
        player_ratings[uid].append((iid, est))

    # Then, sort the ratings for each player and get the top N recommendations
    top_n_recommendations = {}
    for uid, ratings in player_ratings.items():
        ratings.sort(key=lambda x: x[1], reverse=True)
        top_n_recommendations[uid] = ratings[:n]

    return top_n_recommendations


def filter_recommendations(recommendations, initial_player_id, criteria):
    dataframe = filtered_players_df
    initial_player = dataframe.loc[dataframe['player_id'] == initial_player_id].iloc[0]
    initial_player_positions = initial_player['player_positions'].split(', ')
    initial_player_value = initial_player['value_eur']
    initial_player_age = initial_player['age']
    filtered_recommendations = {}
    for player_id, ratings in recommendations.items():
        recommended_player = dataframe.loc[dataframe['player_id'] == player_id].iloc[0]
        recommended_player_positions = recommended_player['player_positions'].split(', ')
        recommended_player_value = recommended_player['value_eur']
        recommended_player_age = recommended_player['age']
        common_positions = [pos for pos in recommended_player_positions if pos in initial_player_positions]
        if common_positions:
            if criteria == 'younger' and recommended_player_age >= initial_player_age:
                continue
            if criteria == 'cheaper' and recommended_player_value >= initial_player_value:
                continue
            filtered_recommendations[player_id] = ratings


    # Sort the filtered recommendations based on the rating values within each tuple
    filtered_recommendations_sorted = {k: sorted(v, key=lambda x: x[1], reverse=True) for k, v in
                                       filtered_recommendations.items()}

    return filtered_recommendations_sorted


@app.route('/test')
def test():
    return "Successful test"


@app.route('/')
def home():  # put application's code here
    return 'APP backend'


@app.route('/leagues')
def get_all_leagues():
    leagues_data = teams_df[['league_name', 'league_id', 'fifa_version', 'nationality_name']].drop_duplicates(
        subset=['league_name', 'league_id']).dropna().to_dict(orient='records')
    return jsonify(leagues_data)


@app.route('/teams')
def get_all_teams():
    teams_data = teams_df[
        ['team_name', 'team_id', 'league_name', 'league_id', 'overall', 'potential_average', 'starting_xi_average_age',
         'attack',
         'midfield', 'defence']].dropna().to_dict(orient='records')

    return jsonify(teams_data)


@app.route('/teams/details/<team_id>')
def get_teams_details(team_id):
    pass


@app.route('/players')
def get_all_players():
    players_data = filtered_players_df[
        ['short_name', 'player_id', 'club_team_id', 'overall', 'value_eur', 'potential', 'age', 'height_cm',
         'weight_kg',
         'player_positions', 'club_contract_valid_until_year', 'nationality_name', 'preferred_foot', 'weak_foot',
         'skill_moves', 'player_tags', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic',
         'attacking_crossing',
         'attacking_finishing', 'attacking_heading_accuracy', 'attacking_short_passing',
         'attacking_volleys', 'skill_dribbling', 'skill_curve', 'skill_fk_accuracy',
         'skill_long_passing', 'skill_ball_control', 'movement_acceleration',
         'movement_sprint_speed', 'movement_agility', 'movement_reactions', 'movement_balance',
         'power_shot_power', 'power_jumping', 'power_stamina', 'power_strength', 'power_long_shots',
         'mentality_aggression', 'mentality_interceptions', 'mentality_positioning',
         'mentality_vision', 'mentality_penalties', 'mentality_composure',
         'defending_marking_awareness', 'defending_standing_tackle', 'defending_sliding_tackle',
         'goalkeeping_diving', 'goalkeeping_handling', 'goalkeeping_kicking',
         'goalkeeping_positioning', 'goalkeeping_reflexes', 'goalkeeping_speed', 'wage_eur', 'dob'
         ]].fillna('0').dropna().to_dict(orient='records')
    return jsonify(players_data)


@app.route('/players/details/<player_id>')
def get_players_details(player_id):
    requested_player = players_df[players_df['player_id'] == int(player_id)]


@app.route('/predict/player/<player_id>/team/<team_id>', methods=['GET'])
def players(player_id, team_id):
    try:
        # Prepare the input features
        features = prepare_features(player_id, team_id)
        if features is None:
            return jsonify({'error': 'Feature preparation failed.'})

        # Normalization of data
        features = scaler.transform(features)

        # Make prediction
        prediction = model.predict(features)
        fit_probability = prediction[0][0]

        # Apply threshold to determine fit
        fit = 1 if fit_probability >= 0.5 else 0
        return jsonify({'fitness': fit})

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/predict/similar/<criteria>/<player_id>')
def similar_players(criteria, player_id):
    top_n_recommendations = get_top_n_recommendations(predictions)
    filtered_recommendations = filter_recommendations(top_n_recommendations, int(player_id), criteria)
    top_5_recommendations = dict(sorted(filtered_recommendations.items(), key=lambda x: x[1][0][1], reverse=True)[:5])
    return_dict = {}
    for player_id, ratings in top_5_recommendations.items():
        if player_id not in return_dict:
            for overall, prediction_fit in ratings:
                return_dict[player_id] = prediction_fit
    return jsonify(return_dict)


if __name__ == '__main__':
    app.run()
