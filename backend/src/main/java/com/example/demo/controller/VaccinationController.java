package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.VaccinationService;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
public class VaccinationController {
    private final VaccinationService vaccinationService;
    
    
}
