package com.wits.project.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wits.project.model.ProgramDocument;
import com.wits.project.model.User;
import com.wits.project.model.enums.Enums.DocumentStatus;
import com.wits.project.model.enums.Enums.ProgramType;
import com.wits.project.repository.ProgramDocumentRepository;
import com.wits.project.service.UserService;
import com.wits.project.web.dto.UserDtos.RegisterRequest;
import com.wits.project.web.dto.UserDtos.ProfileUpdateRequest;
import com.wits.project.web.dto.UserDtos.UserResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ProgramDocumentRepository documentRepository;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(userService.register(req));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('JOB_SEEKER','STAFF','EMPLOYER','PROVIDER')")
    public ResponseEntity<?> updateProfile(
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "dateOfBirth", required = false) String dateOfBirth,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "education", required = false) String education,
            @RequestParam(value = "workHistory", required = false) String workHistory,
            @RequestParam(value = "skills", required = false) String skills,
            @RequestParam(value = "certifications", required = false) String certifications,
            @RequestParam(value = "veteranStatus", required = false) Boolean veteranStatus,
            @RequestParam(value = "spouseStatus", required = false) Boolean spouseStatus,
            @RequestParam(value = "resourceReferralOptIn", required = false) Boolean resourceReferralOptIn,
            @RequestParam(value = "resume", required = false) MultipartFile resume,
            @RequestParam(value = "coverLetter", required = false) MultipartFile coverLetter) throws IOException {
        
        // Get current user ID from security context
        String currentUserId = com.wits.project.security.SecurityUtil.getCurrentUserId();
        System.out.println("Profile update request for user: " + currentUserId);
        System.out.println("Received data - firstName: " + firstName + ", lastName: " + lastName + ", email: " + email);
        
        // Create ProfileUpdateRequest object
        ProfileUpdateRequest req = new ProfileUpdateRequest();
        req.setUserId(currentUserId);
        req.setFirstName(firstName);
        req.setLastName(lastName);
        if (dateOfBirth != null && !dateOfBirth.isEmpty()) {
            req.setDateOfBirth(java.time.LocalDate.parse(dateOfBirth));
        }
        req.setEmail(email);
        req.setPhoneNumber(phoneNumber);
        req.setAddress(address);
        req.setEducation(education); // Handle as string
        req.setWorkHistory(workHistory);
        req.setVeteranStatus(veteranStatus);
        req.setSpouseStatus(spouseStatus);
        req.setResourceReferralOptIn(resourceReferralOptIn);
        
        // Parse JSON arrays for skills and certifications
        ObjectMapper objectMapper = new ObjectMapper();
        if (skills != null && !skills.isEmpty()) {
            try {
                req.setSkills(objectMapper.readValue(skills, List.class));
            } catch (Exception e) {
                req.setSkills(new ArrayList<>());
            }
        }
        if (certifications != null && !certifications.isEmpty()) {
            try {
                req.setCertifications(objectMapper.readValue(certifications, List.class));
            } catch (Exception e) {
                req.setCertifications(new ArrayList<>());
            }
        }
        
        // Update profile
        User updatedUser = userService.updateProfile(req);
        System.out.println("Profile updated successfully for user: " + updatedUser.getId());
        
        // Handle file uploads
        if (resume != null && !resume.isEmpty()) {
            System.out.println("Processing resume upload: " + resume.getOriginalFilename());
            ProgramDocument resumeDoc = new ProgramDocument();
            resumeDoc.setUserId(updatedUser.getId());
            resumeDoc.setProgramType(ProgramType.OTHER);
            resumeDoc.setDescription("Resume");
            resumeDoc.setFileId(resume.getOriginalFilename());
            resumeDoc.setFileSizeBytes(resume.getSize());
            resumeDoc.setFileContentType(resume.getContentType());
            resumeDoc.setStatus(DocumentStatus.SUBMITTED);
            ProgramDocument savedResume = documentRepository.save(resumeDoc);
            
            // Update user with resume document ID
            userService.updateResumeDocumentId(updatedUser.getId(), savedResume.getId());
            System.out.println("Resume document saved with ID: " + savedResume.getId());
        }
        
        if (coverLetter != null && !coverLetter.isEmpty()) {
            System.out.println("Processing cover letter upload: " + coverLetter.getOriginalFilename());
            ProgramDocument coverLetterDoc = new ProgramDocument();
            coverLetterDoc.setUserId(updatedUser.getId());
            coverLetterDoc.setProgramType(ProgramType.OTHER);
            coverLetterDoc.setDescription("Cover Letter");
            coverLetterDoc.setFileId(coverLetter.getOriginalFilename());
            coverLetterDoc.setFileSizeBytes(coverLetter.getSize());
            coverLetterDoc.setFileContentType(coverLetter.getContentType());
            coverLetterDoc.setStatus(DocumentStatus.SUBMITTED);
            ProgramDocument savedCoverLetter = documentRepository.save(coverLetterDoc);
            
            // Update user with cover letter document ID
            userService.updateCoverLetterDocumentId(updatedUser.getId(), savedCoverLetter.getId());
            System.out.println("Cover letter document saved with ID: " + savedCoverLetter.getId());
        }
        
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('JOB_SEEKER','EMPLOYER','STAFF','PROVIDER')")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.of(userService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('JOB_SEEKER','EMPLOYER','STAFF','PROVIDER')")
    public ResponseEntity<List<Map<String, String>>> getByIds(@RequestParam(required = false) String ids) {
        if (ids == null || ids.isBlank()) return ResponseEntity.ok(new ArrayList<>());
        List<String> idList = List.of(ids.split(","));
        return ResponseEntity.ok(
            userService.findAllByIds(idList).stream().map(u -> Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "email", u.getEmail(),
                "firstName", u.getFirstName(),
                "lastName", u.getLastName()
            )).collect(Collectors.toList())
        );
    }
}


