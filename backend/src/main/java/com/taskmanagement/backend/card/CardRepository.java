package com.taskmanagement.backend.card;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardRepository extends JpaRepository<Card, Long> {

	@Query("SELECT MAX(c.position) FROM Card c WHERE c.listId = :listId")
	Optional<Integer> findMaxPositionByListId(@Param("listId") Long listId);

}
