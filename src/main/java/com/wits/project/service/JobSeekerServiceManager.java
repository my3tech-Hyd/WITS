package com.wits.project.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wits.project.model.ProviderService;
import com.wits.project.model.ServiceApplication;
import com.wits.project.model.User;
import com.wits.project.repository.ServiceRepository;
import com.wits.project.repository.ServiceApplicationRepository;
import com.wits.project.repository.UserRepository;
import com.wits.project.web.dto.JobSeekerServiceDtos;

@Service
public class JobSeekerServiceManager {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceApplicationRepository serviceApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all available services with application status for current user
    public List<JobSeekerServiceDtos.ServiceResponse> getAllServices(String userId) {
        List<ProviderService> services = serviceRepository.findByStatusAndIsPublished("ACTIVE", true);
        
        return services.stream()
                .map(service -> {
                    JobSeekerServiceDtos.ServiceResponse response = convertToServiceResponse(service);
                    
                    // Check if user has applied for this service
                    Optional<ServiceApplication> existingApplication = serviceApplicationRepository
                            .findByServiceIdAndApplicantId(service.getId(), userId);
                    
                    if (existingApplication.isPresent()) {
                        response.setHasApplied(true);
                        response.setMyApplicationStatus(existingApplication.get().getStatus());
                    } else {
                        response.setHasApplied(false);
                        response.setMyApplicationStatus(null);
                    }
                    
                    return response;
                })
                .collect(Collectors.toList());
    }

    // Apply for a service
    public JobSeekerServiceDtos.ServiceApplicationResponse applyForService(String userId, String serviceId, 
            JobSeekerServiceDtos.ServiceApplicationRequest request) {
        
        // Check if service exists and is active
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        if (!"ACTIVE".equals(service.getStatus()) || !service.getIsPublished()) {
            throw new RuntimeException("Service is not available for applications");
        }

        // Get user details
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if application already exists
        Optional<ServiceApplication> existingApplication = serviceApplicationRepository
                .findByServiceIdAndApplicantId(serviceId, userId);
        
        ServiceApplication application;
        if (existingApplication.isPresent()) {
            // Update existing application
            application = existingApplication.get();
            application.setStatus(request.getStatus());
            application.setStatusUpdatedAt(LocalDateTime.now());
            application.setCoverLetter(request.getCoverLetter());
            application.setAdditionalNotes(request.getAdditionalNotes());
            application.setResumeDocumentId(request.getResumeDocumentId());
            application.setOtherDocuments(request.getOtherDocuments());
        } else {
            // Create new application
            application = new ServiceApplication();
            application.setServiceId(serviceId);
            application.setServiceTitle(service.getTitle());
            application.setProviderId(service.getProviderId());
            application.setProviderName(service.getProviderName());
            application.setApplicantId(userId);
            application.setApplicantName(user.getFirstName() + " " + user.getLastName());
            application.setApplicantEmail(user.getEmail());
            application.setApplicantPhone(user.getPhoneNumber());
            application.setApplicantType("JOB_SEEKER");
            application.setStatus(request.getStatus());
            application.setAppliedAt(LocalDateTime.now());
            application.setStatusUpdatedAt(LocalDateTime.now());
            application.setCoverLetter(request.getCoverLetter());
            application.setAdditionalNotes(request.getAdditionalNotes());
            application.setResumeDocumentId(request.getResumeDocumentId());
            application.setOtherDocuments(request.getOtherDocuments());
            application.setIsContacted(false);
        }

        ServiceApplication savedApplication = serviceApplicationRepository.save(application);
        return convertToApplicationResponse(savedApplication);
    }

    // Update service application
    public JobSeekerServiceDtos.ServiceApplicationResponse updateServiceApplication(String userId, String serviceId, 
            JobSeekerServiceDtos.ServiceApplicationRequest request) {
        
        // Find existing application
        ServiceApplication application = serviceApplicationRepository
                .findByServiceIdAndApplicantId(serviceId, userId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Update application
        application.setStatus(request.getStatus());
        application.setStatusUpdatedAt(LocalDateTime.now());
        application.setCoverLetter(request.getCoverLetter());
        application.setAdditionalNotes(request.getAdditionalNotes());
        application.setResumeDocumentId(request.getResumeDocumentId());
        application.setOtherDocuments(request.getOtherDocuments());

        ServiceApplication savedApplication = serviceApplicationRepository.save(application);
        return convertToApplicationResponse(savedApplication);
    }

    // Get my service applications
    public List<JobSeekerServiceDtos.ServiceApplicationResponse> getMyServiceApplications(String userId) {
        List<ServiceApplication> applications = serviceApplicationRepository.findByApplicantId(userId);
        
        return applications.stream()
                .map(this::convertToApplicationResponse)
                .collect(Collectors.toList());
    }

    // Helper Methods
    private JobSeekerServiceDtos.ServiceResponse convertToServiceResponse(ProviderService service) {
        JobSeekerServiceDtos.ServiceResponse response = new JobSeekerServiceDtos.ServiceResponse();
        response.setId(service.getId());
        response.setProviderId(service.getProviderId());
        response.setProviderName(service.getProviderName());
        response.setTitle(service.getTitle());
        response.setCategory(service.getCategory());
        response.setDescription(service.getDescription());
        response.setDuration(service.getDuration());
        response.setMode(service.getMode());
        response.setLocation(service.getLocation());
        response.setFees(service.getFees());
        response.setEligibility(service.getEligibility());
        response.setLastDateToApply(service.getLastDateToApply());
        response.setBannerUrl(service.getBannerUrl());
        response.setStatus(service.getStatus());
        response.setIsPublished(service.getIsPublished());
        response.setPublishedAt(service.getPublishedAt());
        response.setCreatedAt(service.getCreatedAt());
        response.setUpdatedAt(service.getUpdatedAt());
        response.setTags(service.getTags());
        response.setPrerequisites(service.getPrerequisites());
        response.setLearningOutcomes(service.getLearningOutcomes());
        response.setInstructorName(service.getInstructorName());
        response.setContactEmail(service.getContactEmail());
        response.setContactPhone(service.getContactPhone());
        return response;
    }

    private JobSeekerServiceDtos.ServiceApplicationResponse convertToApplicationResponse(ServiceApplication application) {
        JobSeekerServiceDtos.ServiceApplicationResponse response = new JobSeekerServiceDtos.ServiceApplicationResponse();
        response.setId(application.getId());
        response.setServiceId(application.getServiceId());
        response.setServiceTitle(application.getServiceTitle());
        response.setProviderId(application.getProviderId());
        response.setProviderName(application.getProviderName());
        response.setApplicantId(application.getApplicantId());
        response.setApplicantName(application.getApplicantName());
        response.setApplicantEmail(application.getApplicantEmail());
        response.setApplicantPhone(application.getApplicantPhone());
        response.setApplicantType(application.getApplicantType());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());
        response.setStatusUpdatedAt(application.getStatusUpdatedAt());
        response.setStatusNotes(application.getStatusNotes());
        response.setCoverLetter(application.getCoverLetter());
        response.setAdditionalNotes(application.getAdditionalNotes());
        response.setResumeDocumentId(application.getResumeDocumentId());
        response.setOtherDocuments(application.getOtherDocuments());
        response.setProviderNotes(application.getProviderNotes());
        response.setIsContacted(application.getIsContacted());
        response.setContactedAt(application.getContactedAt());
        response.setContactMethod(application.getContactMethod());
        response.setContactNotes(application.getContactNotes());
        return response;
    }
}
