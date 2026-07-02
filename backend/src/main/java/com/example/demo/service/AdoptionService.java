package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.AdoptionRequest;
import com.example.demo.repository.AdoptionRequestRepository;

@Service
@Transactional
public class AdoptionService {

    @Autowired
    AdoptionRequestRepository AdoptionRequestRepository;

    List<AdoptionRequest> getAllRequests()
    {
        return AdoptionRequestRepository.findAll();
    }

    AdoptionRequest createRequest(AdoptionRequest request)
    {
        return AdoptionRequestRepository.save(request);
    }
    
}
