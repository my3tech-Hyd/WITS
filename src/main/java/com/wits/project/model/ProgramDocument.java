package com.wits.project.model;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wits.project.model.enums.Enums.DocumentStatus;
import com.wits.project.model.enums.Enums.ProgramType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "program_documents")
@CompoundIndex(name = "idx_doc_dupe_guard", def = "{userId: 1, programType: 1, description: 1}")
public class ProgramDocument extends BaseDocument {
    @Indexed
    private String userId;

    private ProgramType programType;
    private String description;
    private String fileId; // reference to file store (e.g., GridFS or external)
    private Long fileSizeBytes;
    private String fileContentType;
    private DocumentStatus status = DocumentStatus.SUBMITTED;
    private String reviewerNotes;
}


