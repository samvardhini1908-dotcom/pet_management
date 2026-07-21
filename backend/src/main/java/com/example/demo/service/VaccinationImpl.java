package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Pet;
import com.example.demo.model.Vaccination;
import com.example.demo.repository.VaccinationRepository;

@Service
@Transactional
public class VaccinationImpl implements VaccinationService {
    @Autowired
    VaccinationRepository vaccinationRepository;
    public List<Vaccination> getAllVaccinations(){
        return vaccinationRepository.findAll();
    }

    public List<Vaccination>getVaccinationsByPet(Pet pet)
    {
        return vaccinationRepository.findByPet(pet);
    }

    public Vaccination saveVaccination(Vaccination vaccination)
    {
        return vaccinationRepository.save(vaccination);
    }

    public void deleteVaccination(Long id)
    {
        vaccinationRepository.deleteById(id);
    }

    // public List<Vaccination>getUpcomingReminders()
    // {

    // }
    public List<Vaccination> getUpcomingReminders() 
    {
        return vaccinationRepository.findByNextDueDateAfter(LocalDate.now());
    }
    
}
