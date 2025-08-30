package com.wits.project.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wits.project.model.ProgramDocument;

public interface ProgramDocumentRepository extends MongoRepository<ProgramDocument, String> {
    List<ProgramDocument> findByUserId(String userId);
}


