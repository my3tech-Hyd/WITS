package com.wits.project.web;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;



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
import com.wits.project.model.Interview;
import com.wits.project.model.enums.Enums.JobApplicationStatus;
import com.wits.project.repository.JobApplicationRepository;
import com.wits.project.repository.InterviewRepository;
import com.wits.project.security.SecurityUtil;
import com.wits.project.service.ApplicationService;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    @Autowired
    private JobApplicationRepository applications;
    
    @Autowired
    private InterviewRepository interviewRepository;
    
    @Autowired
    private ApplicationService applicationService;

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
        System.out.println("DEBUG: /job/{jobPostingId}/enriched endpoint called for jobPostingId: " + jobPostingId);
        
        List<ApplicationService.ApplicationWithDetails> enrichedApplications = 
            applicationService.getApplicationsWithDetails(jobPostingId);
        
        System.out.println("DEBUG: Found " + enrichedApplications.size() + " applications for job: " + jobPostingId);
        
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

    // Test endpoint: Get all applications in database (for debugging)
    @GetMapping("/test/all")
    public ResponseEntity<?> testGetAllApplications() {
        System.out.println("DEBUG: /test/all endpoint called");
        List<JobApplication> allApplications = applications.findAll();
        System.out.println("DEBUG: Found " + allApplications.size() + " total applications in database");
        return ResponseEntity.ok(allApplications);
    }

    // Test endpoint: Get all job postings (for debugging)
    @GetMapping("/test/jobs")
    public ResponseEntity<?> testGetAllJobPostings() {
        System.out.println("DEBUG: /test/jobs endpoint called");
        // This would need to be injected, but for now let's just return a message
        return ResponseEntity.ok("Job postings endpoint - would need JobPostingRepository injection");
    }



    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<JobApplication> apply(@RequestBody CreateApplication req) {
        JobApplication a = new JobApplication();
        String currentUserId = SecurityUtil.getCurrentUserId();
        a.setUserId(currentUserId);
        a.setJobPostingId(req.jobPostingId);
        a.setApplicationDate(Instant.now());
        a.setStatus(JobApplicationStatus.RECEIVED);
        return ResponseEntity.ok(applications.save(a));
    }



    @PutMapping("/status")
    @PreAuthorize("hasAnyRole('EMPLOYER','STAFF')")
    public ResponseEntity<JobApplication> updateStatus(@RequestBody UpdateStatus req) {
        JobApplication a = applications.findById(req.applicationId).orElseThrow();
        a.setStatus(req.status);
        
        // If status is REJECTED, set the rejection reason
        if (req.status == ApplicationStatus.REJECTED) {
            if (req.rejectReason == null || req.rejectReason.trim().isEmpty()) {
                throw new IllegalArgumentException("Rejection reason is required when status is REJECTED");
            }
            a.setRejectReason(req.rejectReason.trim());
        } else {
            // Clear rejection reason if status is not REJECTED
            a.setRejectReason(null);
        }
        
        return ResponseEntity.ok(applications.save(a));
    }

    // New endpoint: Schedule interview
    @PostMapping("/{applicationId}/schedule-interview")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Interview> scheduleInterview(@PathVariable String applicationId, @RequestBody ScheduleInterviewRequest req) {
        JobApplication application = applications.findById(applicationId).orElseThrow();
        
        // Verify the job belongs to the current employer
        if (!application.getJobPostingId().equals(req.jobPostingId)) {
            throw new IllegalArgumentException("Invalid job posting for this application");
        }
        
        Interview interview = new Interview();
        interview.setApplicationId(applicationId);
        interview.setJobPostingId(req.jobPostingId);
        interview.setEmployerId(SecurityUtil.getCurrentUserId());
        interview.setApplicantId(application.getUserId());
        interview.setScheduledDateTime(req.scheduledDateTime);
        interview.setLocation(req.location);
        interview.setInterviewType(req.interviewType);
        interview.setNotes(req.notes);
        interview.setStatus("SCHEDULED");
        
        // Update application status to INTERVIEW_SCHEDULED
        application.setStatus(JobApplicationStatus.INTERVIEW_SCHEDULED);
        applications.save(application);
        
        return ResponseEntity.ok(interviewRepository.save(interview));
    }

    // New endpoint: Get interview details for an application
    @GetMapping("/{applicationId}/interview")
    @PreAuthorize("hasAnyRole('EMPLOYER','JOB_SEEKER')")
    public ResponseEntity<Interview> getInterviewDetails(@PathVariable String applicationId) {
        Interview interview = interviewRepository.findByApplicationIdAndStatus(applicationId, "SCHEDULED")
            .orElse(null);
        return ResponseEntity.ok(interview);
    }

    // New endpoint: Get all application statuses (for dropdown)
    @GetMapping("/statuses")
    public ResponseEntity<JobApplicationStatus[]> getApplicationStatuses() {
        return ResponseEntity.ok(JobApplicationStatus.values());
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
        public String rejectReason; // Added rejectReason field
    }

    @Getter
    @Setter
    public static class ScheduleInterviewRequest {
        public String jobPostingId;
        public LocalDateTime scheduledDateTime;
        public String location;
        public String interviewType;
        public String notes;
    }
}


