package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.service.AuthService;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)

public class AuthController {
     @Autowired
    private AuthService authService;

   @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) 
   {
    return authService.login(request);
   }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request)
    {
    return authService.register(request);
    }

    // ADMIN - GET ALL USERS
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {

        return authService.getAllUsers();
    }

    // ADMIN - UPDATE USER
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateUser(
            @PathVariable Long id,
            @RequestBody RegisterRequest request) {

        authService.updateUser(id, request);

        return ResponseEntity.ok(
                new MessageResponse("User updated successfully"));
    }

    // PUBLIC - GET ALL VETS
    @GetMapping("/vets")
    public List<User> getAllVets() {

        return authService.getAllVets();
    }

    // ADMIN - DELETE USER
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteUser(
            @PathVariable Long id) {

        authService.deleteUser(id);

        return ResponseEntity.ok(
                new MessageResponse("User deleted successfully"));
    }
}
