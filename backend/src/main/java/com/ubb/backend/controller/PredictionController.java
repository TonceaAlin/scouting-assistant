package com.ubb.backend.controller;


import com.ubb.backend.DTO.SimilarPlayerDTOAPI;
import com.ubb.backend.domain.Player;
import com.ubb.backend.domain.Team;
import com.ubb.backend.service.PlayerService;
import com.ubb.backend.service.PredictionAPIService;
import com.ubb.backend.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
