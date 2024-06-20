package com.ubb.backend.controller;


import com.ubb.backend.DTO.MinMaxResponse;
import com.ubb.backend.DTO.SimilarPlayerDTOAPI;
import com.ubb.backend.domain.Player;
import com.ubb.backend.domain.Team;
import com.ubb.backend.service.PlayerService;
import com.ubb.backend.service.PredictionAPIService;
import com.ubb.backend.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/predict")
@CrossOrigin("http://localhost:4200/")
public class PredictionController {


    @Autowired
    private PlayerService playerService;

    @Autowired
    private TeamService teamService;

    @Autowired
    private PredictionAPIService predictionAPIService;

    /** @noinspection OptionalGetWithoutIsPresent*/
    @GetMapping(value = "/player/{player_id}/team/{team_id}")
    public String predictFitness(@PathVariable String player_id, @PathVariable String team_id){
        Optional<Team> proposedTeam = this.teamService.findById(Long.valueOf(team_id));
        Optional<Player> proposedPlayer = this.playerService.findById(Long.valueOf(player_id));
        String teamId = proposedTeam.get().getClubId();
        String playerId = proposedPlayer.get().getPlayerId();
        return this.predictionAPIService.getPrediction(playerId, teamId);

    }

    @GetMapping(value = "/player/similar/{player_id}")
    public List<SimilarPlayerDTOAPI> recommendSimilarPlayers(@PathVariable String player_id){
        return this.predictionAPIService.getSimilarPlayers(player_id);
    }

    @GetMapping("/team/details/{teamId}")
    MinMaxResponse getMinMaxValues(@PathVariable Long teamId, @RequestParam List<String> fieldNames){
        Map<String, Integer> minValues = new HashMap<>();
        Map<String, Integer> maxValues = new HashMap<>();
        List<Player> teamPlayers = this.teamService.findPlayersFromTeam(teamId);
        for(Player player : teamPlayers){
            for (String fieldName : fieldNames) {
                int value = getFieldValue(player, fieldName);
                if (!minValues.containsKey(fieldName)){
                    minValues.put(fieldName, value);
                }else{
                    if ( value < minValues.get(fieldName)){
                        minValues.put(fieldName, value);
                    }
                }
                if (!maxValues.containsKey(fieldName)){
                    maxValues.put(fieldName, value);
                }else{
                    if ( value > maxValues.get(fieldName)){
                        maxValues.put(fieldName, value);
                    }
                }

            }
        }

        return new MinMaxResponse(minValues, maxValues);

    }
    private int getFieldValue(Player player, String fieldName) {
        try {
            Field field = Player.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            return (int) field.get(player);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException("Error accessing field: " + fieldName, e);
        }
    }
}
