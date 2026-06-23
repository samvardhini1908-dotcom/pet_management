package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Shelter;

public interface ShelterRepository extends JpaRepository<Shelter,Long>{
    findAll();
    @Override
    default Optional<Shelter> findById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    
} 