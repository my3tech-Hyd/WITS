package com.wits.project.web.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class JobSeekerDtos {

    // Request DTO for updating job seeker profile
    @Getter
    @Setter
    public static class ProfileUpdateRequest {
        // Personal Information
        private String firstName;
        private String lastName;
        private LocalDate dateOfBirth;
        private String email;
        private String phoneNumber;
        private String address;

        // Professional Information
        private String education;
        private String workHistory;
        private List<String> skills;
        private List<String> certifications;

        // Status Information
        private Boolean veteran;
        private Boolean spouse;
        private Boolean resourceReferralOptIn;

        // Job Seeker Specific Information
        private String preferredJobType;
        private String preferredLocation;
        private Double expectedSalary;
        private String availability;
        private Boolean willingToRelocate;
        private String linkedInProfile;
        private String portfolioUrl;
        private String summary;
    }

    // Response DTO for job seeker profile
    @Getter
    @Setter
    public static class ProfileResponse {
        private String id;
        private String userId;
        
        // Personal Information
        private String firstName;
        private String lastName;
        private LocalDate dateOfBirth;
        private String email;
        private String phoneNumber;
        private String address;

        // Professional Information
        private String education;
        private String workHistory;
        private List<String> skills;
        private List<String> certifications;

        // Status Information
        private Boolean veteran;
        private Boolean spouse;
        private Boolean resourceReferralOptIn;

        // Documents
        private String resumeDocumentId;
        private String coverLetterDocumentId;

        // Profile completion
        private Double profileCompletionPercent;

        // Job Seeker Specific Information
        private String preferredJobType;
        private String preferredLocation;
        private Double expectedSalary;
        private String availability;
        private Boolean willingToRelocate;
        private String linkedInProfile;
        private String portfolioUrl;
        private String summary;
    }

    // DTO for job seeker search/matching
    @Getter
    @Setter
    public static class JobSeekerSearchRequest {
        private List<String> skills;
        private String location;
        private String jobType;
        private Boolean veteran;
        private Boolean spouse;
        private Boolean willingToRelocate;
        private Double minSalary;
        private Double maxSalary;
    }
}