package com.taskmanagement.backend.list;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ListRepository extends JpaRepository<ListEntity, Long> {
}
