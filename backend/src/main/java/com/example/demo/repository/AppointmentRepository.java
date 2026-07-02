package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.User;
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Long>{
    List<Appointment>findByVeterinarian(User veterinarian);
    List<Appointment>findByPetOwnerId(Long ownerId);

    
}