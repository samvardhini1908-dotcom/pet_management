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

    public Pet() {
    }

    public Pet(Long id, @NotBlank(message = "Pet name is required") String petName,
            @NotBlank(message = "Species is required") String species, String breed,
            @NotNull(message = "Age is required") int age, String gender, String imageUrl, User owner, Shelter shelter,
            boolean availableForAdoption) {
        this.id = id;
        this.petName = petName;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.gender = gender;
        this.imageUrl = imageUrl;
        this.owner = owner;
        this.shelter = shelter;
        this.availableForAdoption = availableForAdoption;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getImageUrl() {
        return imageUrl;
    }


    
}
