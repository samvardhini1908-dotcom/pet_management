package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    private Long id;
    private String diagnosis;

    @Column(length = 1000)
    private String prescription;
    private LocalDate visitDate;
    private String status;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    private User veterinarian;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    
}
