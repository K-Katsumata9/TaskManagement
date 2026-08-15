package com.taskmanagement.backend.list;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
