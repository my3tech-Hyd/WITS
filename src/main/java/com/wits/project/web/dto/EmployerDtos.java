package com.wits.project.web.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class EmployerDtos {

    @Getter
    @Setter
    public static class ProfileUpdateRequest {
        // Personal Information
        private String fullName;
        private String email;
        private String phone;
        private String jobPosition;
        private String profilePicture;
        
        // Company Information
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
        
        // Additional fields
        private String department;
        private String linkedInProfile;
        private String companyLogo;
        
        // Notification preferences
        private Boolean emailNotifications;
        private Boolean smsNotifications;
        private Boolean applicationAlerts;
        private Boolean weeklyReports;
        
        // Privacy settings
        private Boolean showContactInformation;
    }

    @Getter
    @Setter
    public static class ProfileResponse {
        private String id;
        private String userId;
        
        // Personal Information
        private String fullName;
        private String email;
        private String phone;
        private String jobPosition;
        private String profilePicture;
        
        // Company Information
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
        
        // Additional fields
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
        private String verificationStatus;
        private String verificationNotes;
    }

    @Getter
    @Setter
    public static class EmployerSearchRequest {
        private String companyName;
        private String industry;
        private String location;
        private Boolean isVerified;
        private String verificationStatus;
    }
}