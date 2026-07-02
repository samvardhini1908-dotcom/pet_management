package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.AdoptionRequest;
import com.example.demo.model.Shelter;
import com.example.demo.repository.AdoptionRequestRepository;
import com.example.demo.repository.ShelterRepository;

@Service
@Transactional
public class AdoptionService {

    @Autowired
    AdoptionRequestRepository AdoptionRequestRepository;

    @Autowired
    ShelterRepository ShelterRepository;

    List<AdoptionRequest> getAllRequests()
    {
        return AdoptionRequestRepository.findAll();
    }

    AdoptionRequest createRequest(AdoptionRequest request)
    {
        request.setStatus("PENDING");
        return AdoptionRequestRepository.save(request);
    }

    AdoptionRequest updateRequestStatus(Long id,String status)
    {
        OptAdoptionRequest request=AdoptionRequestRepository.findById(id);
    }

    List<Shelter> getAllShelters()
    {
        return ShelterRepository.findAll();
    }


    
}
