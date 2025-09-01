package com.wits.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.wits.project.model.JobSeeker;

public interface JobSeekerRepository extends MongoRepository<JobSeeker, String> {
    
    // Find job seeker by user ID
    Optional<JobSeeker> findByUserId(String userId);
    
    // Find job seekers by skills (for job matching)
    @Query("{ 'skills': { $in: ?0 } }")
    List<JobSeeker> findBySkillsIn(List<String> skills);
    
    // Find job seekers by location
    List<JobSeeker> findByPreferredLocationContainingIgnoreCase(String location);
    
    // Find job seekers by job type preference
    List<JobSeeker> findByPreferredJobType(String jobType);
    
    // Find job seekers who are veterans
    List<JobSeeker> findByVeteranTrue();
    
    // Find job seekers who are military spouses
    List<JobSeeker> findBySpouseTrue();
    
    // Find job seekers willing to relocate
    List<JobSeeker> findByWillingToRelocateTrue();
}

 