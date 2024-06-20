package com.ubb.backend.domain;

import lombok.Data;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Data
@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String shortName;
    @Column(name = "player_id", nullable = false)
    private String playerId;
    private BigDecimal valueEur; // BigDecimal for currency values

    private Integer overall;

    // Additional player attributes based on JSON structure
    private Integer age;
    private Integer attackingCrossing;
    private Integer attackingFinishing;
    private Integer attackingHeadingAccuracy;
    private Integer attackingShortPassing;
    private Integer attackingVolleys;
    private Integer clubContractValidUntilYear;
    private Integer defending;
    private Integer defendingMarkingAwareness;
    private Integer defendingSlidingTackle;
    private Integer defendingStandingTackle;
    private Integer dribbling;
    private Integer goalkeepingDiving;
    private Integer goalkeepingHandling;
    private Integer goalkeepingKicking;
    private Integer goalkeepingPositioning;
    private Integer goalkeepingReflexes;
    private Integer goalkeepingSpeed;
    private Integer heightCm;
    private Integer mentalityAggression;
    private Integer mentalityComposure;
    private Integer mentalityInterceptions;
    private Integer mentalityPenalties;
    private Integer mentalityPositioning;
    private Integer mentalityVision;
    private Integer movementAcceleration;
    private Integer movementAgility;
    private Integer movementBalance;
    private Integer movementReactions;
    private Integer movementSprintSpeed;
    private String nationalityName;
    private Integer pace;
    private Integer passing;
    private Integer physic;
    private String playerPositions;
    private String playerTags;
    private String playerTraits;
    private Integer potential;
    private Integer powerJumping;
    private Integer powerLongShots;
    private Integer powerShotPower;
    private Integer powerStamina;
    private Integer powerStrength;
    private String preferredFoot;
    private Integer shooting;
    private Integer skillBallControl;
    private Integer skillCurve;
    private Integer skillDribbling;
    private Integer skillFkAccuracy;
    private Integer skillLongPassing;
    private Integer skillMoves;
    private Integer weakFoot;
    private Integer weightKg;


    @ManyToOne(fetch = FetchType.EAGER)
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
