package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Pet;
import com.example.demo.model.Vaccination;

public interface VaccinationService {

    List<Vaccination> getAllVaccinations();

    Optional<Vaccination> getVaccinationById(Long id);

    List<Vaccination> getVaccinationsByPet(Pet pet);

    Vaccination saveVaccination(Vaccination vaccination);

    void deleteVaccination(Long id);

    List<Vaccination> getUpcomingReminders();
}