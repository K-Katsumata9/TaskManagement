package com.taskmanagement.backend.card;

import java.util.List;
import jakarta.validation.constraints.NotEmpty;

public class CardReorderRequest {

	@NotEmpty
	private List<Long> cardIds;

	public List<Long> getCardIds() {
		return cardIds;
	}

}
