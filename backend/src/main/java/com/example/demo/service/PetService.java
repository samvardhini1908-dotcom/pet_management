package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Pet;
import com.example.demo.repository.PetRepository;

@Service
@Transactional
public class PetService {
    @Autowired
    PetRepository petRepository;

    public List<Pet>getAllPets(){
        return petRepository.findAll();
    }

    public Optional<Pet>getPetById(Long id){
        return petRepository.findById(id);
    }

    public List<Pet>getPetsByOwner(String username)
    {
        return petRepository.findByOwner(username);
    }

    public List<Pet>getPetsForAdoption(){
        return petRepository.findByAvailableForAdoptionTrue();

    }

    public Pet savePet(Pet pet)
    {
        return petRepository.save(pet);
    }

    public void deletePet(Long id)
    {
        petRepository.deleteById(id);
    }


    
}
