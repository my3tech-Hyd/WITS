package com.wits.project.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "job_seekers")
public class JobSeeker extends BaseDocument {

    private String userId; // Reference to User entity

    // Personal Information (from User entity)
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String email;
    private String phoneNumber;
    private String address;

    // Professional Information
    private String education; // Educational background as text
    private String workHistory; // Work experience and achievements
    private List<String> skills;
    private List<String> certifications;

    // Status Information
    private Boolean veteran;
    private Boolean spouse;
    private Boolean resourceReferralOptIn;

    // Documents
    private String resumeDocumentId;
    private String coverLetterDocumentId;
    private String profilePicture;

    // Profile completion
    private Double profileCompletionPercent;

    // Additional fields for job seeker specific data
    private String preferredJobType;
    private String preferredLocation;
    private Double expectedSalary;
    private String availability; // e.g., "Immediate", "2 weeks notice", "1 month notice"
    private Boolean willingToRelocate;
    private String linkedInProfile;
    private String portfolioUrl;
    private String summary; // Professional summary/objective
}
 