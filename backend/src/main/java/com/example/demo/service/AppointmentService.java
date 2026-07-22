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

    public List<Appointment>getAllAppointments()
    {
        return appointmentRepository.findAll();
    }

    // public void scheduleAppointment(Appointment appointment)
    // {
    //   List<Appointment> vetAppointments=appointmentRepository.findAll();
    //   for(Appointment exist : vetAppointments)
    //     {
    //     if(exist.getVeterinarian().equals(appointment.getVeterinarian()))
    //     {
    //       long min=java.time.Duration.between(exist.getAppointmentDate(),appointment.getAppointmentDate()).toMinutes();

    //       if(Math.abs(min)<30)
    //       {
    //         throw new RuntimeException("Error: Veterinarian has an overlapping appointment!");
    //       }
    //     }
    //   }

    //   appointment.setStatus(Appointment.STATUS.SCHEDULED);
    //   appointmentRepository.save(appointment);

      
    // }
    public Appointment saveAppointment(Appointment appointment)
    {

       List<Appointment> vetAppointments = appointmentRepository.findAll();

       for (Appointment exist : vetAppointments) 
        {
  
             if (exist.getVeterinarian().equals(appointment.getVeterinarian())) {
 
               long min = java.time.Duration
                      .between(exist.getAppointmentDate(),
                              appointment.getAppointmentDate())
                     .toMinutes();

             if (Math.abs(min) < 30) {
                throw new RuntimeException(
                        "Error: Veterinarian has an overlapping appointment!");
            }
        }
    }

    appointment.setStatus(Appointment.STATUS.SCHEDULED);

    return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long id,String status)
    {

        Appointment appointment=appointmentRepository.findById(id).orElseThrow();
        appointment.setStatus(Appointment.STATUS.valueOf(status));

        return appointmentRepository.save(appointment);
    }

    
    
}
