package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Pet;
import com.example.demo.service.AdoptionService;
import com.example.demo.service.PetService;


import jakarta.validation.Valid;

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
        .map(pet ->ResponseEntity.status(200).body(pet))
        .orElse(ResponseEntity.status(404).build());

    }

    @PostMapping("")
    @PreAuthorize("hasRole('OWNER') or hasRole('SHELTER') or hasRole('ADMIN')")
    public ResponseEntity<?> savePet(@Valid @RequestBody Pet pet)
    {
        if(!adoptionService.canShelterAcceptPet(pet.getShelter().getId()))
        {
            return ResponseEntity.badRequest()
            .body("Error: Shelter is at maximum capacity!");
        }
        petService.savePet(pet);
        return ResponseEntity.status(200).body("Pet created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('SHELTER') or hasRole('ADMIN')")
    public ResponseEntity<?> updatePet(@PathVariable Long id,@Valid @RequestBody Pet petDetails)
    {
        Pet existingPet = petService.getPetById(id)
        .orElseThrow(()->new RuntimeException("Pet not found"));

        if(!adoptionService.canShelterAcceptPet(id))
        {
            return ResponseEntity.badRequest().build();
        }

        existingPet.setPetName(petDetails.getPetName());
        existingPet.setSpecies(petDetails.getSpecies());
        existingPet.setBreed(petDetails.getBreed());
        existingPet.setAge(petDetails.getAge());
        existingPet.setGender(petDetails.getGender());
        existingPet.setImageUrl(petDetails.getImageUrl());
        existingPet.setAvailableForAdoption(petDetails.getAvailableForAdoption());

        petService.savePet(existingPet);

        return ResponseEntity.ok("Pet updated successfully.");

    }






    
}
