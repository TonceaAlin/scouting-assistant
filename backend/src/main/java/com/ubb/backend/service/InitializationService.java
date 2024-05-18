package com.ubb.backend.service;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class InitializationService implements InitializingBean {

    @Autowired
    private LeagueService leagueService;

    @Autowired
    private TeamService teamService;

    @Autowired
    private PlayerService playerService;

    @Override
    public void afterPropertiesSet() {
        leagueService.initialize();
        teamService.initialize();
        playerService.initialize();
    }
}
