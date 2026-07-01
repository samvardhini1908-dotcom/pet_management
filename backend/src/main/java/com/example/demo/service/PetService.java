package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.PetRepository;

@Service
public class PetService {
    @Autowired
    PetRepository repo;

    
    
}
