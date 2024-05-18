package com.ubb.backend.DTO;

import lombok.Data;

import java.util.Map;
@Data
public class SimilarPlayerDTOAPI {
    private String id;
    private String short_name;
    private String prediction_score;
    private String overall;
    private String potential;

}
