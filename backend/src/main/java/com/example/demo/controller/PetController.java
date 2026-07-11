package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Pet;
import com.example.demo.service.AdoptionService;
import com.example.demo.service.PetService;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping("/api/pets")
public class PetController {
    private final PetService petService;
    private final AdoptionService adoptionService;
    public PetController(PetService petService, AdoptionService adoptionService) {
        this.petService = petService;
        this.adoptionService = adoptionService;
    }

    
    @GetMapping("")
    public List<Pet> getAllPets()
    {
        return petService.getAllPets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id)
    {
        return petService.getPetById(id)
        .map(pet->ResponseEntity.status(200).body(pet))
        .orElse(ResponseEntity.status(404).build());

    }



    
}
