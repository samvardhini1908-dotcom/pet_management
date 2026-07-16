package com.example.demo.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Vaccination;
import com.example.demo.service.VaccinationService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("/api/vaccinations")
public class VaccinationController {
    private final VaccinationService vaccinationService;

    public VaccinationController(VaccinationService vaccinationService) {
        this.vaccinationService = vaccinationService;
    }

    @GetMapping
    {
        public List<Vaccination> getAllVaccinations()
        {
            return vaccinationService.getAllVaccinations();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('VET') or hasRole('ADMIN'))
    public Vaccination savedVaccination(@RequestBody Va)

    
}
