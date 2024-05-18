package com.ubb.backend.service;

import com.ubb.backend.DTO.LeagueDTOAPI;
import com.ubb.backend.domain.League;
import com.ubb.backend.repository.LeagueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class LeagueService {

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private final RestTemplate restTemplate;

    public LeagueService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<League> getAllLeagues(){
        return leagueRepository.findAll();
    }

    public void initialize(){
        if(leagueRepository.count() == 0){
            fetchAndSaveLeagues();
        }
    }

    private void fetchAndSaveLeagues() {
        String leaguesEndpoint =  "http://127.0.0.1:5000/leagues";
        ResponseEntity<LeagueDTOAPI[]> responseEntity = restTemplate.getForEntity(leaguesEndpoint, LeagueDTOAPI[].class);
        LeagueDTOAPI[] leagues = responseEntity.getBody();
        assert leagues != null;
        Arrays.stream(leagues).map(data -> {
            String leagueID = String.valueOf(data.getLeague_id());
            String name = data.getLeague_name();
            String nation = data.getNationality_name();

            League league = new League();
            league.setName(name);
            league.setNation(nation);
            league.setReference(leagueID);

            return league;
        }).forEach(leagueRepository::save);

    }
}
