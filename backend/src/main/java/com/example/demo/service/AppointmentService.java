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
import com.example.demo.repository.AppointmentRepository;

@Service
@Transactional
public class AppointmentService {
    @Autowired
    AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public void scheduleAppointment(Appointment appointment) {
        saveAppointment(appointment);
    }

    public Appointment saveAppointment(Appointment appointment) {
        List<Appointment> vetAppointments = appointmentRepository.findAll();

        for (Appointment exist : vetAppointments) {
            if (exist.getVeterinarian() != null && appointment.getVeterinarian() != null
                    && exist.getVeterinarian().getId() != null && appointment.getVeterinarian().getId() != null
                    && exist.getVeterinarian().getId().equals(appointment.getVeterinarian().getId())) {

                if (exist.getAppointmentDate() != null && appointment.getAppointmentDate() != null) {
                    long min = java.time.Duration
                            .between(exist.getAppointmentDate(), appointment.getAppointmentDate())
                            .toMinutes();

                    if (Math.abs(min) < 30) {
                        throw new RuntimeException("Error: Veterinarian has an overlapping appointment!");
                    }
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

        if (details.getPet() != null) {
            existing.setPet(details.getPet());
        }
        if (details.getVeterinarian() != null) {
            existing.setVeterinarian(details.getVeterinarian());
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

        return appointmentRepository.save(existing);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}