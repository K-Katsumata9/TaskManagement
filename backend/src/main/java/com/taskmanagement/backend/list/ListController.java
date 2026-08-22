package com.taskmanagement.backend.list;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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

	public ListController(ListRepository listRepository) {
		this.listRepository = listRepository;
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

}
