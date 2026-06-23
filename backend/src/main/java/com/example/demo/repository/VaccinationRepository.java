package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Pet;
import com.example.demo.model.Vaccination;

public interface VaccinationRepository extends JpaRepository<Vaccination,Long>{

    List<Vaccination>findByPet(Pet pet);
    
} 