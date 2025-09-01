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
@Document(collection = "employers")
public class Employer extends BaseDocument {

    private String userId; // Reference to User entity

    // Personal Information (from My Profile)
    private String fullName;
    private String email;
    private String phone;
    private String jobPosition;
    private String profilePicture;

    // Company Information (from My Company)
    private String companyName;
    private String industry;
    private String companySize;
    private String website;
    private String description;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String companyPhone;
    private String contactEmail;
    private String benefits;
    private String culture;

    // Additional fields for employer specific data
    private String department;
    private String linkedInProfile;
    private String companyLogo;
    private Boolean isVerified;
    private Double profileCompletionPercent;
    
    // Notification preferences
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean applicationAlerts;
    private Boolean weeklyReports;
    
    // Privacy settings
    private Boolean showContactInformation;
    
    // Company verification
    private String verificationDocumentId;
    private String verificationStatus; // PENDING, APPROVED, REJECTED
    private String verificationNotes;
}

 
 