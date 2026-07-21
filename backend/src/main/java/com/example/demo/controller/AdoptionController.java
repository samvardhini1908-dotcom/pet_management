package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AdoptionRequest;
import com.example.demo.service.AdoptionService;

@CrossOrigin
@RestController
@RequestMapping("/api/adoptions")

public class AdoptionController {
    private final AdoptionService adoptionService;


     @Autowired
    public AdoptionController(AdoptionService adoptionService) {
        this.adoptionService = adoptionService;
    }

    @GetMapping
    public List<AdoptionRequest> getAllAdoptions()
    {
        return adoptionService.getAllRequests();
    }
    
     
    
}
