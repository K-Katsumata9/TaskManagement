package com.taskmanagement.backend.card;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CardController {

	private final CardRepository cardRepository;

	public CardController(CardRepository cardRepository) {
		this.cardRepository = cardRepository;
	}

	@GetMapping("/api/cards")
	public List<Card> getCards() {
		return cardRepository.findAll();
	}

}
