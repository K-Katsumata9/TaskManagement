package com.taskmanagement.backend.list;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ListRepository extends JpaRepository<ListEntity, Long> {

	@Query("SELECT MAX(l.position) FROM ListEntity l")
	Optional<Integer> findMaxPosition();

}
