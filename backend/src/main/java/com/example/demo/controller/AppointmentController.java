// package com.example.demo.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.demo.model.Appointment;
// import com.example.demo.service.AppointmentService;



// @CrossOrigin
// @RestController
// @RequestMapping("/api/appointments")
// public class AppointmentController {
//     private final AppointmentService appointmentService;
 
//     @Autowired
//     public AppointmentController(AppointmentService appointmentService) {
//         this.appointmentService = appointmentService;
//     }
  
//     @GetMapping
//     public List<Appointment> getAllAppointments()
//     {
//         return appointmentService.getAllAppointments();
//     }

//     @PostMapping
//     @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
//     public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment)
//     {
//         try{
//             Appointment savedAppointment= appointmentService.saveAppointment(appointment);
//             return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
//         }
//         catch(Exception e)
//         {
//             return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//         }
//     }

//     @PutMapping("/{id}")
//     @PreAuthorize("hasRole('VET') or hasRole('ADMIN')")
//     public Appointment updateAppointment(@PathVariable Long id, @RequestParam String status)
//     {
//      return appointmentService.updateStatus(id,status);
//     }


    
    
// }

package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;

@CrossOrigin
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment savedAppointment = appointmentService.saveAppointment(appointment);
            return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Supports BOTH status update query param (?status=...) AND full JSON body edits
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VET') or hasRole('ADMIN') or hasRole('OWNER')")
    public ResponseEntity<?> updateAppointment(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) Appointment appointmentDetails) {
        try {
            if (status != null && !status.trim().isEmpty()) {
                Appointment updated = appointmentService.updateStatus(id, status);
                return ResponseEntity.ok(updated);
            }
            if (appointmentDetails != null) {
                Appointment updated = appointmentService.updateAppointmentDetails(id, appointmentDetails);
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.badRequest().body("Either status or appointment payload is required");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok("Appointment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete appointment");
        }
    }
}