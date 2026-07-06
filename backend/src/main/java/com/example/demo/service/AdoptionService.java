package com.example.demo.service;

import java.util.List;
import java.util.Optional;

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
        request.setStatus(AdoptionRequest.STATUS.PENDING);
        return AdoptionRequestRepository.save(request);
    }

    AdoptionRequest updateRequestStatus(Long id,String status)
    {
        Optional<AdoptionRequest> ans=AdoptionRequestRepository.findById(id);
        if(ans.isPresent()){

            AdoptionRequest request=ans.get();

            request.setStatus(status);

            if("APPROVED".equals(status)){
                if(request.getPet()!=null){
                    request.getPet().setAvailableForAdoption(false);
                }
            }
            return AdoptionRequestRepository.save(request);

        }
        
    }

    List<Shelter> getAllShelters()
    {
        return ShelterRepository.findAll();
    }

    


    
}
