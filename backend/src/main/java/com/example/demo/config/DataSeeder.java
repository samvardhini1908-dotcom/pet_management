package com.example.demo.config;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.model.AdoptionRequest;
import com.example.demo.model.Appointment;
import com.example.demo.model.MedicalRecord;
import com.example.demo.model.Pet;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import com.example.demo.model.Vaccination;
import com.example.demo.repository.AdoptionRequestRepository;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.MedicalRecordRepository;
import com.example.demo.repository.PetRepository;
import com.example.demo.repository.ShelterRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VaccinationRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(
            UserRepository userRepository,
            ShelterRepository shelterRepository,
            PetRepository petRepository,
            VaccinationRepository vaccinationRepository,
            MedicalRecordRepository medicalRecordRepository,
            AppointmentRepository appointmentRepository,
            AdoptionRequestRepository adoptionRequestRepository,
            PasswordEncoder encoder) {

        return args -> {
            // Check if users already exist; if they do, update their passwords to valid BCrypt hashes
            if (userRepository.count() > 0) {
                userRepository.findByUsername("admin").ifPresent(user -> {
                    user.setPassword(encoder.encode("admin123"));
                    userRepository.save(user);
                });
                userRepository.findByUsername("owner").ifPresent(user -> {
                    user.setPassword(encoder.encode("owner123"));
                    userRepository.save(user);
                });
                userRepository.findByUsername("vet").ifPresent(user -> {
                    user.setPassword(encoder.encode("vet123"));
                    userRepository.save(user);
                });
                System.out.println("Default user credentials verified and updated with BCrypt hashes.");
                return;
            }

            // ==========================
            // ADMIN
            // ==========================
            User admin = User.builder()
                    .username("admin")
                    .password(encoder.encode("admin123"))
                    .role(User.ROLE.ROLE_ADMIN)
                    .fullName("System Admin")
                    .email("admin@gmail.com")
                    .phone("9999999999")
                    .build();

            // ==========================
            // OWNER
            // ==========================
            User owner = User.builder()
                    .username("owner")
                    .password(encoder.encode("owner123"))
                    .role(User.ROLE.ROLE_OWNER)
                    .fullName("Pet Owner")
                    .email("owner@gmail.com")
                    .phone("8888888888")
                    .build();

            // ==========================
            // VET
            // ==========================
            User vet = User.builder()
                    .username("vet")
                    .password(encoder.encode("vet123"))
                    .role(User.ROLE.ROLE_VET)
                    .fullName("Doctor Vet")
                    .email("vet@gmail.com")
                    .phone("7777777777")
                    .build();

            userRepository.save(admin);
            userRepository.save(owner);
            userRepository.save(vet);

            // ==========================
            // SHELTER
            // ==========================
            Shelter shelter = new Shelter();
            shelter.setShelterName("Happy Paws Shelter");
            shelter.setLocation("Chennai");
            shelter.setCapacity(100);
            shelterRepository.save(shelter);

            // ==========================
            // PET
            // ==========================
            Pet pet = Pet.builder()
                    .petName("Bruno")
                    .species("Dog")
                    .breed("Labrador")
                    .age(3)
                    .gender("Male")
                    .imageUrl("https://example.com/dog.jpg")
                    .owner(owner)
                    .shelter(shelter)
                    .availableForAdoption(true)
                    .build();

            petRepository.save(pet);

            // ==========================
            // VACCINATION
            // ==========================
            Vaccination vaccination = Vaccination.builder()
                    .vaccineName("Rabies")
                    .vaccinationDate(LocalDate.now())
                    .nextDueDate(LocalDate.now().plusDays(5))
                    .status(Vaccination.STATUS.PENDING)
                    .pet(pet)
                    .build();

            vaccinationRepository.save(vaccination);

            // ==========================
            // MEDICAL RECORD
            // ==========================
            MedicalRecord medicalRecord = MedicalRecord.builder()
                    .diagnosis("Fever")
                    .prescription("Paracetamol for 5 days")
                    .visitDate(LocalDate.now())
                    .status(MedicalRecord.STATUS.PENDING)
                    .veterinarian(vet)
                    .pet(pet)
                    .build();

            medicalRecordRepository.save(medicalRecord);

            // ==========================
            // APPOINTMENT
            // ==========================
            Appointment appointment = Appointment.builder()
                    .appointmentDate(LocalDateTime.now().plusDays(2))
                    .purpose("General Checkup")
                    .status(Appointment.STATUS.SCHEDULED)
                    .pet(pet)
                    .veterinarian(vet)
                    .build();

            appointmentRepository.save(appointment);

            // ==========================
            // ADOPTION REQUEST
            // ==========================
            AdoptionRequest adoptionRequest = AdoptionRequest.builder()
                    .requestDate(LocalDate.now())
                    .status(AdoptionRequest.STATUS.PENDING)
                    .applicant(owner)
                    .pet(pet)
                    .build();

            adoptionRequestRepository.save(adoptionRequest);

            System.out.println("======================================");
            System.out.println(" Sample Data Loaded Successfully");
            System.out.println("======================================");
        };
    }
}