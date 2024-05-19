package com.ubb.backend.controller;

import com.ubb.backend.domain.User;
import com.ubb.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200/")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user.getUsername(), user.getPassword(), user.getRole());
        return ResponseEntity.ok(registeredUser);
    }
}
