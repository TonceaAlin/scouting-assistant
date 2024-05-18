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
            String value_string = data.getValue_eur();

            Long value_eur = Long.parseLong(value_string.split("\\.")[0]);
            //TODO: include additional attributes needed for player

            Player player = new Player();
            player.setShortName(shortName);
            player.setPlayerId(player_id);
            player.setOverall(overall);
            player.setValue_eur(value_eur);
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
