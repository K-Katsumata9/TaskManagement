package com.taskmanagement.backend.list;

import java.util.List;
import com.taskmanagement.backend.card.CardRepository;
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
public class ListController {

	private final ListRepository listRepository;
	private final CardRepository cardRepository;

	public ListController(ListRepository listRepository, CardRepository cardRepository) {
		this.listRepository = listRepository;
		this.cardRepository = cardRepository;
	}

	@GetMapping("/api/lists")
	public List<ListEntity> getLists() {
		return listRepository.findAll();
	}

	@PostMapping("/api/lists")
	@ResponseStatus(HttpStatus.CREATED)
	public ListEntity createList(@Valid @RequestBody ListCreateRequest request) {
		int nextPosition = listRepository.findMaxPosition().orElse(0) + 1;

		ListEntity list = new ListEntity();
		list.setTitle(request.getTitle());
		list.setPosition(nextPosition);

		return listRepository.save(list);
	}

	@PutMapping("/api/lists/{id}")
	public ListEntity updateList(@PathVariable Long id, @Valid @RequestBody ListUpdateRequest request) {
		ListEntity list = listRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "指定されたidのリストが存在しません"));

		list.setTitle(request.getTitle());

		return listRepository.save(list);
	}

	@DeleteMapping("/api/lists/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteList(@PathVariable Long id) {
		if (!listRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "指定されたidのリストが存在しません");
		}

		if (cardRepository.countByListId(id) > 0) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "リスト内にカードが存在するため削除できません");
		}

		listRepository.deleteById(id);
	}

}
