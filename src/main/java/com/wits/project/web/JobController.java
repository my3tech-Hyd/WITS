package com.wits.project.web;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wits.project.model.JobPosting;
import com.wits.project.model.ProgramDocument;
import com.wits.project.feign.ModelFeign;
import com.wits.project.model.Employer;
import com.wits.project.model.enums.Enums.JobStatus;
import com.wits.project.model.enums.Enums.JobType;
import com.wits.project.repository.JobPostingRepository;
import com.wits.project.repository.ProgramDocumentRepository;
import com.wits.project.repository.EmployerRepository;
import com.wits.project.security.SecurityUtil;
import com.wits.project.service.ApplicationService;
import com.wits.project.service.ApplicationService.ApplicationWithDetails;
import java.util.Optional;

import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobPostingRepository jobs;
    private final EmployerRepository employerRepository;
    private final ApplicationService applicationService;
    private final ModelFeign modelFeign;
    private final ProgramDocumentRepository programDocumentRepository;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobPosting> create(@RequestBody CreateJobRequest req) {
        JobPosting j = new JobPosting();
        String currentUserId = SecurityUtil.getCurrentUserId();
        System.out.println("DEBUG: Creating job for employer ID: " + currentUserId);
        
        j.setEmployerId(currentUserId);
        j.setTitle(req.title);
        
        // Set company name - if not provided, try to get from employer profile
        String companyName = req.companyName;
        if (companyName == null || companyName.trim().isEmpty()) {
            System.out.println("DEBUG: Company name not provided, fetching from employer profile");
            try {
                // Try to find employer profile and get company name
                Optional<Employer> employerOpt = employerRepository.findByUserId(currentUserId);
                if (employerOpt.isPresent()) {
                    companyName = employerOpt.get().getCompanyName();
                    System.out.println("DEBUG: Found company name from employer profile: " + companyName);
                } else {
                    System.out.println("DEBUG: No employer profile found for user: " + currentUserId);
                }
            } catch (Exception e) {
                System.out.println("DEBUG: Error fetching employer profile: " + e.getMessage());
            }
        }
        j.setCompanyName(companyName);
        
        j.setDescription(req.description);
        j.setJobType(req.jobType == null ? JobType.FULL_TIME : req.jobType);
        j.setLocation(req.location);
        j.setStatus(req.status == null ? JobStatus.ACTIVE : req.status);
        j.setMinSalary(req.minSalary);
        j.setMaxSalary(req.maxSalary);
        j.setRequiredSkills(req.requiredSkills);
        j.setPostedDate(Instant.now());
        return ResponseEntity.ok(jobs.save(j));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobPosting> update(@PathVariable String id, @RequestBody UpdateJobRequest req) {
        JobPosting job = jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        
        // Verify the job belongs to the current employer
        if (!job.getEmployerId().equals(SecurityUtil.getCurrentUserId())) {
            throw new IllegalArgumentException("You can only edit your own job postings");
        }
        
        if (req.title != null) job.setTitle(req.title);
        if (req.companyName != null) job.setCompanyName(req.companyName);
        if (req.description != null) job.setDescription(req.description);
        if (req.jobType != null) job.setJobType(req.jobType);
        if (req.location != null) job.setLocation(req.location);
        if (req.status != null) job.setStatus(req.status);
        if (req.minSalary != null) job.setMinSalary(req.minSalary);
        if (req.maxSalary != null) job.setMaxSalary(req.maxSalary);
        if (req.requiredSkills != null) job.setRequiredSkills(req.requiredSkills);
        
        return ResponseEntity.ok(jobs.save(job));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobPosting> updateStatus(@PathVariable String id, @RequestBody UpdateStatusRequest req) {
        JobPosting job = jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        
        // Verify the job belongs to the current employer
        if (!job.getEmployerId().equals(SecurityUtil.getCurrentUserId())) {
            throw new IllegalArgumentException("You can only update your own job postings");
        }
        
        job.setStatus(req.status);
        return ResponseEntity.ok(jobs.save(job));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> delete(@PathVariable String id) {
        JobPosting job = jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        
        // Verify the job belongs to the current employer
        if (!job.getEmployerId().equals(SecurityUtil.getCurrentUserId())) {
            throw new IllegalArgumentException("You can only delete your own job postings");
        }
        
        jobs.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<JobPosting>> getEmployerJobs() {
        String currentUserId = SecurityUtil.getCurrentUserId();
        List<JobPosting> employerJobs = jobs.findByEmployerId(currentUserId);
        return ResponseEntity.ok(employerJobs);
    }

    @GetMapping("/{id}/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> getJobApplications(@PathVariable String id) {
        JobPosting job = jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        
        // Verify the job belongs to the current employer
        if (!job.getEmployerId().equals(SecurityUtil.getCurrentUserId())) {
            throw new IllegalArgumentException("You can only view applications for your own job postings");
        }
        
        return ResponseEntity.ok(applicationService.getApplicationsWithDetails(id));
    }

    // Debug endpoint to see all jobs
    @GetMapping("/debug/all")
    public ResponseEntity<List<JobPosting>> debugAllJobs() {
        List<JobPosting> allJobs = jobs.findAll();
        System.out.println("DEBUG: Total jobs in database: " + allJobs.size());
        allJobs.forEach(job -> {
            System.out.println("DEBUG: Job - ID: " + job.getId() + ", Title: " + job.getTitle() + ", Company: " + job.getCompanyName() + ", EmployerId: " + job.getEmployerId());
        });
        return ResponseEntity.ok(allJobs);
    }

    // Debug endpoint to check current user ID
    @GetMapping("/debug/current-user")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Map<String, Object>> debugCurrentUser() {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Map<String, Object> response = new HashMap<>();
        response.put("currentUserId", currentUserId);
        response.put("timestamp", Instant.now());
        System.out.println("DEBUG: Current user ID: " + currentUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> search(@RequestParam(required = false) String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.ok(jobs.findAll());
        }
        return ResponseEntity.ok(jobs.findByTitleContainingIgnoreCase(q));
    }

    @GetMapping("/testJobs")
    public ResponseEntity<?> searchAI(@RequestParam(required = false) String q) {
        // if (q == null || q.isBlank()) {
        //     return ResponseEntity.ok(jobs.findAll());
        // }
        // return ResponseEntity.ok(jobs.findByTitleContainingIgnoreCase(q));
        String currentUserId = SecurityUtil.getCurrentUserId();
        var documentsForUser =  programDocumentRepository.findByUserIdOrderByCreatedAtDesc(currentUserId);
        
        if(documentsForUser.size() == 0) {
            return ResponseEntity.ok("No resume uploaded");
        }
        var resume = documentsForUser.get(0);
        var result = modelFeign.resumeToJobPosting(resume.getFileId());
        System.out.println("DEBUG: Result: " + result);
        return ResponseEntity.ok(result);
        // return modelFeign.resumeToJobPosting(resume.getFileId());
    }

    @Getter
    @Setter
    public static class CreateJobRequest {
        public String title;
        public String companyName;
        public String description;
        public JobType jobType;
        public String location;
        public JobStatus status;
        public Double minSalary;
        public Double maxSalary;
        public java.util.List<String> requiredSkills;
    }

    @Getter
    @Setter
    public static class UpdateJobRequest {
        public String title;
        public String companyName;
        public String description;
        public JobType jobType;
        public String location;
        public JobStatus status;
        public Double minSalary;
        public Double maxSalary;
        public java.util.List<String> requiredSkills;
    }

    @Getter
    @Setter
    public static class UpdateStatusRequest {
        public JobStatus status;
    }
}


