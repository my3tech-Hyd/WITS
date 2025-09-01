package com.wits.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wits.project.model.ProgramDocument;
import com.wits.project.model.enums.Enums.ProgramType;

public interface ProgramDocumentRepository extends MongoRepository<ProgramDocument, String> {
    List<ProgramDocument> findByUserId(String userId);
    List<ProgramDocument> findByUserIdAndProgramType(String userId, ProgramType programType);
    Optional<ProgramDocument> findTopByUserIdAndProgramTypeOrderByCreatedAtDesc(String userId, ProgramType programType);
}
 