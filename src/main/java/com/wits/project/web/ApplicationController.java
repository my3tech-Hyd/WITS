package com.wits.project.web;

import java.time.Instant;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wits.project.model.JobApplication;
import com.wits.project.model.enums.Enums.ApplicationStatus;
import com.wits.project.repository.JobApplicationRepository;
import com.wits.project.security.SecurityUtil;
import com.wits.project.service.ApplicationService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final JobApplicationRepository applications;
    private final ApplicationService applicationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('JOB_SEEKER','EMPLOYER','STAFF')")
    public ResponseEntity<?> list(@RequestParam(required = false) String userId,
                                  @RequestParam(required = false) String jobPostingId) {
        if (userId != null) {
            return ResponseEntity.ok(applications.findByUserId(userId));
        }
        if (jobPostingId != null) {
            return ResponseEntity.ok(applications.findByJobPostingId(jobPostingId));
        }
        return ResponseEntity.ok(applications.findAll());
    }

    // New endpoint: Get enriched applications for current user (job seeker)
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<?> getMyApplicationsWithJobDetails() {
        String currentUserId = SecurityUtil.getCurrentUserId();
        System.out.println("DEBUG: /my-applications endpoint called for user: " + currentUserId);
        List<ApplicationService.ApplicationWithJobDetails> enrichedApplications = 
            applicationService.getUserApplicationsWithJobDetails(currentUserId);
        System.out.println("DEBUG: Returning " + enrichedApplications.size() + " enriched applications");
        return ResponseEntity.ok(enrichedApplications);
    }

    // New endpoint: Get enriched applications for a specific job (employer)
    @GetMapping("/job/{jobPostingId}/enriched")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> getJobApplicationsWithUserDetails(@PathVariable String jobPostingId) {
        List<ApplicationService.ApplicationWithDetails> enrichedApplications = 
            applicationService.getApplicationsWithDetails(jobPostingId);
        return ResponseEntity.ok(enrichedApplications);
    }

    // Test endpoint: Get enriched applications for a specific user (for testing)
    @GetMapping("/test/{userId}")
    public ResponseEntity<?> testGetUserApplicationsWithJobDetails(@PathVariable String userId) {
        System.out.println("DEBUG: /test/{userId} endpoint called for user: " + userId);
        List<ApplicationService.ApplicationWithJobDetails> enrichedApplications = 
            applicationService.getUserApplicationsWithJobDetails(userId);
        System.out.println("DEBUG: Test endpoint returning " + enrichedApplications.size() + " enriched applications");
        return ResponseEntity.ok(enrichedApplications);
    }



    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<JobApplication> apply(@RequestBody CreateApplication req) {
        JobApplication a = new JobApplication();
        String currentUserId = SecurityUtil.getCurrentUserId();
        a.setUserId(currentUserId);
        a.setJobPostingId(req.jobPostingId);
        a.setApplicationDate(Instant.now());
        a.setStatus(ApplicationStatus.RECEIVED);
        return ResponseEntity.ok(applications.save(a));
    }

    @PutMapping("/status")
    @PreAuthorize("hasAnyRole('EMPLOYER','STAFF')")
    public ResponseEntity<JobApplication> updateStatus(@RequestBody UpdateStatus req) {
        JobApplication a = applications.findById(req.applicationId).orElseThrow();
        a.setStatus(req.status);
        return ResponseEntity.ok(applications.save(a));
    }

    @Getter
    @Setter
    public static class CreateApplication {
        public String userId;
        public String jobPostingId;
    }

    @Getter
    @Setter
    public static class UpdateStatus {
        public String applicationId;
        public ApplicationStatus status;
    }
}


