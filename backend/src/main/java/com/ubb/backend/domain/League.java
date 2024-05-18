package com.ubb.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class League {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String reference;
    private String nation;
//    @OneToMany(
//            mappedBy = "league",
//            cascade = CascadeType.ALL,
//            orphanRemoval = true
//    )
//    private List<Team> leagueTeams = new ArrayList<>();

//    public void addTeam(Team team){
//        leagueTeams.add(team);
//        team.setLeague(this);
//    }
}
