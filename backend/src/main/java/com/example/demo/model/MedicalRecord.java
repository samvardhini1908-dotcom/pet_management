package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    private Long id;
    private String diagnosis;
    private String prescription;
    private LocalDate visitDate;
    private String status;
    @ManyToOne
    private User veteri
    
}
