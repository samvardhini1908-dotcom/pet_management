package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    public MedicalRecord() {
    }

    public MedicalRecord(Long id, String diagnosis, String prescription, LocalDate visitDate, String status,
            User veterinarian, Pet pet) {
        this.id = id;
        this.diagnosis = diagnosis;
        this.prescription = prescription;
        this.visitDate = visitDate;
        this.status = status;
        this.veterinarian = veterinarian;
        this.pet = pet;
    }

    

    
}
