package com.ubb.backend.domain;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String shortName;
    @Column(name = "player_id", nullable = false)
    private String playerId;
    private Long value_eur;
    private Integer overall;
    // Other player attributes

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team; // Many players belong to one team

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Player player = (Player) o;

        return id.equals(player.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // Constructors can be added if needed
}
