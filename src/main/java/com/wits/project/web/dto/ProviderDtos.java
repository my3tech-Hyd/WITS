package com.wits.project.web.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class ProviderDtos {

    @Getter
    @Setter
    public static class ProfileUpdateRequest {
        // Basic Information
        private String providerName;
        private String contactPersonName;
        private String email;
        private String phoneNumber;
        private String website;
        private String logoUrl;
        
        // Organization Details
        private String organizationType;
        private String address;
        private String city;
        private String state;
        private String country;
        private String zipCode;
        private String about;
        private List<String> servicesOffered;
        
        // Documents
        private List<String> certificationDocumentIds;
        private List<String> accreditationDocumentIds;
        
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
        
        // Basic Information
        private String providerName;
        private String contactPersonName;
        private String email;
        private String phoneNumber;
        private String website;
        private String logoUrl;
        
        // Organization Details
        private String organizationType;
        private String address;
        private String city;
        private String state;
        private String country;
        private String zipCode;
        private String about;
        private List<String> servicesOffered;
        
        // Documents
        private List<String> certificationDocumentIds;
        private List<String> accreditationDocumentIds;
        
        // Profile completion
        private Double profileCompletionPercent;
        
        // Additional fields
        private Boolean isVerified;
        private String verificationStatus;
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

    @Getter
    @Setter
    public static class ServiceCreateRequest {
        private String title;
        private String category;
        private String description;
        private String duration;
        private String mode;
        private String location;
        private Double fees;
        private String eligibility;
        private LocalDate lastDateToApply;
        private String bannerUrl;
        private List<String> tags;
        private String prerequisites;
        private String learningOutcomes;
        private String instructorName;
        private String contactEmail;
        private String contactPhone;
    }

    @Getter
    @Setter
    public static class ServiceUpdateRequest {
        private String id;
        private String title;
        private String category;
        private String description;
        private String duration;
        private String mode;
        private String location;
        private Double fees;
        private String eligibility;
        private LocalDate lastDateToApply;
        private String bannerUrl;
        private String status;
        private Boolean isPublished;
        private List<String> tags;
        private String prerequisites;
        private String learningOutcomes;
        private String instructorName;
        private String contactEmail;
        private String contactPhone;
    }

    @Getter
    @Setter
    public static class ServiceResponse {
        private String id;
        private String providerId;
        private String providerName;
        private String title;
        private String category;
        private String description;
        private String duration;
        private String mode;
        private String location;
        private Double fees;
        private String eligibility;
        private LocalDate lastDateToApply;
        private String bannerUrl;
        private String status;
        private Boolean isPublished;
        private LocalDateTime publishedAt;
        private Instant createdAt;
        private Instant updatedAt;
        private Integer totalApplications;
        private Integer acceptedApplications;
        private Integer rejectedApplications;
        private Integer pendingApplications;
        private Double averageRating;
        private Integer totalReviews;
        private List<String> tags;
        private String prerequisites;
        private String learningOutcomes;
        private String instructorName;
        private String contactEmail;
        private String contactPhone;
    }

    @Getter
    @Setter
    public static class ServiceApplicationResponse {
        private String id;
        private String serviceId;
        private String serviceTitle;
        private String providerId;
        private String providerName;
        private String applicantId;
        private String applicantName;
        private String applicantEmail;
        private String applicantPhone;
        private String applicantType;
        private String status;
        private LocalDateTime appliedAt;
        private LocalDateTime statusUpdatedAt;
        private String statusNotes;
        private String coverLetter;
        private String additionalNotes;
        private String resumeDocumentId;
        private String otherDocuments;
        private String providerNotes;
        private Boolean isContacted;
        private LocalDateTime contactedAt;
        private String contactMethod;
        private String contactNotes;
    }

    @Getter
    @Setter
    public static class ApplicationStatusUpdateRequest {
        private String status;
        private String statusNotes;
        private Boolean isContacted;
        private String contactMethod;
        private String contactNotes;
    }

    @Getter
    @Setter
    public static class MessageRequest {
        private String receiverId;
        private String subject;
        private String content;
        private String serviceId;
        private String applicationId;
        private String attachmentUrl;
        private String attachmentName;
        private String attachmentType;
    }

    @Getter
    @Setter
    public static class MessageResponse {
        private String id;
        private String senderId;
        private String senderName;
        private String senderType;
        private String receiverId;
        private String receiverName;
        private String receiverType;
        private String subject;
        private String content;
        private String messageType;
        private Boolean isRead;
        private LocalDateTime readAt;
        private String serviceId;
        private String serviceTitle;
        private String applicationId;
        private LocalDateTime sentAt;
        private String attachmentUrl;
        private String attachmentName;
        private String attachmentType;
    }

    @Getter
    @Setter
    public static class DashboardStats {
        private Double profileCompletionPercent;
        private Integer totalServicesPosted;
        private Integer totalApplicationsReceived;
        private Double averageRating;
        private Integer totalReviews;
        private Integer pendingApplications;
        private Integer unreadMessages;
        private Integer activeServices;
        private Integer draftServices;
    }

    @Getter
    @Setter
    public static class ProviderSearchRequest {
        private String providerName;
        private String organizationType;
        private String location;
        private List<String> servicesOffered;
        private Boolean isVerified;
        private String verificationStatus;
    }
}
