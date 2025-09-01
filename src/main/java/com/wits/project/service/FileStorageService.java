package com.wits.project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.path:uploads}")
    private String uploadPath;

    @Value("${file.upload.max-size:10485760}") // 10MB default
    private long maxFileSize;

    /**
     * Store a file in the filesystem
     * @param file The file to store
     * @param userId The user ID
     * @param fileType The type of file (resume, cover-letter, etc.)
     * @return The stored file path
     * @throws IOException if file operations fail
     */
    public String storeFile(MultipartFile file, String userId, String fileType) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }

        // Create directory structure: uploads/users/{userId}/{fileType}/
        String userDir = String.format("users/%s/%s", userId, fileType);
        Path uploadDir = Paths.get(uploadPath, userDir);
        
        // Create directories if they don't exist
        Files.createDirectories(uploadDir);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String filename = String.format("%s_%s%s", timestamp, uniqueId, fileExtension);

        // Store the file
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return the relative path for database storage
        return userDir + "/" + filename;
    }

    /**
     * Get the full path of a stored file
     * @param relativePath The relative path stored in the database
     * @return The full file path
     */
    public Path getFilePath(String relativePath) {
        return Paths.get(uploadPath, relativePath);
    }

    /**
     * Check if a file exists
     * @param relativePath The relative path stored in the database
     * @return true if file exists, false otherwise
     */
    public boolean fileExists(String relativePath) {
        Path filePath = getFilePath(relativePath);
        return Files.exists(filePath);
    }

    /**
     * Delete a file
     * @param relativePath The relative path stored in the database
     * @return true if file was deleted, false if file didn't exist
     * @throws IOException if deletion fails
     */
    public boolean deleteFile(String relativePath) throws IOException {
        Path filePath = getFilePath(relativePath);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            return true;
        }
        return false;
    }

    /**
     * Get file size
     * @param relativePath The relative path stored in the database
     * @return File size in bytes
     * @throws IOException if file operations fail
     */
    public long getFileSize(String relativePath) throws IOException {
        Path filePath = getFilePath(relativePath);
        return Files.size(filePath);
    }
}