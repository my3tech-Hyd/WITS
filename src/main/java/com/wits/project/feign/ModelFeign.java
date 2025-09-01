package com.wits.project.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.wits.project.web.dto.PostingToResumeDTO;
import com.wits.project.web.dto.ResumeToPostingDTO;

@FeignClient(name= "aiModel", url = "http://localhost:8000")
public interface ModelFeign {

    @PostMapping(value = "/api/ptr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<PostingToResumeDTO> postToResume(@RequestPart("file") MultipartFile file);

    @PostMapping(value = "/api/rtp", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ResumeToPostingDTO> resumeToJobPosting(@RequestPart("file") MultipartFile file);
}
