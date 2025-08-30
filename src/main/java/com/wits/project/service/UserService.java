package com.wits.project.service;

import java.util.Set;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wits.project.model.User;
import com.wits.project.model.enums.Enums.UserRole;
import com.wits.project.repository.UserRepository;
import com.wits.project.web.dto.UserDtos.RegisterRequest;
import com.wits.project.web.dto.UserDtos.UserResponse;
import com.wits.project.web.dto.UserDtos.ProfileUpdateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse register(RegisterRequest req) {
        userRepository.findByUsername(req.username).ifPresent(u -> {
            throw new IllegalArgumentException("Username already exists");
        });
        userRepository.findByEmail(req.email).ifPresent(u -> {
            throw new IllegalArgumentException("Email already exists");
        });

        User u = new User();
        u.setFirstName(req.firstName);
        u.setLastName(req.lastName);
        u.setDateOfBirth(req.dateOfBirth);
        u.setEmail(req.email);
        u.setPhoneNumber(req.phoneNumber);
        u.setAddress(req.address);
        u.setUsername(req.username);
        u.setPasswordHash(passwordEncoder.encode(req.password));
        u.setSecurityQuestion(req.securityQuestion);
        u.setSecurityAnswerHash(passwordEncoder.encode(req.securityAnswer));
        UserRole role = req.role == null ? UserRole.JOB_SEEKER : req.role;
        u.setRoles(Set.of(role));
        u.setProfileCompletionPercent(0.0); // Basic registration starts with 0%

        User saved = userRepository.save(u);
        UserResponse res = new UserResponse();
        res.userId = saved.getId();
        res.username = saved.getUsername();
        res.email = saved.getEmail();
        res.roles = saved.getRoles();
        return res;
    }

    private double calculateProfileCompletion(User user) {
        int totalFields = 10; // Basic required fields
        int completedFields = 0;
        
        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) completedFields++;
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) completedFields++;
        if (user.getDateOfBirth() != null) completedFields++;
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) completedFields++;
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) completedFields++;
        if (user.getAddress() != null && !user.getAddress().trim().isEmpty()) completedFields++;
        if (user.getEducation() != null && !user.getEducation().trim().isEmpty()) completedFields++;
        if (user.getSkills() != null && !user.getSkills().isEmpty()) completedFields++;
        if (user.getWorkHistory() != null && !user.getWorkHistory().trim().isEmpty()) completedFields++;
        if (user.getResumeDocumentId() != null && !user.getResumeDocumentId().trim().isEmpty()) completedFields++;
        
        return (double) completedFields / totalFields * 100;
    }

    @Transactional
    public User updateProfile(ProfileUpdateRequest req) {
        User u = userRepository.findById(req.userId).orElseThrow();
        
        // Update basic information
        if (req.firstName != null) u.setFirstName(req.firstName);
        if (req.lastName != null) u.setLastName(req.lastName);
        if (req.dateOfBirth != null) u.setDateOfBirth(req.dateOfBirth);
        if (req.email != null) u.setEmail(req.email);
        if (req.phoneNumber != null) u.setPhoneNumber(req.phoneNumber);
        if (req.address != null) u.setAddress(req.address);
        
        // Update professional information
        if (req.education != null) u.setEducation(req.education);
        if (req.workHistory != null) u.setWorkHistory(req.workHistory);
        if (req.skills != null) u.setSkills(req.skills);
        if (req.certifications != null) u.setCertifications(req.certifications);
        
        // Update status information
        if (req.veteranStatus != null) u.setVeteran(req.veteranStatus);
        if (req.spouseStatus != null) u.setSpouse(req.spouseStatus);
        if (req.resourceReferralOptIn != null) u.setResourceReferralOptIn(req.resourceReferralOptIn);
        
        // Calculate and update profile completion percentage
        double completionPercent = calculateProfileCompletion(u);
        u.setProfileCompletionPercent(completionPercent);
        
        return userRepository.save(u);
    }

    public java.util.Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public java.util.List<User> findAllByIds(java.util.List<String> ids) {
        return userRepository.findAllById(ids);
    }

    public java.util.List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public void updateResumeDocumentId(String userId, String documentId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setResumeDocumentId(documentId);
        userRepository.save(user);
    }

    @Transactional
    public void updateCoverLetterDocumentId(String userId, String documentId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setCoverLetterDocumentId(documentId);
        userRepository.save(user);
    }
}


