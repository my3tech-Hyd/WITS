package com.wits.project.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "service_applications")
public class ServiceApplication extends BaseDocument {

    private String serviceId; // Reference to Service entity
    private String serviceTitle; // For quick access
    private String providerId; // Reference to Provider entity
    private String providerName; // For quick access

    // Applicant Information
    private String applicantId; // Reference to User/JobSeeker entity
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String applicantType; // JOB_SEEKER, EMPLOYER, etc.

    // Application Details
    private String status; // PENDING, ACCEPTED, REJECTED, WITHDRAWN
    private LocalDateTime appliedAt;
    private LocalDateTime statusUpdatedAt;
    private String statusNotes; // Notes from provider about the application

    // Additional Information
    private String coverLetter; // Optional cover letter
    private String additionalNotes; // Any additional information from applicant
    private String resumeDocumentId; // Reference to uploaded resume
    private String otherDocuments; // Additional documents if any

    // Communication
    private String providerNotes; // Internal notes for provider
    private Boolean isContacted; // Whether provider has contacted the applicant
    private LocalDateTime contactedAt;
    private String contactMethod; // Email, Phone, etc.
    private String contactNotes; // Notes about the contact
}
