package com.wits.project.model;

import java.time.Instant;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wits.project.model.enums.Enums.NotificationType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "notifications")
public class Notification extends BaseDocument {
    @Indexed
    private String userId;

    private NotificationType type;
    private String message;
    private Instant eventTime;
    @Indexed
    private Boolean read = Boolean.FALSE;
    private String actionLink;
}


