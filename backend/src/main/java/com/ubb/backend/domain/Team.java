package com.ubb.backend.domain;

import lombok.*;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String clubId;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "league_id")
    private League league;

    @Override
    public boolean equals(Object o){
        if(this == o){
            return true;
        }
        if(!(o instanceof Team)){
            return false;
        }
        return id != null && id.equals(((Team) o).getId());
    }

    @Override
    public int hashCode(){
        return getClass().hashCode();
    }

    // Constructors can be added if needed
}
