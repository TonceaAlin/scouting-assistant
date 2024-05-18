package com.ubb.backend.repository;

import com.ubb.backend.domain.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {



    League findLeagueById(Long id);
    League findLeagueByReference(String reference);
}
