package com.wits.project.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResumeJobPostingResultDTO {
    private Double matchPct;
    private String title;
    private String company;
    private String location;
    private String url;
    private String jobId;
    private Double sem;
    private Double kw;
    private Double fused;
    private String preview;
}