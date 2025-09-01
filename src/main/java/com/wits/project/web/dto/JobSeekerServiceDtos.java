package com.wits.project.web.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class JobSeekerServiceDtos {

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
        private List<String> tags;
        private String prerequisites;
        private String learningOutcomes;
        private String instructorName;
        private String contactEmail;
        private String contactPhone;
        
        // Application status for current user
        private String myApplicationStatus;
        private Boolean hasApplied;
    }

    @Getter
    @Setter
    public static class ServiceApplicationRequest {
        private String status; // "JOIN" or "NOT_INTERESTED"
        private String coverLetter;
        private String additionalNotes;
        private String resumeDocumentId;
        private String otherDocuments;
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
}
