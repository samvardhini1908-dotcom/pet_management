package com.example.demo.service;

import java.util.List;

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


    
}
