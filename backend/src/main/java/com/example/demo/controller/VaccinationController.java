package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Vaccination;
import com.example.demo.service.VaccinationService;


@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("/api/vaccinations")
public class VaccinationController {
    private final VaccinationService vaccinationService;

    public VaccinationController(VaccinationService vaccinationService) {
        this.vaccinationService = vaccinationService;
    }

    @GetMapping
    public List<Vaccination> getAllVaccinations()
    {
        {
            return vaccinationService.getAllVaccinations();
        }
    }

    // @PostMapping
    // @PreAuthorize("hasRole('OWNER') or hasRole('VET') or hasRole('ADMIN')")
    // public Vaccination savedVaccination(@RequestBody Vaccination vaccination)
    // {
    //     return vaccinationService.saveVaccination(vaccination);
    // }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('VET') or hasRole('ADMIN')")
    public ResponseEntity<String> saveVaccination(@RequestBody Vaccination vaccination) 
    {
    vaccinationService.saveVaccination(vaccination);
    return ResponseEntity.status(201)
            .body("Vaccination created successfully.");
    }

    // @PutMapping("/{id}")
    // @PreAuthorize("hasRole('VET') or hasRole('ADMIN')")
    // public ResponseEntity<Vaccination> updateVaccination(@PathVariable Long id,@RequestBody Vaccination vaccinationDetails) 
    // {

    //     return vaccinationService.getVaccinationById(id)
    //         .map(existingVaccination -> {

    //             existingVaccination.setVaccineName(vaccinationDetails.getVaccineName());
    //             existingVaccination.setVaccinationDate(vaccinationDetails.getVaccinationDate());
    //             existingVaccination.setNextDueDate(vaccinationDetails.getNextDueDate());
    //             existingVaccination.setStatus(vaccinationDetails.getStatus());

    //             Vaccination savedVaccination =
    //                     vaccinationService.saveVaccination(existingVaccination);

    //             return ResponseEntity.ok(savedVaccination);
    //         })
    //         .orElse(ResponseEntity.notFound().build());
    // }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VET') or hasRole('ADMIN')")
    public ResponseEntity<Vaccination> updateVaccination(@PathVariable Long id, @RequestBody Vaccination vaccinationDetails) 
    {
        return vaccinationService.getVaccinationById(id)
            .map(existingVaccination -> {

                existingVaccination.setVaccineName(vaccinationDetails.getVaccineName());
                existingVaccination.setVaccinationDate(vaccinationDetails.getVaccinationDate());
                existingVaccination.setNextDueDate(vaccinationDetails.getNextDueDate());
                existingVaccination.setStatus(vaccinationDetails.getStatus());
                
                // ADD THIS LINE:
                if (vaccinationDetails.getPet() != null) {
                    existingVaccination.setPet(vaccinationDetails.getPet());
                }

                Vaccination savedVaccination =
                        vaccinationService.saveVaccination(existingVaccination);

                return ResponseEntity.ok(savedVaccination);
            })
            .orElse(ResponseEntity.notFound().build());
    }



    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('VET') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteVaccination(@PathVariable Long id)
    {
        vaccinationService.deleteVaccination(id);
        return ResponseEntity.ok("Vaccination deleted successfully.");
    }

    @GetMapping("/reminders")
    public List<Vaccination> getReminders()
    {
        return vaccinationService.getUpcomingReminders();
    }


    


    
}
