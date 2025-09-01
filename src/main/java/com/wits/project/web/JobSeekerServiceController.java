package com.wits.project.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.wits.project.service.JobSeekerServiceManager;
import com.wits.project.web.dto.JobSeekerServiceDtos;

@RestController
@RequestMapping("/api/jobseeker/services")
@PreAuthorize("hasRole('JOB_SEEKER')")
public class JobSeekerServiceController {

    @Autowired
    private JobSeekerServiceManager jobSeekerServiceManager;

    // Get all available services
    @GetMapping
    public ResponseEntity<List<JobSeekerServiceDtos.ServiceResponse>> getAllServices(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<JobSeekerServiceDtos.ServiceResponse> services = jobSeekerServiceManager.getAllServices(userId);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in getAllServices: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Apply for a service
    @PostMapping("/{serviceId}/apply")
    public ResponseEntity<JobSeekerServiceDtos.ServiceApplicationResponse> applyForService(
            Authentication authentication,
            @PathVariable String serviceId,
            @RequestBody JobSeekerServiceDtos.ServiceApplicationRequest request) {
        try {
            String userId = authentication.getName();
            JobSeekerServiceDtos.ServiceApplicationResponse response = jobSeekerServiceManager.applyForService(userId, serviceId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in applyForService: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update service application status
    @PutMapping("/{serviceId}/application")
    public ResponseEntity<JobSeekerServiceDtos.ServiceApplicationResponse> updateServiceApplication(
            Authentication authentication,
            @PathVariable String serviceId,
            @RequestBody JobSeekerServiceDtos.ServiceApplicationRequest request) {
        try {
            String userId = authentication.getName();
            JobSeekerServiceDtos.ServiceApplicationResponse response = jobSeekerServiceManager.updateServiceApplication(userId, serviceId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in updateServiceApplication: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get my service applications
    @GetMapping("/my-applications")
    public ResponseEntity<List<JobSeekerServiceDtos.ServiceApplicationResponse>> getMyServiceApplications(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<JobSeekerServiceDtos.ServiceApplicationResponse> applications = jobSeekerServiceManager.getMyServiceApplications(userId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in getMyServiceApplications: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
