package com.wits.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wits.project.model.JobApplication;
import com.wits.project.model.JobPosting;
import com.wits.project.model.User;
import com.wits.project.model.enums.Enums.JobType;
import com.wits.project.repository.JobApplicationRepository;
import com.wits.project.repository.JobPostingRepository;
import com.wits.project.repository.UserRepository;

import lombok.Getter;
import lombok.Setter;

@Service
public class ApplicationService {
    
    @Autowired
    private JobApplicationRepository jobApplicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JobPostingRepository jobPostingRepository;

    // Fetch applications with complete user and job data for employers
    public List<ApplicationWithDetails> getApplicationsWithDetails(String jobPostingId) {
        List<JobApplication> applications = jobApplicationRepository.findByJobPostingId(jobPostingId);
        
        return applications.stream().map(app -> {
            ApplicationWithDetails details = new ApplicationWithDetails();
            details.setApplication(app);
            
            // Fetch user details
            User user = userRepository.findById(app.getUserId()).orElse(null);
            System.out.println("DEBUG: Found user: " + user);
            if (user != null) {
                details.setApplicantName(user.getFirstName() + " " + user.getLastName());
                details.setEmail(user.getEmail());
                details.setPhoneNumber(user.getPhoneNumber());
                details.setLocation(user.getAddress()); // Using address as location for now
                details.setEducation(user.getEducation());
                details.setSkills(user.getSkills());
                details.setCertifications(user.getCertifications());
                details.setVeteran(user.getVeteran());
                details.setSpouse(user.getSpouse());
                details.setProfileCompletionPercent(user.getProfileCompletionPercent());
            }
            
            // Fetch job details
            JobPosting job = jobPostingRepository.findById(app.getJobPostingId()).orElse(null);
            if (job != null) {
                details.setJobTitle(job.getTitle());
                details.setCompanyName(job.getCompanyName());
                details.setJobLocation(job.getLocation());
                details.setJobType(job.getJobType());
                details.setJobDescription(job.getDescription());
                details.setMinSalary(job.getMinSalary());
                details.setMaxSalary(job.getMaxSalary());
                details.setRequiredSkills(job.getRequiredSkills());
                details.setPostedDate(job.getPostedDate());
            }
            
            return details;
        }).collect(Collectors.toList());
    }

    // Fetch all applications for a specific user (job seeker)
    public List<ApplicationWithJobDetails> getUserApplicationsWithJobDetails(String userId) {
        System.out.println("DEBUG: Getting applications for user: " + userId);
        List<JobApplication> applications = jobApplicationRepository.findByUserId(userId);
        System.out.println("DEBUG: Found " + applications.size() + " applications for user");
        
        return applications.stream().map(app -> {
            ApplicationWithJobDetails details = new ApplicationWithJobDetails();
            details.setApplication(app);
            
            System.out.println("DEBUG: Processing application: " + app.getId() + " for job: " + app.getJobPostingId());
            
            // Fetch job details - try multiple approaches
            JobPosting job = null;
            try {
                // First try with the string ID as is
                job = jobPostingRepository.findById(app.getJobPostingId()).orElse(null);
                System.out.println("DEBUG: First attempt - Job found: " + (job != null ? job.getTitle() : "null"));
                
                // If not found, try with ObjectId query
                if (job == null) {
                    job = jobPostingRepository.findByObjectId(app.getJobPostingId()).orElse(null);
                    System.out.println("DEBUG: Second attempt (ObjectId query) - Job found: " + (job != null ? job.getTitle() : "null"));
                }
                
                // If still not found, try converting to ObjectId
                if (job == null && ObjectId.isValid(app.getJobPostingId())) {
                    ObjectId objectId = new ObjectId(app.getJobPostingId());
                    job = jobPostingRepository.findById(objectId.toString()).orElse(null);
                    System.out.println("DEBUG: Third attempt (ObjectId conversion) - Job found: " + (job != null ? job.getTitle() : "null"));
                }
                
                // If still not found, log the issue
                if (job == null) {
                    System.out.println("DEBUG: Job not found by any method for ID: " + app.getJobPostingId());
                }
                
            } catch (Exception e) {
                System.out.println("DEBUG: Error finding job: " + e.getMessage());
            }
            
            if (job != null) {
                System.out.println("DEBUG: Found job: " + job.getTitle() + " for application: " + app.getId());
                details.setJobTitle(job.getTitle());
                details.setCompanyName(job.getCompanyName());
                details.setLocation(job.getLocation());
                details.setJobType(job.getJobType());
                details.setJobDescription(job.getDescription());
                details.setMinSalary(job.getMinSalary());
                details.setMaxSalary(job.getMaxSalary());
                details.setRequiredSkills(job.getRequiredSkills());
                details.setPreferredSkills(job.getPreferredSkills());
                details.setPostedDate(job.getPostedDate());
                details.setJobStatus(job.getStatus());
                details.setAnonymousPosting(job.getAnonymousPosting());
            } else {
                System.out.println("DEBUG: Job not found for application: " + app.getId() + ", jobId: " + app.getJobPostingId());
                // Set default values instead of null
                details.setJobTitle("Job Not Found");
                details.setCompanyName("Unknown Company");
                details.setLocation("Unknown Location");
                details.setJobType(JobType.FULL_TIME);
                details.setJobDescription("Job details not available");
                details.setMinSalary(0.0);
                details.setMaxSalary(0.0);
                details.setRequiredSkills(List.of());
                details.setPreferredSkills(List.of());
                details.setPostedDate(null);
                details.setJobStatus(null);
                details.setAnonymousPosting(false);
            }
            
            return details;
        }).collect(Collectors.toList());
    }

    // DTO class for application details with user info (for employers)
    @Getter
    @Setter
    public static class ApplicationWithDetails {
        private JobApplication application;
        
        // User Information
        private String applicantName;
        private String email;
        private String phoneNumber;
        private String location;
        private String education;
        private List<String> skills;
        private List<String> certifications;
        private Boolean veteran;
        private Boolean spouse;
        private Double profileCompletionPercent;
        
        // Job Information
        private String jobTitle;
        private String companyName;
        private String jobLocation;
        private JobType jobType;
        private String jobDescription;
        private Double minSalary;
        private Double maxSalary;
        private List<String> requiredSkills;
        private java.time.Instant postedDate;
    }

    // DTO class for application details with job info (for job seekers)
    @Getter
    @Setter
    public static class ApplicationWithJobDetails {
        private JobApplication application;
        
        // Job Information
        private String jobTitle;
        private String companyName;
        private String location;
        private JobType jobType;
        private String jobDescription;
        private Double minSalary;
        private Double maxSalary;
        private List<String> requiredSkills;
        private List<String> preferredSkills;
        private java.time.Instant postedDate;
        private com.wits.project.model.enums.Enums.JobStatus jobStatus;
        private Boolean anonymousPosting;
    }
}
