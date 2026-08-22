package com.taskmanagement.backend.card;

import jakarta.validation.constraints.NotBlank;

public class CardUpdateRequest {

	@NotBlank
	private String title;

	@NotBlank
	private String priority;

	public String getTitle() {
		return title;
	}

	public String getPriority() {
		return priority;
	}

}
