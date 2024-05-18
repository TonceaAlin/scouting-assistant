package com.ubb.backend.repository;

import com.ubb.backend.domain.League;
import com.ubb.backend.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Team findTeamByClubId(String id);
    List<Team> findTeamByLeague(League league);

    Team findTeamById(Long id);

    Team findTeamByName(String name);

}
