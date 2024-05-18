package com.ubb.backend.controller;


import com.ubb.backend.domain.League;
import com.ubb.backend.service.LeagueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200/")
public class LeagueController {

    @Autowired
    private LeagueService leagueService;

    @GetMapping(value = "/leagues")
    public List<League> getLeagues(){
        return leagueService.getAllLeagues();
    }
}
