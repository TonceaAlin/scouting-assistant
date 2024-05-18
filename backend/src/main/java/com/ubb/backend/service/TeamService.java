package com.ubb.backend.service;

import com.ubb.backend.DTO.TeamDTOAPI;
import com.ubb.backend.domain.League;
import com.ubb.backend.domain.Team;
import com.ubb.backend.repository.LeagueRepository;
import com.ubb.backend.repository.PlayerRepository;
import com.ubb.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private PlayerRepository playerRepository;

    public List<Team> getAllTeams(){
        return teamRepository.findAll();
    }

    public void initialize(){
        if(teamRepository.count() == 0){
            fetchAndSaveTeams();
        }
    }

    private void fetchAndSaveTeams() {
        String teamsEndpoint = "http://127.0.0.1:5000/teams";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<TeamDTOAPI[]> responseEntity = restTemplate.getForEntity(teamsEndpoint, TeamDTOAPI[].class);
        TeamDTOAPI[] teams = responseEntity.getBody();

        assert teams != null;

        Arrays.stream(teams).map(data -> {

            String name = data.getClub_name();

            String clubId= data.getClub_team_id();
            Team team = new Team();
            team.setName(name);
            team.setClubId(clubId);

            String league_reference = String.valueOf(Double.valueOf(String.valueOf(data.getLeague_id())).longValue());
            League league = leagueRepository.findLeagueByReference(league_reference);
            team.setLeague(league);

//            League league = leagueRepository.findByReferenceWithTeams(String.valueOf(Double.valueOf(league_reference).intValue()));
//            League league = leagueRepository.findLeagueByReference(String.valueOf(Double.valueOf(league_reference).intValue()));

            return team;

        }).forEach(teamRepository::save);
    }

    public Optional<Team> findById(Long id) {
        return this.teamRepository.findById(id);
    }

    public List<Team> findByLeague(Long leagueId){
        League boundLeague = this.leagueRepository.findLeagueById(leagueId);
        return this.teamRepository.findTeamByLeague(boundLeague);
    }

    public Team findByName(String name){
        return this.teamRepository.findTeamByName(name);
    }
}
