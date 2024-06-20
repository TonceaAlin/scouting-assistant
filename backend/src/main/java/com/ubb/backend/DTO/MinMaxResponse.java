package com.ubb.backend.DTO;

import lombok.Data;

import java.util.Map;

@Data
public class MinMaxResponse {
    private Map<String, Integer> minValues;
    private Map<String, Integer> maxValues;

    public MinMaxResponse(Map<String, Integer> min, Map<String, Integer> max){
        minValues = min;
        maxValues = max;
    }

}
