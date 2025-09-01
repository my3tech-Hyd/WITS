package com.wits.project.web;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.multipart.MultipartFile;

import com.wits.project.model.JobSeeker;
import com.wits.project.security.SecurityUtil;
import com.wits.project.service.JobSeekerService;
import com.wits.project.service.FileStorageService;
import com.wits.project.service.DocumentService;
import com.wits.project.web.dto.JobSeekerDtos.ProfileResponse;
import com.wits.project.web.dto.JobSeekerDtos.ProfileUpdateRequest;
import com.wits.project.web.dto.JobSeekerDtos.JobSeekerSearchRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/jobseekers")
@PreAuthorize("hasRole('JOB_SEEKER')")
public class JobSeekerController {

    @Autowired
    private JobSeekerService jobSeekerService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private DocumentService documentService;

    /**
     * Get current user's job seeker profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Getting job seeker profile for user: {}", currentUserId);

            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(currentUserId);
            
            if (jobSeekerOpt.isEmpty()) {
                // Create profile if it doesn't exist
                JobSeeker newProfile = jobSeekerService.createJobSeekerFromUser(currentUserId);
                return ResponseEntity.ok(convertToProfileResponse(newProfile));
            }

            System.out.println("DEBUG : PROFILE NOT EMPTY");

            return ResponseEntity.ok(convertToProfileResponse(jobSeekerOpt.get()));
        } catch (Exception e) {
            log.error("Error getting job seeker profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update current user's job seeker profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateMyProfile(@RequestBody ProfileUpdateRequest request) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Updating job seeker profile for user: {}", currentUserId);

            // Convert request to JobSeeker object
            JobSeeker jobSeeker = convertToJobSeeker(request);
            jobSeeker.setUserId(currentUserId);

            JobSeeker updatedProfile = jobSeekerService.updateJobSeekerProfile(currentUserId, jobSeeker);
            return ResponseEntity.ok(convertToProfileResponse(updatedProfile));
        } catch (Exception e) {
            log.error("Error updating job seeker profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Upload resume for current user
     */
    @PostMapping("/profile/resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Uploading resume for user: {}", currentUserId);
            log.info("File details: name={}, size={}, contentType={}", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType());

            // Upload document and create ProgramDocument record
            com.wits.project.model.ProgramDocument document = documentService.uploadDocument(
                file, 
                currentUserId, 
                com.wits.project.model.enums.Enums.ProgramType.RESUME, 
                "Resume for " + file.getOriginalFilename()
            );
            log.info("Resume document created with ID: {}", document.getId());
            
            // Get or create the job seeker profile
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(currentUserId);
            JobSeeker jobSeeker;
            
            if (jobSeekerOpt.isPresent()) {
                jobSeeker = jobSeekerOpt.get();
                log.info("Updating existing JobSeeker profile with ID: {}", jobSeeker.getId());
                log.info("Current resumeDocumentId: {}", jobSeeker.getResumeDocumentId());
            } else {
                // Create new job seeker profile if it doesn't exist
                jobSeeker = jobSeekerService.createJobSeekerFromUser(currentUserId);
                log.info("Created new JobSeeker profile for user: {} with ID: {}", currentUserId, jobSeeker.getId());
            }
            
            // Update the resume document ID (reference to ProgramDocument)
            log.info("Setting resumeDocumentId to: {}", document.getId());
            jobSeeker.setResumeDocumentId(document.getId());
            
            // Save the profile
            JobSeeker savedJobSeeker = jobSeekerService.saveJobSeekerProfile(jobSeeker);
            log.info("Profile saved successfully. New resumeDocumentId: {}", savedJobSeeker.getResumeDocumentId());
            log.info("Profile ID: {}", savedJobSeeker.getId());

            return ResponseEntity.ok(document.getId());
        } catch (Exception e) {
            log.error("Error uploading resume: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Upload cover letter for current user
     */
    @PostMapping("/profile/cover-letter")
    public ResponseEntity<String> uploadCoverLetter(@RequestParam("file") MultipartFile file) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Uploading cover letter for user: {}", currentUserId);
            log.info("File details: name={}, size={}, contentType={}", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType());

            // Upload document and create ProgramDocument record
            com.wits.project.model.ProgramDocument document = documentService.uploadDocument(
                file, 
                currentUserId, 
                com.wits.project.model.enums.Enums.ProgramType.COVER_LETTER, 
                "Cover Letter for " + file.getOriginalFilename()
            );
            log.info("Cover letter document created with ID: {}", document.getId());
            
            // Get or create the job seeker profile
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(currentUserId);
            JobSeeker jobSeeker;
            
            if (jobSeekerOpt.isPresent()) {
                jobSeeker = jobSeekerOpt.get();
                log.info("Updating existing JobSeeker profile with ID: {}", jobSeeker.getId());
                log.info("Current coverLetterDocumentId: {}", jobSeeker.getCoverLetterDocumentId());
            } else {
                // Create new job seeker profile if it doesn't exist
                jobSeeker = jobSeekerService.createJobSeekerFromUser(currentUserId);
                log.info("Created new JobSeeker profile for user: {} with ID: {}", currentUserId, jobSeeker.getId());
            }
            
            // Update the cover letter document ID (reference to ProgramDocument)
            log.info("Setting coverLetterDocumentId to: {}", document.getId());
            jobSeeker.setCoverLetterDocumentId(document.getId());
            
            // Save the profile
            JobSeeker savedJobSeeker = jobSeekerService.saveJobSeekerProfile(jobSeeker);
            log.info("Profile saved successfully. New coverLetterDocumentId: {}", savedJobSeeker.getCoverLetterDocumentId());
            log.info("Profile ID: {}", savedJobSeeker.getId());

            return ResponseEntity.ok(document.getId());
        } catch (Exception e) {
            log.error("Error uploading cover letter: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Upload profile picture for current user
     */
    @PostMapping("/profile/picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Uploading profile picture for user: {}", currentUserId);
            log.info("File details: name={}, size={}, contentType={}", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType());

            // Validate file type (only images)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                log.error("Invalid file type for profile picture: {}", contentType);
                return ResponseEntity.badRequest().body("Only image files are allowed for profile pictures");
            }

            // Upload document and create ProgramDocument record
            com.wits.project.model.ProgramDocument document = documentService.uploadDocument(
                file, 
                currentUserId, 
                com.wits.project.model.enums.Enums.ProgramType.PROFILE_PICTURE, 
                "Profile Picture for " + file.getOriginalFilename()
            );
            log.info("Profile picture document created with ID: {}", document.getId());
            
            // Get or create the job seeker profile
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(currentUserId);
            JobSeeker jobSeeker;
            
            if (jobSeekerOpt.isPresent()) {
                jobSeeker = jobSeekerOpt.get();
                log.info("Updating existing JobSeeker profile with ID: {}", jobSeeker.getId());
                log.info("Current profilePicture: {}", jobSeeker.getProfilePicture());
            } else {
                // Create new job seeker profile if it doesn't exist
                jobSeeker = jobSeekerService.createJobSeekerFromUser(currentUserId);
                log.info("Created new JobSeeker profile for user: {} with ID: {}", currentUserId, jobSeeker.getId());
            }
            
            // Update the profile picture
            log.info("Setting profilePicture to: {}", document.getId());
            jobSeeker.setProfilePicture(document.getId());
            
            // Save the profile
            JobSeeker savedJobSeeker = jobSeekerService.saveJobSeekerProfile(jobSeeker);
            log.info("Profile saved successfully. New profilePicture: {}", savedJobSeeker.getProfilePicture());
            log.info("Profile ID: {}", savedJobSeeker.getId());

            return ResponseEntity.ok(document.getId());
        } catch (Exception e) {
            log.error("Error uploading profile picture: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Search job seekers (for employers)
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<ProfileResponse>> searchJobSeekers(
            @RequestParam(required = false) List<String> skills,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) Boolean veteran,
            @RequestParam(required = false) Boolean spouse,
            @RequestParam(required = false) Boolean willingToRelocate) {
        
        try {
            log.info("Searching job seekers with criteria: skills={}, location={}, jobType={}, veteran={}, spouse={}, willingToRelocate={}", 
                    skills, location, jobType, veteran, spouse, willingToRelocate);

            List<JobSeeker> jobSeekers = jobSeekerService.findJobSeekersBySkills(skills != null ? skills : List.of());
            
            // Apply additional filters
            if (location != null) {
                jobSeekers = jobSeekers.stream()
                    .filter(js -> js.getPreferredLocation() != null && 
                                 js.getPreferredLocation().toLowerCase().contains(location.toLowerCase()))
                    .toList();
            }

            if (veteran != null && veteran) {
                jobSeekers = jobSeekers.stream()
                    .filter(js -> Boolean.TRUE.equals(js.getVeteran()))
                    .toList();
            }

            if (spouse != null && spouse) {
                jobSeekers = jobSeekers.stream()
                    .filter(js -> Boolean.TRUE.equals(js.getSpouse()))
                    .toList();
            }

            if (willingToRelocate != null && willingToRelocate) {
                jobSeekers = jobSeekers.stream()
                    .filter(js -> Boolean.TRUE.equals(js.getWillingToRelocate()))
                    .toList();
            }

            List<ProfileResponse> responses = jobSeekers.stream()
                .map(this::convertToProfileResponse)
                .toList();

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error searching job seekers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get job seeker profile by ID (for employers)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ProfileResponse> getJobSeekerById(@PathVariable String id) {
        try {
            log.info("Getting job seeker profile by ID: {}", id);

            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(id);
            if (jobSeekerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(convertToProfileResponse(jobSeekerOpt.get()));
        } catch (Exception e) {
            log.error("Error getting job seeker by ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download resume file
     */
    @GetMapping("/profile/resume/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResume() {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Downloading resume for user: {}", currentUserId);
            
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(currentUserId);
            if (jobSeekerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            JobSeeker jobSeeker = jobSeekerOpt.get();
            String resumeDocumentId = jobSeeker.getResumeDocumentId();
            
            if (resumeDocumentId == null || resumeDocumentId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Get the document from ProgramDocument collection
            Optional<com.wits.project.model.ProgramDocument> documentOpt = documentService.getDocumentById(resumeDocumentId);
            if (documentOpt.isEmpty()) {
                log.warn("Resume document not found with ID: {}", resumeDocumentId);
                return ResponseEntity.notFound().build();
            }
            
            com.wits.project.model.ProgramDocument document = documentOpt.get();
            String filePath = document.getFileId();
            
            if (!fileStorageService.fileExists(filePath)) {
                log.warn("Resume file not found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path fullPath = fileStorageService.getFilePath(filePath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(fullPath.toFile());
            
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fullPath.getFileName().toString() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            log.error("Error downloading resume: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download resume file for employer (by user ID)
     */
    @GetMapping("/profile/resume/download/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResumeForEmployer(@RequestParam String userId) {
        try {
            log.info("Employer downloading resume for user: {}", userId);
            
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(userId);
            if (jobSeekerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            JobSeeker jobSeeker = jobSeekerOpt.get();
            String resumeDocumentId = jobSeeker.getResumeDocumentId();
            
            if (resumeDocumentId == null || resumeDocumentId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Get the document from ProgramDocument collection
            Optional<com.wits.project.model.ProgramDocument> documentOpt = documentService.getDocumentById(resumeDocumentId);
            if (documentOpt.isEmpty()) {
                log.warn("Resume document not found with ID: {}", resumeDocumentId);
                return ResponseEntity.notFound().build();
            }
            
            com.wits.project.model.ProgramDocument document = documentOpt.get();
            String filePath = document.getFileId();
            
            if (!fileStorageService.fileExists(filePath)) {
                log.warn("Resume file not found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path fullPath = fileStorageService.getFilePath(filePath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(fullPath.toFile());
            
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fullPath.getFileName().toString() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            log.error("Error downloading resume for employer: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download cover letter file
     */
    @GetMapping("/profile/cover-letter/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadCoverLetter() {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Downloading cover letter for user: {}", currentUserId);
            
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(currentUserId);
            if (jobSeekerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            JobSeeker jobSeeker = jobSeekerOpt.get();
            String coverLetterDocumentId = jobSeeker.getCoverLetterDocumentId();
            
            if (coverLetterDocumentId == null || coverLetterDocumentId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Get the document from ProgramDocument collection
            Optional<com.wits.project.model.ProgramDocument> documentOpt = documentService.getDocumentById(coverLetterDocumentId);
            if (documentOpt.isEmpty()) {
                log.warn("Cover letter document not found with ID: {}", coverLetterDocumentId);
                return ResponseEntity.notFound().build();
            }
            
            com.wits.project.model.ProgramDocument document = documentOpt.get();
            String filePath = document.getFileId();
            
            if (!fileStorageService.fileExists(filePath)) {
                log.warn("Cover letter file not found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path fullPath = fileStorageService.getFilePath(filePath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(fullPath.toFile());
            
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fullPath.getFileName().toString() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            log.error("Error downloading cover letter: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download cover letter file for employer (by user ID)
     */
    @GetMapping("/profile/cover-letter/download/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<org.springframework.core.io.Resource> downloadCoverLetterForEmployer(@RequestParam String userId) {
        try {
            log.info("Employer downloading cover letter for user: {}", userId);
            
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(userId);
            if (jobSeekerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            JobSeeker jobSeeker = jobSeekerOpt.get();
            String coverLetterDocumentId = jobSeeker.getCoverLetterDocumentId();
            
            if (coverLetterDocumentId == null || coverLetterDocumentId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Get the document from ProgramDocument collection
            Optional<com.wits.project.model.ProgramDocument> documentOpt = documentService.getDocumentById(coverLetterDocumentId);
            if (documentOpt.isEmpty()) {
                log.warn("Cover letter document not found with ID: {}", coverLetterDocumentId);
                return ResponseEntity.notFound().build();
            }
            
            com.wits.project.model.ProgramDocument document = documentOpt.get();
            String filePath = document.getFileId();
            
            if (!fileStorageService.fileExists(filePath)) {
                log.warn("Cover letter file not found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path fullPath = fileStorageService.getFilePath(filePath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(fullPath.toFile());
            
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fullPath.getFileName().toString() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            log.error("Error downloading cover letter for employer: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download profile picture file
     */
    @GetMapping("/profile/picture/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadProfilePicture() {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Downloading profile picture for user: {}", currentUserId);
            
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(currentUserId);
            if (jobSeekerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            JobSeeker jobSeeker = jobSeekerOpt.get();
            String profilePictureDocumentId = jobSeeker.getProfilePicture();
            
            if (profilePictureDocumentId == null || profilePictureDocumentId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Get the document from ProgramDocument collection
            Optional<com.wits.project.model.ProgramDocument> documentOpt = documentService.getDocumentById(profilePictureDocumentId);
            if (documentOpt.isEmpty()) {
                log.warn("Profile picture document not found with ID: {}", profilePictureDocumentId);
                return ResponseEntity.notFound().build();
            }
            
            com.wits.project.model.ProgramDocument document = documentOpt.get();
            
            // Verify the document belongs to the current user
            if (!document.getUserId().equals(currentUserId)) {
                log.warn("Profile picture document does not belong to current user. Document user: {}, current user: {}", 
                        document.getUserId(), currentUserId);
                return ResponseEntity.status(403).build();
            }
            
            String filePath = document.getFileId();
            
            if (!fileStorageService.fileExists(filePath)) {
                log.warn("Profile picture file not found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path fullPath = fileStorageService.getFilePath(filePath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(fullPath.toFile());
            
            return ResponseEntity.ok()
                .header("Content-Type", document.getFileContentType())
                .body(resource);
                
        } catch (Exception e) {
            log.error("Error downloading profile picture: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download profile picture file for employer (by user ID)
     */
    @GetMapping("/profile/picture/download/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<org.springframework.core.io.Resource> downloadProfilePictureForEmployer(@RequestParam String userId) {
        try {
            log.info("Employer downloading profile picture for user: {}", userId);
            
            Optional<JobSeeker> jobSeekerOpt = jobSeekerService.getJobSeekerByUserId(userId);
            if (jobSeekerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            JobSeeker jobSeeker = jobSeekerOpt.get();
            String profilePictureDocumentId = jobSeeker.getProfilePicture();
            
            if (profilePictureDocumentId == null || profilePictureDocumentId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Get the document from ProgramDocument collection
            Optional<com.wits.project.model.ProgramDocument> documentOpt = documentService.getDocumentById(profilePictureDocumentId);
            if (documentOpt.isEmpty()) {
                log.warn("Profile picture document not found with ID: {}", profilePictureDocumentId);
                return ResponseEntity.notFound().build();
            }
            
            com.wits.project.model.ProgramDocument document = documentOpt.get();
            String filePath = document.getFileId();
            
            if (!fileStorageService.fileExists(filePath)) {
                log.warn("Profile picture file not found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path fullPath = fileStorageService.getFilePath(filePath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(fullPath.toFile());
            
            return ResponseEntity.ok()
                .header("Content-Type", document.getFileContentType())
                .body(resource);
                
        } catch (Exception e) {
            log.error("Error downloading profile picture for employer: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper methods to convert between DTOs and entities
    private ProfileResponse convertToProfileResponse(JobSeeker jobSeeker) {
        ProfileResponse response = new ProfileResponse();
        response.setId(jobSeeker.getId());
        response.setUserId(jobSeeker.getUserId());
        response.setFirstName(jobSeeker.getFirstName());
        response.setLastName(jobSeeker.getLastName());
        response.setDateOfBirth(jobSeeker.getDateOfBirth());
        response.setEmail(jobSeeker.getEmail());
        response.setPhoneNumber(jobSeeker.getPhoneNumber());
        response.setAddress(jobSeeker.getAddress());
        response.setEducation(jobSeeker.getEducation());
        response.setWorkHistory(jobSeeker.getWorkHistory());
        response.setSkills(jobSeeker.getSkills());
        response.setCertifications(jobSeeker.getCertifications());
        response.setVeteran(jobSeeker.getVeteran());
        response.setSpouse(jobSeeker.getSpouse());
        response.setResourceReferralOptIn(jobSeeker.getResourceReferralOptIn());
        response.setResumeDocumentId(jobSeeker.getResumeDocumentId());
        response.setCoverLetterDocumentId(jobSeeker.getCoverLetterDocumentId());
        response.setProfilePictureDocumentId(jobSeeker.getProfilePicture());
        response.setProfileCompletionPercent(jobSeeker.getProfileCompletionPercent());
        response.setPreferredJobType(jobSeeker.getPreferredJobType());
        response.setPreferredLocation(jobSeeker.getPreferredLocation());
        response.setExpectedSalary(jobSeeker.getExpectedSalary());
        response.setAvailability(jobSeeker.getAvailability());
        response.setWillingToRelocate(jobSeeker.getWillingToRelocate());
        response.setLinkedInProfile(jobSeeker.getLinkedInProfile());
        response.setPortfolioUrl(jobSeeker.getPortfolioUrl());
        response.setSummary(jobSeeker.getSummary());
        return response;
    }

    private JobSeeker convertToJobSeeker(ProfileUpdateRequest request) {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setFirstName(request.getFirstName());
        jobSeeker.setLastName(request.getLastName());
        jobSeeker.setDateOfBirth(request.getDateOfBirth());
        jobSeeker.setEmail(request.getEmail());
        jobSeeker.setPhoneNumber(request.getPhoneNumber());
        jobSeeker.setAddress(request.getAddress());
        jobSeeker.setEducation(request.getEducation());
        jobSeeker.setWorkHistory(request.getWorkHistory());
        jobSeeker.setSkills(request.getSkills());
        jobSeeker.setCertifications(request.getCertifications());
        jobSeeker.setVeteran(request.getVeteran());
        jobSeeker.setSpouse(request.getSpouse());
        jobSeeker.setResourceReferralOptIn(request.getResourceReferralOptIn());
        jobSeeker.setPreferredJobType(request.getPreferredJobType());
        jobSeeker.setPreferredLocation(request.getPreferredLocation());
        jobSeeker.setExpectedSalary(request.getExpectedSalary());
        jobSeeker.setAvailability(request.getAvailability());
        jobSeeker.setWillingToRelocate(request.getWillingToRelocate());
        jobSeeker.setLinkedInProfile(request.getLinkedInProfile());
        jobSeeker.setPortfolioUrl(request.getPortfolioUrl());
        jobSeeker.setSummary(request.getSummary());
        return jobSeeker;
    }
}