package com.ubb.backend.DTO;

import lombok.Data;

@Data
public class TeamDTOAPI {
    String team_name;
    String league_id;
    String league_name;
    String team_id;
    String attack;
    String defence;
    String midfield;
    String overall;
    String potential_average;
    String starting_xi_average_age;
}
