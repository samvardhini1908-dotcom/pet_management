package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.AdoptionService;
import com.example.demo.service.PetService;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping("/api/pets")
public class PetController {
    private final PetService petService;
    private final AdoptionService adoptionService;

    

    
}
