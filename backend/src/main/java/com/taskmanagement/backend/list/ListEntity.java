package com.taskmanagement.backend.list;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "list")
public class ListEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	private Integer position;

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public Integer getPosition() {
		return position;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setPosition(Integer position) {
		this.position = position;
	}

}
