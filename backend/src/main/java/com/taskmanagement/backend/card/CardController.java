package com.taskmanagement.backend.card;

import java.util.List;
import com.taskmanagement.backend.list.ListRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class CardController {

	private final CardRepository cardRepository;
	private final ListRepository listRepository;

	public CardController(CardRepository cardRepository, ListRepository listRepository) {
		this.cardRepository = cardRepository;
		this.listRepository = listRepository;
	}

	@GetMapping("/api/cards")
	public List<Card> getCards() {
		return cardRepository.findAll();
	}

	@PostMapping("/api/cards")
	@ResponseStatus(HttpStatus.CREATED)
	public Card createCard(@Valid @RequestBody CardCreateRequest request) {
		if (!listRepository.existsById(request.getListId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "指定されたlistIdのリストが存在しません");
		}

		int nextPosition = cardRepository.findMaxPositionByListId(request.getListId()).orElse(0) + 1;

		Card card = new Card();
		card.setListId(request.getListId());
		card.setTitle(request.getTitle());
		card.setDescription(request.getDescription());
		card.setPriority(request.getPriority());
		card.setDueDate(request.getDueDate());
		card.setPosition(nextPosition);

		return cardRepository.save(card);
	}

	@PutMapping("/api/cards/{id}")
	public Card updateCard(@PathVariable Long id, @Valid @RequestBody CardUpdateRequest request) {
		Card card = cardRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "指定されたidのカードが存在しません"));

		card.setTitle(request.getTitle());
		card.setDescription(request.getDescription());
		card.setPriority(request.getPriority());
		card.setDueDate(request.getDueDate());

		return cardRepository.save(card);
	}

	@DeleteMapping("/api/cards/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteCard(@PathVariable Long id) {
		if (!cardRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "指定されたidのカードが存在しません");
		}

		cardRepository.deleteById(id);
	}

	@PutMapping("/api/lists/{listId}/cards/reorder")
	public List<Card> reorderCards(@PathVariable Long listId, @Valid @RequestBody CardReorderRequest request) {
		if (!listRepository.existsById(listId)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "指定されたlistIdのリストが存在しません");
		}

		List<Card> cards = request.getCardIds().stream()
				.map(id -> cardRepository.findById(id)
						.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "指定されたcardIdのカードが存在しません: " + id)))
				.toList();

		for (int i = 0; i < cards.size(); i++) {
			Card card = cards.get(i);
			card.setListId(listId);
			card.setPosition(i + 1);
		}

		return cardRepository.saveAll(cards);
	}

}
