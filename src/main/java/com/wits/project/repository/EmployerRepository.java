package com.wits.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.wits.project.model.Employer;

public interface EmployerRepository extends MongoRepository<Employer, String> {
    
    Optional<Employer> findByUserId(String userId);
    
    List<Employer> findByCompanyNameContainingIgnoreCase(String companyName);
    
    List<Employer> findByIndustry(String industry);
    
    List<Employer> findByIsVerified(Boolean isVerified);
    
    @Query("{ 'companyName': { $regex: ?0, $options: 'i' } }")
    List<Employer> findByCompanyNameRegex(String companyName);
    
    @Query("{ 'industry': { $regex: ?0, $options: 'i' } }")
    List<Employer> findByIndustryRegex(String industry);
    
    List<Employer> findByVerificationStatus(String verificationStatus);
}

 