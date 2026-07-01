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
    PetRepository repo;

    public List<Pet>getAllPets(){
        return repo.findAll();
    }

    public Optional<Pet>getPetById(Long id){
        return repo.findById(id);
    }

    public List<Pet>getPetsByOwner(String username)
    {
        return repo.findByOwner();
    }


    
}
