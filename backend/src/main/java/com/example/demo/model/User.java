package com.example.demo.model;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String username;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    public enum ROLE{
        ROLE_ADMIN,
        ROLE_OWNER,
        ROLE_VET,
        ROLE_SHELTER
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ROLE role;

    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;
    
}
