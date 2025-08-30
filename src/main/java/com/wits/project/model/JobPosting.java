package com.wits.project.model;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wits.project.model.enums.Enums.JobType;
import com.wits.project.model.enums.Enums.JobStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "job_postings")
public class JobPosting extends BaseDocument {
    @Indexed
    private String employerId; // references User or Employer profile

    @Indexed
    private String title;

    private String companyName;
    private String description;
    private String location;
    private JobType jobType;
    private JobStatus status = JobStatus.ACTIVE; // Default to ACTIVE
    private Double minSalary;
    private Double maxSalary;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private Instant postedDate;
    @Indexed
    private Boolean anonymousPosting = Boolean.FALSE;
}


