package com.taskmanagement.backend.card;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "card")
public class Card {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "list_id")
	private Long listId;

	private String title;

	private Integer position;

	private String priority;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public Long getId() {
		return id;
	}

	public Long getListId() {
		return listId;
	}

	public String getTitle() {
		return title;
	}

	public Integer getPosition() {
		return position;
	}

	public String getPriority() {
		return priority;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setListId(Long listId) {
		this.listId = listId;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setPosition(Integer position) {
		this.position = position;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

}
