package com.ubb.backend.DTO;

import lombok.Data;

@Data
public class PlayerDTOAPI {
    private String short_name;
    private String club_name;
    private String club_team_id;
    private String player_id;
    private String overall;
    private String value_eur;
}
