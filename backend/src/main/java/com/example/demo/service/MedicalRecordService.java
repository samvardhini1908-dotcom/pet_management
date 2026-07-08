package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.repository.MedicalRecordRepository;

@Service
@Transactional
public class MedicalRecordService {
    @Autowired
    MedicalRecordRepository medicalRecordRepository;

    List<MedicalRecord>getAllRecords()
    {
        return medicalRecordRepository.findAll();
    }
    
}
