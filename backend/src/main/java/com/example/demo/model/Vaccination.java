package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "vaccinations")
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String vaccineName;
    private LocalDate vaccinationDate;
    private LocalDate nextDueDate;
    private String status;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    public Vaccination() {
    }

    public Vaccination(Long id, String vaccineName, LocalDate vaccinationDate, LocalDate nextDueDate, String status,
            Pet pet) {
        this.id = id;
        this.vaccineName = vaccineName;
        this.vaccinationDate = vaccinationDate;
        this.nextDueDate = nextDueDate;
        this.status = status;
        this.pet = pet;
    }

    

    
}
