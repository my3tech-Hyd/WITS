package com.wits.project.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wits.project.model.Employer;
import com.wits.project.model.User;
import com.wits.project.repository.EmployerRepository;
import com.wits.project.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmployerService {

    @Autowired
    private EmployerRepository employerRepository;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Get employer profile by user ID
     */
    public Optional<Employer> getEmployerByUserId(String userId) {
        return employerRepository.findByUserId(userId);
    }

    /**
     * Create employer profile from user data
     */
    public Employer createEmployerFromUser(String userId) {
        log.info("Creating employer profile for user: {}", userId);
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        User user = userOpt.get();
        
        Employer employer = new Employer();
        employer.setUserId(userId);
        employer.setFullName(user.getFirstName() + " " + user.getLastName());
        employer.setEmail(user.getEmail());
        employer.setPhone(user.getPhoneNumber());
        employer.setIsVerified(false);
        employer.setVerificationStatus("PENDING");
        employer.setProfileCompletionPercent(0.0);
        
        // Set default notification preferences
        employer.setEmailNotifications(true);
        employer.setSmsNotifications(false);
        employer.setApplicationAlerts(true);
        employer.setWeeklyReports(true);
        employer.setShowContactInformation(true);
        
        Employer savedEmployer = employerRepository.save(employer);
        log.info("Created employer profile with ID: {}", savedEmployer.getId());
        
        return savedEmployer;
    }

    /**
     * Save employer profile
     */
    public Employer saveEmployerProfile(Employer employer) {
        log.info("Saving employer profile for user: {}", employer.getUserId());
        
        // Calculate profile completion before saving
        employer.setProfileCompletionPercent(calculateProfileCompletion(employer));
        
        Employer savedEmployer = employerRepository.save(employer);
        log.info("Saved employer profile with ID: {}", savedEmployer.getId());
        
        return savedEmployer;
    }

    /**
     * Update employer profile
     */
    public Employer updateEmployerProfile(String userId, Employer employer) {
        log.info("Updating employer profile for user: {}", userId);
        
        Optional<Employer> existingEmployerOpt = employerRepository.findByUserId(userId);
        if (existingEmployerOpt.isEmpty()) {
            throw new RuntimeException("Employer profile not found for user: " + userId);
        }
        
        Employer existingEmployer = existingEmployerOpt.get();
        
        // Update fields
        existingEmployer.setFullName(employer.getFullName());
        existingEmployer.setEmail(employer.getEmail());
        existingEmployer.setPhone(employer.getPhone());
        existingEmployer.setJobPosition(employer.getJobPosition());
        existingEmployer.setProfilePicture(employer.getProfilePicture());
        
        // Company information
        existingEmployer.setCompanyName(employer.getCompanyName());
        existingEmployer.setIndustry(employer.getIndustry());
        existingEmployer.setCompanySize(employer.getCompanySize());
        existingEmployer.setWebsite(employer.getWebsite());
        existingEmployer.setDescription(employer.getDescription());
        existingEmployer.setStreetAddress(employer.getStreetAddress());
        existingEmployer.setCity(employer.getCity());
        existingEmployer.setState(employer.getState());
        existingEmployer.setZipCode(employer.getZipCode());
        existingEmployer.setCompanyPhone(employer.getCompanyPhone());
        existingEmployer.setContactEmail(employer.getContactEmail());
        existingEmployer.setBenefits(employer.getBenefits());
        existingEmployer.setCulture(employer.getCulture());
        
        // Additional fields
        existingEmployer.setDepartment(employer.getDepartment());
        existingEmployer.setLinkedInProfile(employer.getLinkedInProfile());
        existingEmployer.setCompanyLogo(employer.getCompanyLogo());
        
        // Notification preferences
        existingEmployer.setEmailNotifications(employer.getEmailNotifications());
        existingEmployer.setSmsNotifications(employer.getSmsNotifications());
        existingEmployer.setApplicationAlerts(employer.getApplicationAlerts());
        existingEmployer.setWeeklyReports(employer.getWeeklyReports());
        
        // Privacy settings
        existingEmployer.setShowContactInformation(employer.getShowContactInformation());
        
        // Calculate profile completion
        existingEmployer.setProfileCompletionPercent(calculateProfileCompletion(existingEmployer));
        
        Employer updatedEmployer = employerRepository.save(existingEmployer);
        log.info("Updated employer profile with ID: {}", updatedEmployer.getId());
        
        return updatedEmployer;
    }

    /**
     * Calculate profile completion percentage
     */
    private Double calculateProfileCompletion(Employer employer) {
        int totalFields = 0;
        int completedFields = 0;
        
        // Personal Information (5 fields)
        totalFields += 5;
        if (employer.getFullName() != null && !employer.getFullName().trim().isEmpty()) completedFields++;
        if (employer.getEmail() != null && !employer.getEmail().trim().isEmpty()) completedFields++;
        if (employer.getPhone() != null && !employer.getPhone().trim().isEmpty()) completedFields++;
        if (employer.getJobPosition() != null && !employer.getJobPosition().trim().isEmpty()) completedFields++;
        if (employer.getProfilePicture() != null && !employer.getProfilePicture().trim().isEmpty()) completedFields++;
        
        // Company Information (12 fields)
        totalFields += 12;
        if (employer.getCompanyName() != null && !employer.getCompanyName().trim().isEmpty()) completedFields++;
        if (employer.getIndustry() != null && !employer.getIndustry().trim().isEmpty()) completedFields++;
        if (employer.getCompanySize() != null && !employer.getCompanySize().trim().isEmpty()) completedFields++;
        if (employer.getWebsite() != null && !employer.getWebsite().trim().isEmpty()) completedFields++;
        if (employer.getDescription() != null && !employer.getDescription().trim().isEmpty()) completedFields++;
        if (employer.getStreetAddress() != null && !employer.getStreetAddress().trim().isEmpty()) completedFields++;
        if (employer.getCity() != null && !employer.getCity().trim().isEmpty()) completedFields++;
        if (employer.getState() != null && !employer.getState().trim().isEmpty()) completedFields++;
        if (employer.getZipCode() != null && !employer.getZipCode().trim().isEmpty()) completedFields++;
        if (employer.getCompanyPhone() != null && !employer.getCompanyPhone().trim().isEmpty()) completedFields++;
        if (employer.getContactEmail() != null && !employer.getContactEmail().trim().isEmpty()) completedFields++;
        if (employer.getBenefits() != null && !employer.getBenefits().trim().isEmpty()) completedFields++;
        
        // Additional fields (3 fields)
        totalFields += 3;
        if (employer.getDepartment() != null && !employer.getDepartment().trim().isEmpty()) completedFields++;
        if (employer.getLinkedInProfile() != null && !employer.getLinkedInProfile().trim().isEmpty()) completedFields++;
        if (employer.getCompanyLogo() != null && !employer.getCompanyLogo().trim().isEmpty()) completedFields++;
        
        return totalFields > 0 ? (double) completedFields / totalFields * 100 : 0.0;
    }

    /**
     * Search employers
     */
    public List<Employer> searchEmployers(String companyName, String industry, String location, Boolean isVerified) {
        if (companyName != null && !companyName.trim().isEmpty()) {
            return employerRepository.findByCompanyNameContainingIgnoreCase(companyName);
        }
        
        if (industry != null && !industry.trim().isEmpty()) {
            return employerRepository.findByIndustry(industry);
        }
        
        if (isVerified != null) {
            return employerRepository.findByIsVerified(isVerified);
        }
        
        return employerRepository.findAll();
    }

    /**
     * Get all verified employers
     */
    public List<Employer> getVerifiedEmployers() {
        return employerRepository.findByIsVerified(true);
    }

    /**
     * Update verification status
     */
    public Employer updateVerificationStatus(String userId, String status, String notes) {
        Optional<Employer> employerOpt = employerRepository.findByUserId(userId);
        if (employerOpt.isEmpty()) {
            throw new RuntimeException("Employer not found for user: " + userId);
        }
        
        Employer employer = employerOpt.get();
        employer.setVerificationStatus(status);
        employer.setVerificationNotes(notes);
        employer.setIsVerified("APPROVED".equals(status));
        
        return employerRepository.save(employer);
    }

    /**
     * Delete employer profile
     */
    public boolean deleteEmployerProfile(String userId) {
        Optional<Employer> employerOpt = employerRepository.findByUserId(userId);
        if (employerOpt.isPresent()) {
            employerRepository.deleteById(employerOpt.get().getId());
            log.info("Deleted employer profile for user: {}", userId);
            return true;
        }
        return false;
    }
}