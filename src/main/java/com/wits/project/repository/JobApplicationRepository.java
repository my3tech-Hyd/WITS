package com.wits.project.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wits.project.model.JobApplication;

public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    List<JobApplication> findByUserId(String userId);
    List<JobApplication> findByJobPostingId(String jobPostingId);
    List<JobApplication> findByJobPostingIdIn(List<String> jobPostingIds);
}


