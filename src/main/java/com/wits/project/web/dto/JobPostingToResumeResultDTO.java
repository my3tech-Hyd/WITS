package com.wits.project.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobPostingToResumeResultDTO {
    private Double matchPct; 
    private String candidateName;
    private String email;
    private String phone;
    private String resumeId;
    private Double sim;
    private String preview;
}
