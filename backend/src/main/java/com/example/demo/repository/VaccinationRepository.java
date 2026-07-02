package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Pet;
import com.example.demo.model.Vaccination;
@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination,Long>{

    List<Vaccination>findByPet(Pet pet);
    
} 