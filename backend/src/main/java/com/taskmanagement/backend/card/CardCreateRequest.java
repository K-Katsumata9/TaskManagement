package com.taskmanagement.backend.card;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CardCreateRequest {

	@NotNull
	private Long listId;

	@NotBlank
	private String title;

	@NotBlank
	private String priority;

	public Long getListId() {
		return listId;
	}

	public String getTitle() {
		return title;
	}

	public String getPriority() {
		return priority;
	}

}
