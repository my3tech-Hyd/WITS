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

import com.wits.project.model.Employer;
import com.wits.project.security.SecurityUtil;
import com.wits.project.service.EmployerService;
import com.wits.project.service.DocumentService;
import com.wits.project.service.FileStorageService;
import com.wits.project.web.dto.EmployerDtos.ProfileResponse;
import com.wits.project.web.dto.EmployerDtos.ProfileUpdateRequest;
import com.wits.project.web.dto.EmployerDtos.EmployerSearchRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/employers")
@PreAuthorize("hasRole('EMPLOYER')")
public class EmployerController {

    @Autowired
    private EmployerService employerService;
    
    @Autowired
    private DocumentService documentService;
    
    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Get current user's employer profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Getting employer profile for user: {}", currentUserId);

            Optional<Employer> employerOpt = employerService.getEmployerByUserId(currentUserId);
            
            if (employerOpt.isEmpty()) {
                // Create profile if it doesn't exist
                Employer newProfile = employerService.createEmployerFromUser(currentUserId);
                return ResponseEntity.ok(convertToProfileResponse(newProfile));
            }

            return ResponseEntity.ok(convertToProfileResponse(employerOpt.get()));
        } catch (Exception e) {
            log.error("Error getting employer profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update current user's employer profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateMyProfile(@RequestBody ProfileUpdateRequest request) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Updating employer profile for user: {}", currentUserId);

            // Convert request to Employer object
            Employer employer = convertToEmployer(request);
            employer.setUserId(currentUserId);

            Employer updatedProfile = employerService.updateEmployerProfile(currentUserId, employer);
            return ResponseEntity.ok(convertToProfileResponse(updatedProfile));
        } catch (Exception e) {
            log.error("Error updating employer profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Upload profile picture
     */
    @PostMapping("/profile/picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Uploading profile picture for user: {}", currentUserId);

            // Upload document and create ProgramDocument record
            com.wits.project.model.ProgramDocument document = documentService.uploadDocument(
                file, 
                currentUserId, 
                com.wits.project.model.enums.Enums.ProgramType.PROFILE_PICTURE, 
                "Profile Picture for " + file.getOriginalFilename()
            );
            log.info("Profile picture document created with ID: {}", document.getId());
            
            // Get or create the employer profile
            Optional<Employer> employerOpt = employerService.getEmployerByUserId(currentUserId);
            Employer employer;
            
            if (employerOpt.isPresent()) {
                employer = employerOpt.get();
                log.info("Updating existing Employer profile with ID: {}", employer.getId());
            } else {
                // Create new employer profile if it doesn't exist
                employer = employerService.createEmployerFromUser(currentUserId);
                log.info("Created new Employer profile for user: {} with ID: {}", currentUserId, employer.getId());
            }
            
            // Update the profile picture
            employer.setProfilePicture(document.getId());
            
            // Save the profile
            Employer savedEmployer = employerService.saveEmployerProfile(employer);
            log.info("Profile saved successfully. New profilePicture: {}", savedEmployer.getProfilePicture());

            return ResponseEntity.ok(document.getId());
        } catch (Exception e) {
            log.error("Error uploading profile picture: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Upload company logo
     */
    @PostMapping("/profile/logo")
    public ResponseEntity<String> uploadCompanyLogo(@RequestParam("file") MultipartFile file) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Uploading company logo for user: {}", currentUserId);

            // Upload document and create ProgramDocument record
            com.wits.project.model.ProgramDocument document = documentService.uploadDocument(
                file, 
                currentUserId, 
                com.wits.project.model.enums.Enums.ProgramType.OTHER, 
                "Company Logo for " + file.getOriginalFilename()
            );
            log.info("Company logo document created with ID: {}", document.getId());
            
            // Get or create the employer profile
            Optional<Employer> employerOpt = employerService.getEmployerByUserId(currentUserId);
            Employer employer;
            
            if (employerOpt.isPresent()) {
                employer = employerOpt.get();
                log.info("Updating existing Employer profile with ID: {}", employer.getId());
            } else {
                // Create new employer profile if it doesn't exist
                employer = employerService.createEmployerFromUser(currentUserId);
                log.info("Created new Employer profile for user: {} with ID: {}", currentUserId, employer.getId());
            }
            
            // Update the company logo
            employer.setCompanyLogo(document.getId());
            
            // Save the profile
            Employer savedEmployer = employerService.saveEmployerProfile(employer);
            log.info("Profile saved successfully. New companyLogo: {}", savedEmployer.getCompanyLogo());

            return ResponseEntity.ok(document.getId());
        } catch (Exception e) {
            log.error("Error uploading company logo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Search employers (for admin/staff)
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<ProfileResponse>> searchEmployers(
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean isVerified) {
        
        try {
            log.info("Searching employers with criteria: companyName={}, industry={}, location={}, isVerified={}", 
                    companyName, industry, location, isVerified);

            List<Employer> employers = employerService.searchEmployers(companyName, industry, location, isVerified);
            
            List<ProfileResponse> responses = employers.stream()
                .map(this::convertToProfileResponse)
                .toList();

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error searching employers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get employer profile by ID (for admin/staff)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ProfileResponse> getEmployerById(@PathVariable String id) {
        try {
            log.info("Getting employer profile by ID: {}", id);

            Optional<Employer> employerOpt = employerService.getEmployerByUserId(id);
            if (employerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(convertToProfileResponse(employerOpt.get()));
        } catch (Exception e) {
            log.error("Error getting employer by ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update verification status (for admin/staff)
     */
    @PutMapping("/{userId}/verification")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ProfileResponse> updateVerificationStatus(
            @PathVariable String userId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        try {
            log.info("Updating verification status for user: {} to: {}", userId, status);

            Employer updatedEmployer = employerService.updateVerificationStatus(userId, status, notes);
            return ResponseEntity.ok(convertToProfileResponse(updatedEmployer));
        } catch (Exception e) {
            log.error("Error updating verification status: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all verified employers
     */
    @GetMapping("/verified")
    public ResponseEntity<List<ProfileResponse>> getVerifiedEmployers() {
        try {
            log.info("Getting all verified employers");

            List<Employer> employers = employerService.getVerifiedEmployers();
            
            List<ProfileResponse> responses = employers.stream()
                .map(this::convertToProfileResponse)
                .toList();

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error getting verified employers: {}", e.getMessage(), e);
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
            
            Optional<Employer> employerOpt = employerService.getEmployerByUserId(currentUserId);
            if (employerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employer employer = employerOpt.get();
            String profilePictureDocumentId = employer.getProfilePicture();
            
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
     * Download company logo file
     */
    @GetMapping("/profile/logo/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadCompanyLogo() {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            log.info("Downloading company logo for user: {}", currentUserId);
            
            Optional<Employer> employerOpt = employerService.getEmployerByUserId(currentUserId);
            if (employerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employer employer = employerOpt.get();
            String companyLogoDocumentId = employer.getCompanyLogo();
            
            if (companyLogoDocumentId == null || companyLogoDocumentId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Get the document from ProgramDocument collection
            Optional<com.wits.project.model.ProgramDocument> documentOpt = documentService.getDocumentById(companyLogoDocumentId);
            if (documentOpt.isEmpty()) {
                log.warn("Company logo document not found with ID: {}", companyLogoDocumentId);
                return ResponseEntity.notFound().build();
            }
            
            com.wits.project.model.ProgramDocument document = documentOpt.get();
            
            // Verify the document belongs to the current user
            if (!document.getUserId().equals(currentUserId)) {
                log.warn("Company logo document does not belong to current user. Document user: {}, current user: {}", 
                        document.getUserId(), currentUserId);
                return ResponseEntity.status(403).build();
            }
            
            String filePath = document.getFileId();
            
            if (!fileStorageService.fileExists(filePath)) {
                log.warn("Company logo file not found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path fullPath = fileStorageService.getFilePath(filePath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(fullPath.toFile());
            
            return ResponseEntity.ok()
                .header("Content-Type", document.getFileContentType())
                .body(resource);
                
        } catch (Exception e) {
            log.error("Error downloading company logo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper methods to convert between DTOs and entities
    private ProfileResponse convertToProfileResponse(Employer employer) {
        ProfileResponse response = new ProfileResponse();
        response.setId(employer.getId());
        response.setUserId(employer.getUserId());
        
        // Personal Information
        response.setFullName(employer.getFullName());
        response.setEmail(employer.getEmail());
        response.setPhone(employer.getPhone());
        response.setJobPosition(employer.getJobPosition());
        response.setProfilePicture(employer.getProfilePicture());
        
        // Company Information
        response.setCompanyName(employer.getCompanyName());
        response.setIndustry(employer.getIndustry());
        response.setCompanySize(employer.getCompanySize());
        response.setWebsite(employer.getWebsite());
        response.setDescription(employer.getDescription());
        response.setStreetAddress(employer.getStreetAddress());
        response.setCity(employer.getCity());
        response.setState(employer.getState());
        response.setZipCode(employer.getZipCode());
        response.setCompanyPhone(employer.getCompanyPhone());
        response.setContactEmail(employer.getContactEmail());
        response.setBenefits(employer.getBenefits());
        response.setCulture(employer.getCulture());
        
        // Additional fields
        response.setDepartment(employer.getDepartment());
        response.setLinkedInProfile(employer.getLinkedInProfile());
        response.setCompanyLogo(employer.getCompanyLogo());
        response.setIsVerified(employer.getIsVerified());
        response.setProfileCompletionPercent(employer.getProfileCompletionPercent());
        
        // Notification preferences
        response.setEmailNotifications(employer.getEmailNotifications());
        response.setSmsNotifications(employer.getSmsNotifications());
        response.setApplicationAlerts(employer.getApplicationAlerts());
        response.setWeeklyReports(employer.getWeeklyReports());
        
        // Privacy settings
        response.setShowContactInformation(employer.getShowContactInformation());
        
        // Company verification
        response.setVerificationDocumentId(employer.getVerificationDocumentId());
        response.setVerificationStatus(employer.getVerificationStatus());
        response.setVerificationNotes(employer.getVerificationNotes());
        
        return response;
    }

    private Employer convertToEmployer(ProfileUpdateRequest request) {
        Employer employer = new Employer();
        
        // Personal Information
        employer.setFullName(request.getFullName());
        employer.setEmail(request.getEmail());
        employer.setPhone(request.getPhone());
        employer.setJobPosition(request.getJobPosition());
        employer.setProfilePicture(request.getProfilePicture());
        
        // Company Information
        employer.setCompanyName(request.getCompanyName());
        employer.setIndustry(request.getIndustry());
        employer.setCompanySize(request.getCompanySize());
        employer.setWebsite(request.getWebsite());
        employer.setDescription(request.getDescription());
        employer.setStreetAddress(request.getStreetAddress());
        employer.setCity(request.getCity());
        employer.setState(request.getState());
        employer.setZipCode(request.getZipCode());
        employer.setCompanyPhone(request.getCompanyPhone());
        employer.setContactEmail(request.getContactEmail());
        employer.setBenefits(request.getBenefits());
        employer.setCulture(request.getCulture());
        
        // Additional fields
        employer.setDepartment(request.getDepartment());
        employer.setLinkedInProfile(request.getLinkedInProfile());
        employer.setCompanyLogo(request.getCompanyLogo());
        
        // Notification preferences
        employer.setEmailNotifications(request.getEmailNotifications());
        employer.setSmsNotifications(request.getSmsNotifications());
        employer.setApplicationAlerts(request.getApplicationAlerts());
        employer.setWeeklyReports(request.getWeeklyReports());
        
        // Privacy settings
        employer.setShowContactInformation(request.getShowContactInformation());
        
        return employer;
    }
}