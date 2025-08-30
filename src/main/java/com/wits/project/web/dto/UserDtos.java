package com.wits.project.web.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.wits.project.model.enums.Enums.UserRole;

import lombok.Getter;
import lombok.Setter;

public class UserDtos {
    @Getter
    @Setter
    public static class RegisterRequest {
        public String firstName;
        public String lastName;
        public LocalDate dateOfBirth;
        public String email;
        public String phoneNumber;
        public String address;
        public String username;
        public String password;
        public String securityQuestion;
        public String securityAnswer;
        public UserRole role; // single role selection
    }

    @Getter
    @Setter
    public static class ProfileUpdateRequest {
        public String userId;
        public String firstName;
        public String lastName;
        public LocalDate dateOfBirth;
        public String email;
        public String phoneNumber;
        public String address;
        public String education;
        public String workHistory;
        public List<String> skills;
        public List<String> certifications;
        public Boolean veteranStatus;
        public Boolean spouseStatus;
        public Boolean resourceReferralOptIn;
    }

    @Getter
    @Setter
    public static class UserResponse {
        public String userId;
        public String username;
        public String email;
        public Set<UserRole> roles;
    }
}


