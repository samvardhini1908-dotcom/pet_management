package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Pet;
import com.example.demo.model.User;

public interface PetRepository extends JpaRepository<Pet,Long>{
    List<Pet> findByOwner(User owner);
    List<Pet>findByAvailableForAdoptionTrue();

    
} 