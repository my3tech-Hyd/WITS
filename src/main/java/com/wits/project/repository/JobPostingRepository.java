package com.wits.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.wits.project.model.JobPosting;

public interface JobPostingRepository extends MongoRepository<JobPosting, String> {
    List<JobPosting> findByTitleContainingIgnoreCase(String title);
    List<JobPosting> findByEmployerId(String employerId);
    
    // Find by ObjectId string
    @Query("{ '_id': ?0 }")
    Optional<JobPosting> findByObjectId(String objectId);
}


