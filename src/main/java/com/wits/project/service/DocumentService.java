package com.wits.project.service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.wits.project.model.ProgramDocument;
import com.wits.project.model.enums.Enums.DocumentStatus;
import com.wits.project.model.enums.Enums.ProgramType;
import com.wits.project.repository.ProgramDocumentRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class DocumentService {

    @Autowired
    private ProgramDocumentRepository programDocumentRepository;
    
    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Upload and create a document record
     * @param file The file to upload
     * @param userId The user ID
     * @param programType The type of document (RESUME, COVER_LETTER, etc.)
     * @param description Description of the document
     * @return The created ProgramDocument
     */
    public ProgramDocument uploadDocument(MultipartFile file, String userId, ProgramType programType, String description) {
        try {
            log.info("Uploading document for user: {}, type: {}, description: {}", userId, programType, description);
            
            // Store the file in filesystem
            String filePath = fileStorageService.storeFile(file, userId, programType.toString().toLowerCase());
            log.info("File stored at: {}", filePath);
            
            // Create ProgramDocument record
            ProgramDocument document = new ProgramDocument();
            document.setUserId(userId);
            document.setProgramType(programType);
            document.setDescription(description);
            document.setFileId(filePath);
            document.setFileSizeBytes(file.getSize());
            document.setFileContentType(file.getContentType());
            document.setStatus(DocumentStatus.SUBMITTED);
            
            // Save the document
            ProgramDocument savedDocument = programDocumentRepository.save(document);
            log.info("Document saved with ID: {}", savedDocument.getId());
            
            return savedDocument;
            
        } catch (IOException e) {
            log.error("Error uploading document: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload document", e);
        }
    }

    /**
     * Get document by ID
     * @param documentId The document ID
     * @return Optional containing the document if found
     */
    public Optional<ProgramDocument> getDocumentById(String documentId) {
        return programDocumentRepository.findById(documentId);
    }

    /**
     * Get documents by user ID and program type
     * @param userId The user ID
     * @param programType The program type
     * @return List of documents
     */
    public java.util.List<ProgramDocument> getDocumentsByUserAndType(String userId, ProgramType programType) {
        return programDocumentRepository.findByUserIdAndProgramType(userId, programType);
    }

    /**
     * Get the latest document by user ID and program type
     * @param userId The user ID
     * @param programType The program type
     * @return Optional containing the latest document if found
     */
    public Optional<ProgramDocument> getLatestDocumentByUserAndType(String userId, ProgramType programType) {
        return programDocumentRepository.findTopByUserIdAndProgramTypeOrderByCreatedAtDesc(userId, programType);
    }

    /**
     * Delete a document
     * @param documentId The document ID
     * @return true if deleted successfully
     */
    public boolean deleteDocument(String documentId) {
        try {
            Optional<ProgramDocument> documentOpt = programDocumentRepository.findById(documentId);
            if (documentOpt.isPresent()) {
                ProgramDocument document = documentOpt.get();
                
                // Delete the file from filesystem
                fileStorageService.deleteFile(document.getFileId());
                
                // Delete the document record
                programDocumentRepository.deleteById(documentId);
                
                log.info("Document deleted: {}", documentId);
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Error deleting document: {}", e.getMessage(), e);
            return false;
        }
    }
}