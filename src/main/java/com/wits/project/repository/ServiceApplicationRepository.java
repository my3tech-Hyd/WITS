package com.wits.project.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.wits.project.model.ServiceApplication;

@Repository
public interface ServiceApplicationRepository extends MongoRepository<ServiceApplication, String> {

    List<ServiceApplication> findByServiceId(String serviceId);
    
    List<ServiceApplication> findByProviderId(String providerId);
    
    List<ServiceApplication> findByApplicantId(String applicantId);
    
    List<ServiceApplication> findByServiceIdAndStatus(String serviceId, String status);
    
    List<ServiceApplication> findByProviderIdAndStatus(String providerId, String status);
    
    List<ServiceApplication> findByApplicantIdAndStatus(String applicantId, String status);
    
    Optional<ServiceApplication> findByServiceIdAndApplicantId(String serviceId, String applicantId);
    
    @Query("{'appliedAt': {$gte: ?0, $lte: ?1}}")
    List<ServiceApplication> findByAppliedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'statusUpdatedAt': {$gte: ?0, $lte: ?1}}")
    List<ServiceApplication> findByStatusUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'applicantType': ?0}")
    List<ServiceApplication> findByApplicantType(String applicantType);
    
    @Query("{'isContacted': ?0}")
    List<ServiceApplication> findByIsContacted(Boolean isContacted);
}
