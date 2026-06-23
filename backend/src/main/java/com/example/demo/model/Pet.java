package com.example.demo.model;


import org.apache.catalina.User;

import jakarta.persistence.Entity;
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
    private User 

    
}
