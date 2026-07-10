package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.MedicalRecord;
import com.example.demo.repository.MedicalRecordRepository;

@Service
@Transactional
public class MedicalRecordService {
    @Autowired
    MedicalRecordRepository medicalRecordRepository;

    @Autowired
    Appo

    List<MedicalRecord>getAllRecords()
    {
        return medicalRecordRepository.findAll();
    }


    
}
