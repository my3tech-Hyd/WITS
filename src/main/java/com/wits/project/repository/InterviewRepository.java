package com.wits.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wits.project.model.Interview;

public interface InterviewRepository extends MongoRepository<Interview, String> {
    List<Interview> findByApplicationId(String applicationId);
    List<Interview> findByJobPostingId(String jobPostingId);
    List<Interview> findByApplicantId(String applicantId);
    List<Interview> findByEmployerId(String employerId);
    Optional<Interview> findByApplicationIdAndStatus(String applicationId, String status);
}
