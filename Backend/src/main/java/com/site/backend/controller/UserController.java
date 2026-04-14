package com.site.backend.controller;

import com.site.backend.model.User;
import com.site.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import com.site.backend.dto.UserDTO;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserDTO> getAllUser() {
        return userRepository.findAll()
                .stream()
                .map(User -> new UserDTO(User.getId(), User.getGender()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userRepository.deleteById(id);
    }
}
