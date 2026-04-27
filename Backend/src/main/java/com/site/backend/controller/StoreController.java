package com.site.backend.controller;

import com.site.backend.model.Store;
import com.site.backend.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import com.site.backend.dto.StoreDTO;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:4200")
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @GetMapping
    public List<StoreDTO> getAllStore() {
        return storeRepository.findAll()
                .stream()
                .map(Store -> new StoreDTO(Store.getId(), Store.getName(), Store.getStatus()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public Store createStore(@RequestBody Store store) {
        return storeRepository.save(store);
    }

    @DeleteMapping("/{id}")
    public void deleteStore(@PathVariable int id) {
        storeRepository.deleteById(id);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<StoreDTO> getStoreByOwner(@PathVariable int ownerId) {
        return storeRepository.findByOwnerId(ownerId)
                .map(store -> ResponseEntity.ok(new StoreDTO(store.getId(), store.getName(), store.getStatus())))
                .orElse(ResponseEntity.notFound().build());
    }
}
