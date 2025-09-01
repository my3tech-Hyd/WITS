package com.wits.project.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "services")
public class ProviderService extends BaseDocument {

    private String providerId; // Reference to Provider entity
    private String providerName; // For quick access

    // Service/Course Information
    private String title;
    private String category; // IT, Finance, Management, Technical, etc.
    private String description; // Rich text content
    private String duration; // e.g., 6 weeks, 3 months
    private String mode; // Online, Offline, Hybrid
    private String location; // if offline
    private Double fees; // if applicable
    private String eligibility; // Requirements
    private LocalDate lastDateToApply;
    private String bannerUrl; // Banner/Flyer URL

    // Status and visibility
    private String status; // ACTIVE, INACTIVE, DRAFT
    private Boolean isPublished;
    private LocalDateTime publishedAt;

    // Statistics
    private Integer totalApplications;
    private Integer acceptedApplications;
    private Integer rejectedApplications;
    private Integer pendingApplications;
    private Double averageRating;
    private Integer totalReviews;

    // Additional fields
    private List<String> tags;
    private String prerequisites;
    private String learningOutcomes;
    private String instructorName;
    private String contactEmail;
    private String contactPhone;
}
