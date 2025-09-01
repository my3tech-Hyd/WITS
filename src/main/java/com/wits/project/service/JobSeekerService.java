package com.wits.project.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wits.project.model.JobSeeker;
import com.wits.project.model.User;
import com.wits.project.repository.JobSeekerRepository;
import com.wits.project.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class JobSeekerService {

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get job seeker profile by user ID
     */
    public Optional<JobSeeker> getJobSeekerByUserId(String userId) {
        log.info("Getting job seeker profile for user ID: {}", userId);
        try {
            Optional<JobSeeker> result = jobSeekerRepository.findByUserId(userId);
            log.info("Job seeker profile found: {}", result.isPresent());
            return result;
        } catch (Exception e) {
            log.error("Error getting job seeker profile for user {}: {}", userId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Create or update job seeker profile
     */
    public JobSeeker saveJobSeekerProfile(JobSeeker jobSeeker) {
        log.info("Saving job seeker profile for user: {}", jobSeeker.getUserId());
        log.info("Profile ID: {}", jobSeeker.getId());
        log.info("ResumeDocumentId: {}", jobSeeker.getResumeDocumentId());
        log.info("CoverLetterDocumentId: {}", jobSeeker.getCoverLetterDocumentId());
        
        try {
            // Calculate profile completion percentage
            jobSeeker.setProfileCompletionPercent(calculateProfileCompletion(jobSeeker));
            
            // Save the job seeker profile
            JobSeeker savedJobSeeker = jobSeekerRepository.save(jobSeeker);
            
            log.info("Profile saved successfully!");
            log.info("Saved Profile ID: {}", savedJobSeeker.getId());
            log.info("Saved ResumeDocumentId: {}", savedJobSeeker.getResumeDocumentId());
            log.info("Saved CoverLetterDocumentId: {}", savedJobSeeker.getCoverLetterDocumentId());
            
            // Update the user's profile completion percentage
            updateUserProfileCompletion(jobSeeker.getUserId(), jobSeeker.getProfileCompletionPercent());
            
            log.info("Job seeker profile saved successfully for user: {}", jobSeeker.getUserId());
            return savedJobSeeker;
        } catch (Exception e) {
            log.error("Error saving job seeker profile for user {}: {}", jobSeeker.getUserId(), e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Create job seeker profile from user data
     */
    public JobSeeker createJobSeekerFromUser(String userId) {
        log.info("Creating job seeker profile from user data for user ID: {}", userId);
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.error("User not found with ID: {}", userId);
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOpt.get();
        
        // Check if job seeker profile already exists
        Optional<JobSeeker> existingProfile = jobSeekerRepository.findByUserId(userId);
        if (existingProfile.isPresent()) {
            return existingProfile.get();
        }

        // Create new job seeker profile
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId(userId);
        
        // Copy common fields from user
        jobSeeker.setFirstName(user.getFirstName());
        jobSeeker.setLastName(user.getLastName());
        jobSeeker.setDateOfBirth(user.getDateOfBirth());
        jobSeeker.setEmail(user.getEmail());
        jobSeeker.setPhoneNumber(user.getPhoneNumber());
        jobSeeker.setAddress(user.getAddress());
        jobSeeker.setEducation(user.getEducation());
        jobSeeker.setSkills(user.getSkills());
        jobSeeker.setCertifications(user.getCertifications());
        jobSeeker.setVeteran(user.getVeteran());
        jobSeeker.setSpouse(user.getSpouse());
        jobSeeker.setResourceReferralOptIn(user.getResourceReferralOptIn());
        jobSeeker.setResumeDocumentId(user.getResumeDocumentId());
        jobSeeker.setCoverLetterDocumentId(user.getCoverLetterDocumentId());

        // Set default values for job seeker specific fields
        jobSeeker.setWorkHistory("");
        jobSeeker.setPreferredJobType("");
        jobSeeker.setPreferredLocation("");
        jobSeeker.setExpectedSalary(0.0);
        jobSeeker.setAvailability("Immediate");
        jobSeeker.setWillingToRelocate(false);
        jobSeeker.setLinkedInProfile("");
        jobSeeker.setPortfolioUrl("");
        jobSeeker.setSummary("");

        return saveJobSeekerProfile(jobSeeker);
    }

    /**
     * Update job seeker profile and sync with user data
     */
    public JobSeeker updateJobSeekerProfile(String userId, JobSeeker updatedProfile) {
        Optional<JobSeeker> existingProfile = jobSeekerRepository.findByUserId(userId);
        if (existingProfile.isEmpty()) {
            // Create new profile if it doesn't exist
            return createJobSeekerFromUser(userId);
        }

        JobSeeker currentProfile = existingProfile.get();
        
        // Update fields
        currentProfile.setFirstName(updatedProfile.getFirstName());
        currentProfile.setLastName(updatedProfile.getLastName());
        currentProfile.setDateOfBirth(updatedProfile.getDateOfBirth());
        currentProfile.setEmail(updatedProfile.getEmail());
        currentProfile.setPhoneNumber(updatedProfile.getPhoneNumber());
        currentProfile.setAddress(updatedProfile.getAddress());
        currentProfile.setEducation(updatedProfile.getEducation());
        currentProfile.setWorkHistory(updatedProfile.getWorkHistory());
        currentProfile.setSkills(updatedProfile.getSkills());
        currentProfile.setCertifications(updatedProfile.getCertifications());
        currentProfile.setVeteran(updatedProfile.getVeteran());
        currentProfile.setSpouse(updatedProfile.getSpouse());
        currentProfile.setResourceReferralOptIn(updatedProfile.getResourceReferralOptIn());
        currentProfile.setResumeDocumentId(updatedProfile.getResumeDocumentId());
        currentProfile.setCoverLetterDocumentId(updatedProfile.getCoverLetterDocumentId());
        
        // Update job seeker specific fields
        currentProfile.setPreferredJobType(updatedProfile.getPreferredJobType());
        currentProfile.setPreferredLocation(updatedProfile.getPreferredLocation());
        currentProfile.setExpectedSalary(updatedProfile.getExpectedSalary());
        currentProfile.setAvailability(updatedProfile.getAvailability());
        currentProfile.setWillingToRelocate(updatedProfile.getWillingToRelocate());
        currentProfile.setLinkedInProfile(updatedProfile.getLinkedInProfile());
        currentProfile.setPortfolioUrl(updatedProfile.getPortfolioUrl());
        currentProfile.setSummary(updatedProfile.getSummary());

        return saveJobSeekerProfile(currentProfile);
    }

    /**
     * Calculate profile completion percentage
     */
    private Double calculateProfileCompletion(JobSeeker jobSeeker) {
        int totalFields = 15; // Total number of important fields
        int completedFields = 0;

        // Personal Information (5 fields)
        if (jobSeeker.getFirstName() != null && !jobSeeker.getFirstName().trim().isEmpty()) completedFields++;
        if (jobSeeker.getLastName() != null && !jobSeeker.getLastName().trim().isEmpty()) completedFields++;
        if (jobSeeker.getEmail() != null && !jobSeeker.getEmail().trim().isEmpty()) completedFields++;
        if (jobSeeker.getPhoneNumber() != null && !jobSeeker.getPhoneNumber().trim().isEmpty()) completedFields++;
        if (jobSeeker.getAddress() != null && !jobSeeker.getAddress().trim().isEmpty()) completedFields++;

        // Professional Information (4 fields)
        if (jobSeeker.getEducation() != null && !jobSeeker.getEducation().trim().isEmpty()) completedFields++;
        if (jobSeeker.getWorkHistory() != null && !jobSeeker.getWorkHistory().trim().isEmpty()) completedFields++;
        if (jobSeeker.getSkills() != null && !jobSeeker.getSkills().isEmpty()) completedFields++;
        if (jobSeeker.getCertifications() != null && !jobSeeker.getCertifications().isEmpty()) completedFields++;

        // Documents (2 fields)
        if (jobSeeker.getResumeDocumentId() != null && !jobSeeker.getResumeDocumentId().trim().isEmpty()) completedFields++;
        if (jobSeeker.getCoverLetterDocumentId() != null && !jobSeeker.getCoverLetterDocumentId().trim().isEmpty()) completedFields++;

        // Additional fields (4 fields)
        if (jobSeeker.getPreferredJobType() != null && !jobSeeker.getPreferredJobType().trim().isEmpty()) completedFields++;
        if (jobSeeker.getPreferredLocation() != null && !jobSeeker.getPreferredLocation().trim().isEmpty()) completedFields++;
        if (jobSeeker.getSummary() != null && !jobSeeker.getSummary().trim().isEmpty()) completedFields++;
        if (jobSeeker.getLinkedInProfile() != null && !jobSeeker.getLinkedInProfile().trim().isEmpty()) completedFields++;

        return (double) Math.round((double) completedFields / totalFields * 100.0);
    }

    /**
     * Update user's profile completion percentage
     */
    private void updateUserProfileCompletion(String userId, Double completionPercent) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setProfileCompletionPercent(completionPercent);
            userRepository.save(user);
            log.info("Updated user profile completion to {}% for user: {}", completionPercent, userId);
        }
    }

    /**
     * Find job seekers by skills for job matching
     */
    public List<JobSeeker> findJobSeekersBySkills(List<String> skills) {
        return jobSeekerRepository.findBySkillsIn(skills);
    }

    /**
     * Find job seekers by location
     */
    public List<JobSeeker> findJobSeekersByLocation(String location) {
        return jobSeekerRepository.findByPreferredLocationContainingIgnoreCase(location);
    }

    /**
     * Find veteran job seekers
     */
    public List<JobSeeker> findVeteranJobSeekers() {
        return jobSeekerRepository.findByVeteranTrue();
    }

    /**
     * Find military spouse job seekers
     */
    public List<JobSeeker> findMilitarySpouseJobSeekers() {
        return jobSeekerRepository.findBySpouseTrue();
    }
}