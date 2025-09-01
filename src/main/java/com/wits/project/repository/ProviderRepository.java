package com.wits.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.wits.project.model.Provider;

@Repository
public interface ProviderRepository extends MongoRepository<Provider, String> {

    Optional<Provider> findByUserId(String userId);
    
    Optional<Provider> findByEmail(String email);
    
    List<Provider> findByOrganizationType(String organizationType);
    
    List<Provider> findByCity(String city);
    
    List<Provider> findByState(String state);
    
    List<Provider> findByIsVerified(Boolean isVerified);
    
    @Query("{'servicesOffered': {$in: ?0}}")
    List<Provider> findByServicesOfferedIn(List<String> services);
    
    @Query("{'profileCompletionPercent': {$gte: ?0}}")
    List<Provider> findByProfileCompletionPercentGreaterThanEqual(Double minCompletion);
}
