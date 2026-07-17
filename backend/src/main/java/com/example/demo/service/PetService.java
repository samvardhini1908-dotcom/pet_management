package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Pet;

public interface PetService {

    List<Pet> getAllPets();

    Optional<Pet> getPetById(Long id);

    List<Pet> getPetsByOwner(String username);

    List<Pet> getPetsForAdoption();

    Pet savePet(Pet pet);

    void deletePet(Long id);
}