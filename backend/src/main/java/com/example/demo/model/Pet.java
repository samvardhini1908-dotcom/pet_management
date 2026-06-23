package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "pets")
public class Pet {

    private Long id;

    @NotBlank(message = "Pet name is required")
    @Column(nullable = false)
    private String petName;

    @NotBlank(message = "Species is required")
    private String species;
    private String breed;

    @NotNull(message = "Age is required")
    private int age;
    private String gender;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;

    private boolean availableForAdoption;






    
}
