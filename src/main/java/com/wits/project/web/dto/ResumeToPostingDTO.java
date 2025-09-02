package com.wits.project.web.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ResumeToPostingDTO {
    private String message;
    private List<ResumeJobPostingResultDTO> data;
}
