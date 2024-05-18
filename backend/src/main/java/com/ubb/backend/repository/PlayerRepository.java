package com.ubb.backend.repository;

import com.ubb.backend.domain.Player;
import com.ubb.backend.domain.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findPlayersByTeam(Team team);
    Player findPlayerByShortName(String name);

    Page<Player> findPlayersByShortNameContainingIgnoreCase(String searchTerm, Pageable pageable);
    Player findPlayerByPlayerId(String Player_id);

}
