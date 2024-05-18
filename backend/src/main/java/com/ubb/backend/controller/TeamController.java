package com.ubb.backend.controller;


import com.ubb.backend.domain.Team;
import com.ubb.backend.exceptions.EmployeeNotFoundException;
import com.ubb.backend.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200/")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping(value = "/teams")
    public List<Team> getTeams(){
        return teamService.getAllTeams();
    }

    @GetMapping("/teams/{id}")
    Team getTeam(@PathVariable Long id) throws EmployeeNotFoundException{

        return teamService.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    @GetMapping("/teams/bound/{id}")
    List<Team> getTeamByLeague(@PathVariable Long id){
        return teamService.findByLeague(id);

    }
}
