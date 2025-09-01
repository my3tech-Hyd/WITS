package com.wits.project.web.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PostingToResumeDTO {
    private String message;
    private List<JobPostingToResumeResultDTO> results;
}
