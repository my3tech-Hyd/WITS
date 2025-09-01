package com.wits.project.model;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "messages")
public class Message extends BaseDocument {

    private String senderId; // Reference to User entity (Provider or Applicant)
    private String senderName;
    private String senderType; // PROVIDER, JOB_SEEKER, EMPLOYER

    private String receiverId; // Reference to User entity
    private String receiverName;
    private String receiverType; // PROVIDER, JOB_SEEKER, EMPLOYER

    // Message Content
    private String subject;
    private String content;
    private String messageType; // TEXT, SYSTEM, NOTIFICATION
    private Boolean isRead;
    private LocalDateTime readAt;

    // Context
    private String serviceId; // Reference to Service entity (if related to a service)
    private String serviceTitle; // For quick access
    private String applicationId; // Reference to ServiceApplication entity (if related to an application)

    // Timestamps
    private LocalDateTime sentAt;

    // Additional fields
    private String attachmentUrl; // If message has attachment
    private String attachmentName;
    private String attachmentType;
    private Boolean isDeleted; // Soft delete
    private LocalDateTime deletedAt;
}
