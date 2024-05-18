import pandas as pd
from flask import Flask, jsonify, request
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from surprise import Dataset, Reader
from surprise.model_selection import train_test_split as test_train_split_recommended
from surprise import SVD
# from surprise import accuracy
from surprise import KNNBasic


app = Flask(__name__)
players_file_path = 'static/male_players.csv'
teams_file_path = 'static/male_teams.csv'
players_df = pd.read_csv(players_file_path, dtype={'short_name': 'string', 'fifa_version': 'string', 'club_team_id':'string'})
teams_df = pd.read_csv(teams_file_path, dtype={'team_name':'string'})

# keep only leagues from FIFA 24 - avoiding duplicates
teams_df = teams_df.loc[teams_df['fifa_version'] == 24]
# avoid posting national teams
teams_df = teams_df.loc[teams_df['league_name'] != 'Friendly International']


columns_to_convert = ['fifa_version', 'league_id', 'club_team_id']

# keep only leagues from FIFA 24 - avoiding duplicates
players_df = players_df.loc[players_df['fifa_version'] == '24.0']

# Calculate differences for relevant attributes
attributes = ['overall', 'age', 'potential', 'weak_foot', 'skill_moves']
for attribute in attributes:
    players_df[f'diff_{attribute}'] = players_df[attribute] - players_df.groupby('club_name')[attribute].transform('mean')

# Define the dynamic threshold based on the 90th percentile of the absolute differences for the overall attribute
dynamic_threshold_lower = -players_df['diff_overall'].abs().quantile(0.90)
dynamic_threshold_upper = 5  # Ensure upper threshold is at least 5
# Define a static threshold for weak_foot and skill_moves attributes
static_threshold = 3

# Compute good_fit marker with adjusted threshold
players_df['good_fit'] = (
    (players_df['diff_overall'] <= dynamic_threshold_lower) |  # Only consider negative threshold for overall attribute
    ((players_df['diff_age'].abs() <= static_threshold) |
     (players_df['diff_potential'].abs() <= static_threshold) |
     (players_df['diff_weak_foot'].abs() <= static_threshold) |
     (players_df['diff_skill_moves'].abs() <= static_threshold)) &
    (players_df[['diff_age', 'diff_potential', 'diff_weak_foot', 'diff_skill_moves']].abs() <= static_threshold).sum(axis=1) >= 1
).astype(int)

X = players_df[attributes]
y = players_df['good_fit']

# Step 2: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 3: Train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Step 4: Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
# print("Accuracy:", accuracy)
# print("Classification Report:")
# print(classification_report(y_test, y_pred))


#############################################################################################
############ SIMILAR PLAYERS RECOMMENDATION #################################################
reader = Reader(rating_scale=(0, 100))  # Define the rating scale
data = Dataset.load_from_df(players_df[['player_id', 'overall', 'potential']], reader)

# Split the data into train and test sets
trainset, testset = test_train_split_recommended(data, test_size=0.2, random_state=42)

algo = SVD()
algo.fit(trainset)

predictions = algo.test(testset)


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

def filter_recommendations_by_position(recommendations, initial_player_id, dataframe):
    # Get the positions of the initial player
    initial_player_positions = dataframe.loc[dataframe['player_id'] == initial_player_id, 'player_positions'].iloc[0].split(', ')
    filtered_recommendations = {}
    for player_id, ratings in recommendations.items():
        recommended_player_positions = dataframe.loc[dataframe['player_id'] == player_id, 'player_positions'].iloc[0].split(', ')
        common_positions = [pos for pos in recommended_player_positions if pos in initial_player_positions]
        if common_positions:
            filtered_recommendations[player_id] = ratings

    # Sort the filtered recommendations based on the rating values within each tuple
    filtered_recommendations_sorted = {k: sorted(v, key=lambda x: x[1], reverse=True) for k, v in filtered_recommendations.items()}

    return filtered_recommendations_sorted


@app.route('/')
def home():  # put application's code here
    return 'APP backend'

@app.route('/leagues')
def get_all_leagues():
    leagues_data = teams_df[['league_name', 'league_id', 'fifa_version', 'nationality_name']].drop_duplicates(subset=['league_name', 'league_id']).dropna().to_dict(orient='records')
    return jsonify(leagues_data)

@app.route('/teams')
def get_all_teams():
    teams_data = players_df[['club_name', 'club_team_id', 'league_name', 'league_id']].drop_duplicates(subset=['club_name', 'club_team_id', 'league_name', 'league_id']).dropna().to_dict(orient='records')
    return jsonify(teams_data)

@app.route('/players')
def get_all_players():
    players_data = players_df[['short_name', 'player_id', 'club_team_id', 'overall', 'value_eur']].dropna().to_dict(orient='records')
    # response = jsonify({"players": player_names})
    # response.status_code = 200
    return jsonify(players_data)

@app.route('/predict/player/<player_id>/team/<team_id>', methods = ['GET', 'POST'])
def players(player_id, team_id):
    print('PLAYER', player_id)
    print('TEAM', team_id)
    requested_player = players_df[players_df['player_id'] == int(player_id)]
    requested_team = teams_df[teams_df['team_id'] == int(team_id)]
    print(requested_team.to_string())
    team_name = requested_team.iloc[0].get(key='team_name')
    print(team_name)
    team_players = players_df[players_df['club_name'] == team_name]
    team_attributes = team_players[['overall', 'age', 'potential', 'weak_foot', 'skill_moves']].mean()
    print(team_name, 'has attributes\n', team_attributes.head())
    diff_attributes = requested_player[['overall', 'age', 'potential', 'weak_foot', 'skill_moves']] - team_attributes
    diff_attributes = diff_attributes.to_numpy(dtype=float)[0]
    if request.method == 'GET':
        prediction = model.predict([diff_attributes])[0]
        return jsonify({'fitness': str(prediction)})
    if request.method == 'POST':
        pass

@app.route('/predict/similar/<player_id>')
def similar_players(player_id):
    print('similar players for ', player_id)
    top_n_recommendations = get_top_n_recommendations(predictions)
    filtered_recommendations = filter_recommendations_by_position(top_n_recommendations, int(player_id), players_df)
    top_5_recommendations = dict(sorted(filtered_recommendations.items(), key=lambda x: x[1][0][1], reverse=True)[:5])
    return_dict = {}
    for player_id, ratings in top_5_recommendations.items():
        if player_id not in return_dict:
            for overall, prediction_fit in ratings:
                return_dict[player_id] = prediction_fit
    return jsonify(return_dict)

if __name__ == '__main__':
    app.run()
