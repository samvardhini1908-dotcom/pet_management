// package com.example.demo.service;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.example.demo.model.Appointment;
// import com.example.demo.repository.AppointmentRepository;

// @Service
// @Transactional
// public class AppointmentService {
//     @Autowired
//     AppointmentRepository appointmentRepository;

//     public List<Appointment>getAllAppointments()
//     {
//         return appointmentRepository.findAll();
//     }

//     public void scheduleAppointment(Appointment appointment)
//     {
//       List<Appointment> vetAppointments=appointmentRepository.findAll();
//       for(Appointment exist : vetAppointments)
//         {
//         if(exist.getVeterinarian().equals(appointment.getVeterinarian()))
//         {
//           long min=java.time.Duration.between(exist.getAppointmentDate(),appointment.getAppointmentDate()).toMinutes();

//           if(Math.abs(min)<30)
//           {
//             throw new RuntimeException("Error: Veterinarian has an overlapping appointment!");
//           }
//         }
//       }

//       appointment.setStatus(Appointment.STATUS.SCHEDULED);
//       appointmentRepository.save(appointment);

      
//     }
//     public Appointment saveAppointment(Appointment appointment)
//     {

//        List<Appointment> vetAppointments = appointmentRepository.findAll();

//        for (Appointment exist : vetAppointments) 
//         {
  
//              if (exist.getVeterinarian().equals(appointment.getVeterinarian())) 
//               {
 
//                       long min = java.time.Duration
//                        .between(exist.getAppointmentDate(),
//                               appointment.getAppointmentDate())
//                        .toMinutes();
 
//                       if (Math.abs(min) < 30)
//                       {
//                         throw new RuntimeException(
//                           "Error: Veterinarian has an overlapping appointment!");
//                       }
//                }
//         }

//         appointment.setStatus(Appointment.STATUS.SCHEDULED);

//         return appointmentRepository.save(appointment);
//     }

//     public Appointment updateStatus(Long id,String status)
//     {

//         Appointment appointment=appointmentRepository.findById(id).orElseThrow();
//         appointment.setStatus(Appointment.STATUS.valueOf(status.toUpperCase()));
        

//         return appointmentRepository.save(appointment);
//     }

    
    
// }

package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Appointment;
import com.example.demo.model.Pet;
import com.example.demo.model.User;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.PetRepository;
import com.example.demo.repository.UserRepository;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired(required = false)
    private UserRepository userRepository;

    @Autowired(required = false)
    private PetRepository petRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public void scheduleAppointment(Appointment appointment) {
        saveAppointment(appointment);
    }

    public Appointment saveAppointment(Appointment appointment) {
        // 1. Attach full User entity for veterinarian if ID is provided
        if (appointment.getVeterinarian() != null && appointment.getVeterinarian().getId() != null && userRepository != null) {
            userRepository.findById(appointment.getVeterinarian().getId())
                    .ifPresent(appointment::setVeterinarian);
        }

        // 2. Attach full Pet entity if ID is provided
        if (appointment.getPet() != null && appointment.getPet().getId() != null && petRepository != null) {
            petRepository.findById(appointment.getPet().getId())
                    .ifPresent(appointment::setPet);
        }

        // 3. Overlap check (< 30 minutes for the same veterinarian)
        List<Appointment> vetAppointments = appointmentRepository.findAll();
        for (Appointment exist : vetAppointments) {
            // Ignore the same record if updating
            if (appointment.getId() != null && appointment.getId().equals(exist.getId())) {
                continue;
            }

            boolean sameVet = false;
            if (exist.getVeterinarian() != null && appointment.getVeterinarian() != null) {
                if (exist.getVeterinarian().getId() != null && appointment.getVeterinarian().getId() != null) {
                    sameVet = exist.getVeterinarian().getId().equals(appointment.getVeterinarian().getId());
                } else {
                    sameVet = exist.getVeterinarian().equals(appointment.getVeterinarian());
                }
            }

            if (sameVet && exist.getAppointmentDate() != null && appointment.getAppointmentDate() != null) {
                long min = java.time.Duration
                        .between(exist.getAppointmentDate(), appointment.getAppointmentDate())
                        .toMinutes();

                if (Math.abs(min) < 30) {
                    throw new RuntimeException("Error: Veterinarian has an overlapping appointment!");
                }
            }
        }

        if (appointment.getStatus() == null) {
            appointment.setStatus(Appointment.STATUS.SCHEDULED);
        }

        return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        appointment.setStatus(Appointment.STATUS.valueOf(status.toUpperCase()));
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentDetails(Long id, Appointment details) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        // Update Pet association
        if (details.getPet() != null) {
            if (details.getPet().getId() != null && petRepository != null) {
                petRepository.findById(details.getPet().getId()).ifPresent(existing::setPet);
            } else {
                existing.setPet(details.getPet());
            }
        }

        // Update Veterinarian association
        if (details.getVeterinarian() != null) {
            if (details.getVeterinarian().getId() != null && userRepository != null) {
                userRepository.findById(details.getVeterinarian().getId()).ifPresent(existing::setVeterinarian);
            } else {
                existing.setVeterinarian(details.getVeterinarian());
            }
        }

        if (details.getAppointmentDate() != null) {
            existing.setAppointmentDate(details.getAppointmentDate());
        }

        if (details.getPurpose() != null) {
            existing.setPurpose(details.getPurpose());
        }

        if (details.getStatus() != null) {
            existing.setStatus(details.getStatus());
        }

        // Run validation and save through saveAppointment logic
        return saveAppointment(existing);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}