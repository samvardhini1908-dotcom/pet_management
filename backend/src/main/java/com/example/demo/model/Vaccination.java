package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;

@Entity
public class Vaccination {
    private Long id;
    private String vaccineName;
    private LocalDate vaccinationDate;
    private LocalDate nextDueDate;
    private String status;
    private Pet pet;
    
}
