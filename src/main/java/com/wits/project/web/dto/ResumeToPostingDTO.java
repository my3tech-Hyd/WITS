package com.wits.project.web.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ResumeToPostingDTO {
    private String message;
    private List<ResumeJobPostingResultDTO> results;
}
