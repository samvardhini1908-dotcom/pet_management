package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.MedicalRecord;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.MedicalRecordRepository;

@Service
@Transactional
public class MedicalRecordService {
    @Autowired
    MedicalRecordRepository medicalRecordRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    List<MedicalRecord>getAllRecords()
    {
        return medicalRecordRepository.findAll();
    }

    MedicalRecord saveRecord(MedicalRecord record)
    {
        return medicalRecordRepository.save(record);
    }

    List<MedicalRecord> getRecordsByPetId(Long petId)
    {
        return medicalRecordRepository.findAll()
        .stream()
        .filter(record -> record.getPet() != null )
    }


    
}
