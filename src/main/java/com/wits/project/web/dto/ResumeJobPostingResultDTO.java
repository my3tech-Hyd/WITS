package com.wits.project.web.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ResumeJobPostingResultDTO {
    private Double match_pct;
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