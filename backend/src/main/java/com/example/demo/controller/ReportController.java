package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.AdoptionRequestRepository;
import com.example.demo.repository.MedicalRecordRepository;
import com.example.demo.repository.VaccinationRepository;

@CrossOrigin
@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    @Autowired
    private VaccinationRepository vaccinationRepository;

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @GetMapping("/vaccinations")
    public Map<String,Object> getAdoptionsReport()
    {
        Map<String,Object> report = new HashMap<>();
        report.put("total", adoptionRequestRepository.count());
        return report;
    }

    @Ge
    
}
