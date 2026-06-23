package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pets")
public class Pet {

    private Long id;
    private String petName;
    private String species;
    private String breed;
    private int age;
    private String gender;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;

    private boolean availa




    
}
