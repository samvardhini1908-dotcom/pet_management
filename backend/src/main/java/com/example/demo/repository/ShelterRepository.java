package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Shelter;
@Repository
public interface ShelterRepository extends JpaRepository<Shelter,Long>{
    // findAll();
    // @Override
    // default Optional<Shelter> findById(Long id) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'findById'");
    // }

    
} 