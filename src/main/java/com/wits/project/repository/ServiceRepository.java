package com.wits.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.wits.project.model.ProviderService;

@Repository
public interface ServiceRepository extends MongoRepository<ProviderService, String> {

    List<ProviderService> findByProviderId(String providerId);
    
    List<ProviderService> findByProviderIdAndStatus(String providerId, String status);
    
    List<ProviderService> findByCategory(String category);
    
    List<ProviderService> findByMode(String mode);
    
    List<ProviderService> findByStatus(String status);
    
    List<ProviderService> findByIsPublished(Boolean isPublished);
    
    @Query("{'title': {$regex: ?0, $options: 'i'}}")
    List<ProviderService> findByTitleContainingIgnoreCase(String title);
    
    @Query("{'description': {$regex: ?0, $options: 'i'}}")
    List<ProviderService> findByDescriptionContainingIgnoreCase(String description);
    
    @Query("{'tags': {$in: ?0}}")
    List<ProviderService> findByTagsIn(List<String> tags);
    
    @Query("{'fees': {$lte: ?0}}")
    List<ProviderService> findByFeesLessThanEqual(Double maxFees);
    
    @Query("{'fees': {$gte: ?0, $lte: ?1}}")
    List<ProviderService> findByFeesBetween(Double minFees, Double maxFees);
    
    List<ProviderService> findByStatusAndIsPublished(String status, Boolean isPublished);
}
