package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "shelters")
public class Shelter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shelterName;
    private String location;
    private int capacity;
    public Shelter() {
    }
    public Shelter(Long id, String shelterName, String location, int capacity) {
        this.id = id;
        this.shelterName = shelterName;
        this.location = location;
        this.capacity = capacity;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getShelterName() {
        return shelterName;
    }
    public void setShelterName(String shelterName) {
        this.shelterName = shelterName;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public int getCapacity() {
        return capacity;
    }
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    
    
    
}
