package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.AdoptionRequest;
import com.example.demo.model.User;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest,Long> {
    List<AdoptionRequest>findByApplicant(User applicant);

    
} 