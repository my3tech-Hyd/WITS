package com.wits.project.model;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wits.project.model.enums.Enums.CaseStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "cases")
public class CaseRecord extends BaseDocument {
    @Indexed
    private String participantUserId;

    private CaseStatus status = CaseStatus.OPEN;
    private String eligibilityDetermination;
    private List<String> serviceCodes; // standardized codes
    private List<String> voucherIds;
    private Instant openedAt;
    private Instant closedAt;
    private String assignedStaffUserId;
}


