package com.ubb.backend.service;

import com.ubb.backend.DTO.PredictionDTOAPI;
import com.ubb.backend.DTO.SimilarPlayerDTOAPI;
import com.ubb.backend.domain.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class PredictionAPIService {

    private final String FLASK_API_URL_PREDICT = "http://127.0.0.1:5000/predict/player/%s/team/%s";
    private final String FLASK_API_URL_SIMILAR = "http://127.0.0.1:5000/predict/similar/%s";

    private final RestTemplate restTemplate;

    private final PlayerService playerService;


    public PredictionAPIService(RestTemplate restTemplate, PlayerService playerService) {
        this.restTemplate = restTemplate;
        this.playerService = playerService;
    }

    public String getPrediction(String playerId, String teamId) {
        String apiUrl = String.format(FLASK_API_URL_PREDICT, playerId, teamId);
        ResponseEntity<PredictionDTOAPI> responseEntity = restTemplate.getForEntity(apiUrl, PredictionDTOAPI.class);
        return Objects.requireNonNull(responseEntity.getBody()).getFitness();
    }

    public List<SimilarPlayerDTOAPI> getSimilarPlayers(String playerId) {
        Player existingPlayer = this.playerService.findById(Long.valueOf(playerId)).get();
        String apiUrl = String.format(FLASK_API_URL_SIMILAR, existingPlayer.getPlayerId());
        ResponseEntity<Map<String, String>> responseEntity = restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, String>>() {}
        );
        Map<String, String> responseBody = responseEntity.getBody();
        assert responseBody != null;
        List<SimilarPlayerDTOAPI> recommendedPlayers = new ArrayList<>();
        for( var entry: responseBody.entrySet()){
            Long newPlayer_id = Long.valueOf(entry.getKey());
            String predictionScore = entry.getValue();
            Player similarPlayer = this.playerService.findByPlayerId(String.valueOf(newPlayer_id));
            SimilarPlayerDTOAPI recommendedPlayer = new SimilarPlayerDTOAPI();
            recommendedPlayer.setId(String.valueOf(similarPlayer.getId()));
            recommendedPlayer.setShort_name(similarPlayer.getShortName());
            recommendedPlayer.setPrediction_score(predictionScore);
            recommendedPlayer.setOverall(String.valueOf(similarPlayer.getOverall()));
//            recommendedPlayer.setPotential(existingPlayer.getPotential());
            recommendedPlayers.add(recommendedPlayer);
        }
        return recommendedPlayers;
    }
}
