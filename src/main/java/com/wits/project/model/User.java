package com.wits.project.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wits.project.model.enums.Enums.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "users")
@CompoundIndexes({
    @CompoundIndex(name = "idx_users_username_email", def = "{username: 1, email: 1}", unique = true)
})
public class User extends BaseDocument {

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String address;

    private String passwordHash;
    private String securityQuestion;
    private String securityAnswerHash;

    private Set<UserRole> roles;

    private String education; // Educational background as text
    private List<String> skills;
    private String workHistory; // could be JSON text or structured elsewhere
    private List<String> certifications;

    private Boolean veteran;
    private Boolean spouse;
    private Boolean resourceReferralOptIn;

    private Double profileCompletionPercent;

    private String resumeDocumentId;
    private String coverLetterDocumentId;
}


