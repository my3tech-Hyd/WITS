package com.wits.project.model;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "interviews")
public class Interview extends BaseDocument {
    
    private String applicationId;
    private String jobPostingId;
    private String employerId;
    private String applicantId;
    
    private LocalDateTime scheduledDateTime;
    private String location; // Can be physical address or virtual meeting link
    private String interviewType; // IN_PERSON, VIDEO_CALL, PHONE
    private String notes;
    private String status; // SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
}
