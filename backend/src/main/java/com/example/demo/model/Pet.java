package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "pets")
public class Pet {

    private Long id;
    private String petName;
    private String species;
    

    
}
