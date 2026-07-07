package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.AdoptionRequest;
import com.example.demo.model.Pet;
import com.example.demo.model.Shelter;
import com.example.demo.repository.AdoptionRequestRepository;
import com.example.demo.repository.PetRepository;
import com.example.demo.repository.ShelterRepository;

@Service
@Transactional
public class AdoptionService {

    @Autowired
    AdoptionRequestRepository AdoptionRequestRepository;

    @Autowired
    ShelterRepository shelterRepository;

    @Autowired
    PetRepository petRepository;

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

            AdoptionRequest.STATUS conversionStatus=AdoptionRequest.STATUS.valueOf(status.toUpperCase());

            request.setStatus(conversionStatus);

            if(AdoptionRequest.STATUS.APPROVED.equals(conversionStatus)){
                if(request.getPet()!=null){
                    request.getPet().setAvailableForAdoption(false);
                }
            }
            return AdoptionRequestRepository.save(request);

        }
        return null;
        
    }

    List<Shelter> getAllShelters()
    {
        return shelterRepository.findAll();
    }

    boolean canShelterAcceptPet(Long shelterId)
    {
        Optional<Shelter> ans=shelterRepository.findById(shelterId);

        if(ans.isPresent()){
            Shelter shelter=ans.get();
            shelter.getCapacity();

            List<Pet> count = petRepository.findAll();

            if(count l (shelter.getCapacity())){
                return true;
            }
            
        }
    }


    
}
