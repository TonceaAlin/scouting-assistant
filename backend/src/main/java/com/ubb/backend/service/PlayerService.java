package com.ubb.backend.service;

import com.ubb.backend.DTO.PlayerDTOAPI;
import com.ubb.backend.domain.Player;
import com.ubb.backend.domain.Team;
import com.ubb.backend.repository.PlayerRepository;
import com.ubb.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    public Page<Player> getAllPlayers(Pageable pageable){
        return playerRepository.findAll(pageable);
    }

    public void initialize(){
        if(playerRepository.count() == 0){
            fetchAndSavePlayers();
        }
    }

    private void fetchAndSavePlayers() {
        String playersEndpoint = "http://127.0.0.1:5000/players";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlayerDTOAPI[]> responseEntity = restTemplate.getForEntity(playersEndpoint, PlayerDTOAPI[].class);
        PlayerDTOAPI[] players = responseEntity.getBody();
        assert players != null;
        Arrays.stream(players).map(data -> {
            String shortName = new String(data.getShort_name().getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8);
            String player_id = data.getPlayer_id();
            Integer overall = Integer.parseInt(data.getOverall());
            BigDecimal valueEur = new BigDecimal(data.getValue_eur());



            Player player = new Player();
            player.setShortName(shortName);
            player.setPlayerId(player_id);
            player.setOverall(overall);
            player.setValueEur(valueEur);
            player.setAge(Integer.parseInt(data.getAge()));
            player.setAttackingCrossing(Integer.parseInt(data.getAttacking_crossing()));
            player.setAttackingFinishing(Integer.parseInt(data.getAttacking_finishing()));
            player.setAttackingHeadingAccuracy(Integer.parseInt(data.getAttacking_heading_accuracy()));
            player.setAttackingShortPassing(Integer.parseInt(data.getAttacking_short_passing()));
            player.setAttackingVolleys(Integer.parseInt(data.getAttacking_volleys()));
            player.setClubContractValidUntilYear(Integer.parseInt(data.getClub_contract_valid_until_year().split("\\.")[0]));
            player.setDefending(Integer.parseInt(data.getDefending().split("\\.")[0]));
            player.setDefendingMarkingAwareness(Integer.parseInt(data.getDefending_marking_awareness()));
            player.setDefendingSlidingTackle(Integer.parseInt(data.getDefending_sliding_tackle()));
            player.setDefendingStandingTackle(Integer.parseInt(data.getDefending_standing_tackle()));
            player.setDribbling(Integer.parseInt(data.getDribbling().split("\\.")[0]));
            player.setGoalkeepingDiving(Integer.parseInt(data.getGoalkeeping_diving()));
            player.setGoalkeepingHandling(Integer.parseInt(data.getGoalkeeping_handling()));
            player.setGoalkeepingKicking(Integer.parseInt(data.getGoalkeeping_kicking()));
            player.setGoalkeepingPositioning(Integer.parseInt(data.getGoalkeeping_positioning()));
            player.setGoalkeepingReflexes(Integer.parseInt(data.getGoalkeeping_reflexes()));
            player.setGoalkeepingSpeed(Integer.parseInt(data.getGoalkeeping_speed().split("\\.")[0]));
            player.setHeightCm(Integer.parseInt(data.getHeight_cm()));
            player.setMentalityAggression(Integer.parseInt(data.getMentality_aggression()));
            player.setMentalityComposure(Integer.parseInt(data.getMentality_composure().split("\\.")[0]));
            player.setMentalityInterceptions(Integer.parseInt(data.getMentality_interceptions()));
            player.setMentalityPenalties(Integer.parseInt(data.getMentality_penalties()));
            player.setMentalityPositioning(Integer.parseInt(data.getMentality_positioning()));
            player.setMentalityVision(Integer.parseInt(data.getMentality_vision()));
            player.setMovementAcceleration(Integer.parseInt(data.getMovement_acceleration()));
            player.setMovementAgility(Integer.parseInt(data.getMovement_agility()));
            player.setMovementBalance(Integer.parseInt(data.getMovement_balance()));
            player.setMovementReactions(Integer.parseInt(data.getMovement_reactions()));
            player.setMovementSprintSpeed(Integer.parseInt(data.getMovement_sprint_speed()));
            player.setNationalityName(data.getNationality_name());
            player.setPace(Integer.parseInt(data.getPace().split("\\.")[0]));
            player.setPassing(Integer.parseInt(data.getPassing().split("\\.")[0]));
            player.setPhysic(Integer.parseInt(data.getPhysic().split("\\.")[0]));
            player.setPlayerPositions(data.getPlayer_positions());
            player.setPlayerTags(data.getPlayer_tags());
            player.setPlayerTraits(data.getPlayer_traits());
            player.setPotential(Integer.parseInt(data.getPotential()));
            player.setPowerJumping(Integer.parseInt(data.getPower_jumping()));
            player.setPowerLongShots(Integer.parseInt(data.getPower_long_shots()));
            player.setPowerShotPower(Integer.parseInt(data.getPower_shot_power()));
            player.setPowerStamina(Integer.parseInt(data.getPower_stamina()));
            player.setPowerStrength(Integer.parseInt(data.getPower_strength()));
            player.setPreferredFoot(data.getPreferred_foot());
            player.setShooting(Integer.parseInt(data.getShooting().split("\\.")[0]));
            player.setSkillBallControl(Integer.parseInt(data.getSkill_ball_control()));
            player.setSkillCurve(Integer.parseInt(data.getSkill_curve()));
            player.setSkillDribbling(Integer.parseInt(data.getSkill_dribbling()));
            player.setSkillFkAccuracy(Integer.parseInt(data.getSkill_fk_accuracy()));
            player.setSkillLongPassing(Integer.parseInt(data.getSkill_long_passing()));
            player.setSkillMoves(Integer.parseInt(data.getSkill_moves()));
            player.setWeakFoot(Integer.parseInt(data.getWeak_foot()));
            player.setWeightKg(Integer.parseInt(data.getWeight_kg()));


            String club_reference = String.valueOf(data.getClub_team_id());
            Team team = teamRepository.findTeamByClubId(String.valueOf(Double.valueOf(club_reference).intValue()));
            player.setTeam(team);
            return player;
        }).forEach(playerRepository::save);
    }

    public Optional<Player> findById(Long id) {
        return playerRepository.findById(id);
    }

    public List<Player> findByTeam(Long teamId) {
        Team team = this.teamRepository.findTeamById(teamId);
        return this.playerRepository.findPlayersByTeam(team);
    }

    public Player findByName(String name){
        return this.playerRepository.findPlayerByShortName(name);
    }

    public Player findByPlayerId(String player_id){
        return this.playerRepository.findPlayerByPlayerId(player_id);
    }

    public Page<Player> searchPlayers(String searchTerm, Pageable pageable) {
        System.out.println(this.playerRepository.findPlayersByShortNameContainingIgnoreCase("Rodr", pageable).getContent());
        return this.playerRepository.findPlayersByShortNameContainingIgnoreCase(searchTerm, pageable);
    }
}
