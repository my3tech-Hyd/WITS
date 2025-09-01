package com.wits.project.model;

import java.time.Instant;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wits.project.model.enums.Enums.JobApplicationStatus;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "job_applications")
@CompoundIndexes({
    @CompoundIndex(name = "idx_app_user_job", def = "{userId: 1, jobPostingId: 1}", unique = true)
})
public class JobApplication extends BaseDocument {

    @Indexed
    private String userId; // applicant

    @Indexed
    private String jobPostingId;

    private Instant applicationDate;

    @Indexed
    private JobApplicationStatus status;

    private String notes;
    

}


