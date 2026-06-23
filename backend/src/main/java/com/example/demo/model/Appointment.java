package com.example.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "appointments")
public class Appointment {
    private Long id;
    private LocalDateTime appointmentDate;
    private String purpose;
    private String status;
    @ManyToOne
    private Pet pet;
    @ManyToOne
    private User veterinar
    
}
