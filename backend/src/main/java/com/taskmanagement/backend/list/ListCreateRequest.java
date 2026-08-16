package com.taskmanagement.backend.list;

import jakarta.validation.constraints.NotBlank;

public class ListCreateRequest {

	@NotBlank
	private String title;

	public String getTitle() {
		return title;
	}

}
