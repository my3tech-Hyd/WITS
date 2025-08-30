package com.wits.project.model;

import java.time.Instant;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wits.project.model.enums.Enums.AppointmentType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "appointments")
@CompoundIndex(name = "idx_user_slot_unique", def = "{userId: 1, slotStart: 1}", unique = true)
public class Appointment extends BaseDocument {
    @Indexed
    private String userId;

    private AppointmentType type;
    private Instant slotStart;
    private Instant slotEnd;
    private String notes;
    private Boolean confirmed = Boolean.FALSE;
}


