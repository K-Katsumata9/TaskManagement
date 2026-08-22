package com.taskmanagement.backend.card;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;

public class CardUpdateRequest {

	@NotBlank
	private String title;

	private String description;

	@NotBlank
	private String priority;

	private LocalDate dueDate;

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public String getPriority() {
		return priority;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

}
