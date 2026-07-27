package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Appointment;
import com.example.demo.model.Pet;
import com.example.demo.model.Vaccination;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.VaccinationRepository;

@Service
@Transactional
public class VaccinationServiceImpl implements VaccinationService {

    @Autowired
    private VaccinationRepository vaccinationRepository;
    private AppointmentRepository appointmentRepository;

    @Override
    public List<Vaccination> getAllVaccinations() {
        return vaccinationRepository.findAll();
    }

    @Override
    public Optional<Vaccination> getVaccinationById(Long id) {
        return vaccinationRepository.findById(id);
    }

    @Override
    public List<Vaccination> getVaccinationsByPet(Pet pet) {
        return vaccinationRepository.findByPet(pet);
    }

    @Override
    public Vaccination saveVaccination(Vaccination vaccination) {
        return vaccinationRepository.save(vaccination);
    }

    @Override
    public void deleteVaccination(Long id) {
        vaccinationRepository.deleteById(id);
    }

    @Override
    public List<Vaccination> getUpcomingReminders() {
        return vaccinationRepository.findByNextDueDateAfter(LocalDate.now());
    }
}