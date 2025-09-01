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
@Document(collection = "providers")
public class Provider extends BaseDocument {

    private String userId; // Reference to User entity

    // Basic Information
    private String providerName; // Organization Name
    private String contactPersonName;
    private String email;
    private String phoneNumber;
    private String website;
    private String logoUrl; // Profile Picture/Logo URL

    // Organization Details
    private String organizationType; // Training Institute, Consultancy, Service Provider, etc.
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private String about; // Description
    private List<String> servicesOffered; // IT Training, HR Consulting, Internship Programs, etc.

    // Documents
    private List<String> certificationDocumentIds; // PDF/Images
    private List<String> accreditationDocumentIds; // License documents

    // Profile completion
    private Double profileCompletionPercent;

    // Additional fields for provider specific data
    private Boolean isVerified;
    private String verificationStatus; // PENDING, APPROVED, REJECTED
    private String verificationNotes;
    
    // Notification preferences
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean applicationAlerts;
    private Boolean weeklyReports;
    
    // Privacy settings
    private Boolean showContactInformation;
    
    // Statistics
    private Integer totalServicesPosted;
    private Integer totalApplicationsReceived;
    private Double averageRating;
    private Integer totalReviews;
}
