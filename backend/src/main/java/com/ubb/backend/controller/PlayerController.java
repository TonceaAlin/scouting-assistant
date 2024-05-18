package com.ubb.backend.controller;

import com.ubb.backend.domain.Player;
import com.ubb.backend.exceptions.PlayerNotFoundException;
import com.ubb.backend.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200/")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping(value = "/players")
    public ResponseEntity<List<Player>> getPlayers(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Player> playersPage = playerService.getAllPlayers(pageable);

        List<Player> players = playersPage.getContent();
        return ResponseEntity.ok().body(players);
    }

    @GetMapping("/players/{id}")
    Player getPlayer(@PathVariable Long id) throws PlayerNotFoundException{

        return playerService.findById(id).orElseThrow(() -> new PlayerNotFoundException(id));
    }

    @GetMapping("/players/bound/{id}")
    List<Player> getPlayersByTeam(@PathVariable Long id){
        return playerService.findByTeam(id);
    }

    @GetMapping("/players/search")
    ResponseEntity<List<Player>> searchPlayers(@RequestParam String searchTerm,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Player> playersPage = playerService.searchPlayers(searchTerm, pageable);
        System.out.println(searchTerm);
        List<Player> players = playersPage.getContent();
        return ResponseEntity.ok().body(players);
    }


}
