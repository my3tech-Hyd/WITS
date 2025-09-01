package com.wits.project.web;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wits.project.model.ProgramDocument;
import com.wits.project.model.enums.Enums.DocumentStatus;
import com.wits.project.model.enums.Enums.ProgramType;
import com.wits.project.repository.ProgramDocumentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final ProgramDocumentRepository docs;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('JOB_SEEKER','STAFF')")
    public ResponseEntity<?> upload(
        @RequestParam ProgramType programType,
        @RequestParam String description,
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        ProgramDocument d = new ProgramDocument();
        d.setUserId("current");
        d.setProgramType(programType);
        d.setDescription(description);
        d.setFileId(file.getOriginalFilename());
        d.setFileSizeBytes(file.getSize());
        d.setFileContentType(file.getContentType());
        d.setStatus(DocumentStatus.SUBMITTED);
        return ResponseEntity.ok(docs.save(d));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('JOB_SEEKER','STAFF')")
    public ResponseEntity<List<ProgramDocument>> list() {
        return ResponseEntity.ok(docs.findAll());
    }
}