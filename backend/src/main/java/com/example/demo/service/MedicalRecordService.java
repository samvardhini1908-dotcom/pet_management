package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

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

    public  List<MedicalRecord>getAllRecords()
    {
        return medicalRecordRepository.findAll();
    }

    public MedicalRecord saveRecord(MedicalRecord record)
    {
        return medicalRecordRepository.save(record);
    }

    public List<MedicalRecord> getRecordsByPetId(Long petId)
    {
        return medicalRecordRepository.findAll()
        .stream()
        .filter(record -> record.getPet() != null && record.getPet().getId().equals(petId))
        .collect(Collectors.toList());
    }

    public MedicalRecord approveRecord(Long id)
    {
        MedicalRecord record=medicalRecordRepository.findById(id).orElseThrow(()->new RuntimeException("Record not found"));
        record.setStatus(MedicalRecord.STATUS.APPROVED);
        return medicalRecordRepository.save(record);
    }


    
}
