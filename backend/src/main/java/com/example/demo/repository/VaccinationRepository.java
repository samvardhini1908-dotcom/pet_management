package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Pet;
import com.example.demo.model.Vaccination;
@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination,Long>{

    List<Vaccination>findByPet(Pet pet);
    List<Vaccination>getUpcomingReminders();
    List<Vaccination> findByNextDueDateAfter(LocalDate date);
    @Query("SELECT v FROM Vaccination v WHERE v.nextDueDate BETWEEN :start AND :end")
    List<Vaccination> findUpcomingReminders(@Param("start") LocalDate start, @Param("end") LocalDate end);
    
} 