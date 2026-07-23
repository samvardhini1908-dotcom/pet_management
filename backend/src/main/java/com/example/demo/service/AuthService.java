package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    // LOGIN
    public ResponseEntity<?> login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()));

        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        JwtResponse response = new JwtResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getRole().name());

        return ResponseEntity.ok(response);
    }

    // REGISTER
    public ResponseEntity<?> register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setRole(User.ROLE.valueOf(request.getRole()));

        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("User registered successfully!"));
    }

    // ADMIN
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public MessageResponse deleteUser(Long id) {

        userRepository.deleteById(id);

        return new MessageResponse("User deleted successfully");
    }

    public MessageResponse updateUser(Long id,
                                      RegisterRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(User.ROLE.valueOf(request.getRole()));

        userRepository.save(user);

        return new MessageResponse("User updated successfully");
    }

    public List<User> getAllVets() {

        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == User.ROLE.ROLE_VET)
                .toList();
    }
}