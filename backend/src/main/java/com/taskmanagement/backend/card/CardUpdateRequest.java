package com.taskmanagement.backend.card;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CardUpdateRequest {

	@NotBlank
	private String title;

	private String description;

	@NotBlank
	@Pattern(regexp = "高|中|低")
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
