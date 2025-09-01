package com.wits.project.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.wits.project.model.Provider;
import com.wits.project.model.ProviderService;
import com.wits.project.model.ServiceApplication;
import com.wits.project.model.Message;
import com.wits.project.model.User;
import com.wits.project.repository.ProviderRepository;
import com.wits.project.repository.ServiceRepository;
import com.wits.project.repository.ServiceApplicationRepository;
import com.wits.project.repository.MessageRepository;
import com.wits.project.repository.UserRepository;
import com.wits.project.web.dto.ProviderDtos;

@Service
public class ProviderServiceManager {

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceApplicationRepository serviceApplicationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Provider Profile Methods
    public ProviderDtos.ProfileResponse createProviderProfile(String userId, ProviderDtos.ProfileUpdateRequest request) {
        System.out.println("DEBUG: createProviderProfile called with userId: " + userId);
        System.out.println("DEBUG: request: " + request);
        
        // Check if provider already exists
        Optional<Provider> existingProvider = providerRepository.findByUserId(userId);
        if (existingProvider.isPresent()) {
            System.out.println("DEBUG: Provider already exists for userId: " + userId);
            throw new RuntimeException("Provider profile already exists for this user");
        }

        Provider provider = new Provider();
        provider.setUserId(userId);
        
        // Initialize all fields with default values first
        provider.setProviderName("");
        provider.setContactPersonName("");
        provider.setEmail("");
        provider.setPhoneNumber("");
        provider.setWebsite("");
        provider.setLogoUrl("");
        provider.setOrganizationType("");
        provider.setAddress("");
        provider.setCity("");
        provider.setState("");
        provider.setCountry("");
        provider.setZipCode("");
        provider.setAbout("");
        provider.setServicesOffered(new ArrayList<>());
        provider.setCertificationDocumentIds(new ArrayList<>());
        provider.setAccreditationDocumentIds(new ArrayList<>());
        
        // Profile completion and statistics
        provider.setProfileCompletionPercent(0.0);
        provider.setTotalServicesPosted(0);
        provider.setTotalApplicationsReceived(0);
        provider.setAverageRating(0.0);
        provider.setTotalReviews(0);
        
        // Verification fields
        provider.setIsVerified(false);
        provider.setVerificationStatus("PENDING");
        provider.setVerificationNotes("");
        
        // Notification preferences
        provider.setEmailNotifications(true);
        provider.setSmsNotifications(false);
        provider.setApplicationAlerts(true);
        provider.setWeeklyReports(false);
        
        // Privacy settings
        provider.setShowContactInformation(true);
        
        // Timestamps
        provider.setCreatedAt(java.time.Instant.now());
        provider.setUpdatedAt(java.time.Instant.now());
        
        // Now update with request data
        updateProviderFromRequest(provider, request);
        provider.setProfileCompletionPercent(calculateProfileCompletion(provider));

        System.out.println("DEBUG: About to save provider: " + provider);
        Provider savedProvider = providerRepository.save(provider);
        System.out.println("DEBUG: Provider saved successfully: " + savedProvider.getId());
        
        ProviderDtos.ProfileResponse response = convertToProfileResponse(savedProvider);
        System.out.println("DEBUG: Returning response: " + response);
        return response;
    }

    public ProviderDtos.ProfileResponse updateProviderProfile(String userId, ProviderDtos.ProfileUpdateRequest request) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        updateProviderFromRequest(provider, request);
        provider.setProfileCompletionPercent(calculateProfileCompletion(provider));
        provider.setUpdatedAt(java.time.Instant.now());

        Provider savedProvider = providerRepository.save(provider);
        return convertToProfileResponse(savedProvider);
    }

    public ProviderDtos.ProfileResponse getProviderProfile(String userId) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElse(null);
        if (provider == null) {
            provider = new Provider();
            provider.setUserId(userId);
            
            // Initialize all fields with default values
            provider.setProviderName("");
            provider.setContactPersonName("");
            provider.setEmail("");
            provider.setPhoneNumber("");
            provider.setWebsite("");
            provider.setLogoUrl("");
            provider.setOrganizationType("");
            provider.setAddress("");
            provider.setCity("");
            provider.setState("");
            provider.setCountry("");
            provider.setZipCode("");
            provider.setAbout("");
            provider.setServicesOffered(new ArrayList<>());
            provider.setCertificationDocumentIds(new ArrayList<>());
            provider.setAccreditationDocumentIds(new ArrayList<>());
            
            // Profile completion and statistics
            provider.setProfileCompletionPercent(0.0);
            provider.setTotalServicesPosted(0);
            provider.setTotalApplicationsReceived(0);
            provider.setAverageRating(0.0);
            provider.setTotalReviews(0);
            
            // Verification fields
            provider.setIsVerified(false);
            provider.setVerificationStatus("PENDING");
            provider.setVerificationNotes("");
            
            // Notification preferences
            provider.setEmailNotifications(true);
            provider.setSmsNotifications(false);
            provider.setApplicationAlerts(true);
            provider.setWeeklyReports(false);
            
            // Privacy settings
            provider.setShowContactInformation(true);
            
            // Timestamps
            provider.setCreatedAt(java.time.Instant.now());
            provider.setUpdatedAt(java.time.Instant.now());
        }
        return convertToProfileResponse(provider);
    }

    public ProviderDtos.DashboardStats getDashboardStats(String userId) {
        // Check if provider profile exists
        Optional<Provider> providerOpt = providerRepository.findByUserId(userId);
        
        if (!providerOpt.isPresent()) {
            // Return default stats if provider profile doesn't exist
            ProviderDtos.DashboardStats stats = new ProviderDtos.DashboardStats();
            stats.setProfileCompletionPercent(0.0);
            stats.setTotalServicesPosted(0);
            stats.setTotalApplicationsReceived(0);
            stats.setAverageRating(0.0);
            stats.setTotalReviews(0);
            stats.setPendingApplications(0);
            stats.setUnreadMessages(0);
            stats.setActiveServices(0);
            stats.setDraftServices(0);
            return stats;
        }

        Provider provider = providerOpt.get();
        List<ProviderService> services = serviceRepository.findByProviderId(provider.getId());
        List<ServiceApplication> applications = serviceApplicationRepository.findByProviderId(provider.getId());
        Long unreadMessages = messageRepository.countUnreadMessages(userId);

        ProviderDtos.DashboardStats stats = new ProviderDtos.DashboardStats();
        stats.setProfileCompletionPercent(provider.getProfileCompletionPercent() != null ? provider.getProfileCompletionPercent() : 0.0);
        stats.setTotalServicesPosted(services.size());
        stats.setTotalApplicationsReceived(applications.size());
        stats.setAverageRating(provider.getAverageRating() != null ? provider.getAverageRating() : 0.0);
        stats.setTotalReviews(provider.getTotalReviews() != null ? provider.getTotalReviews() : 0);
        stats.setPendingApplications((int) applications.stream().filter(app -> "PENDING".equals(app.getStatus())).count());
        stats.setUnreadMessages(unreadMessages != null ? unreadMessages.intValue() : 0);
        stats.setActiveServices((int) services.stream().filter(service -> "ACTIVE".equals(service.getStatus())).count());
        stats.setDraftServices((int) services.stream().filter(service -> "DRAFT".equals(service.getStatus())).count());

        return stats;
    }

    // Service Management Methods
    public ProviderDtos.ServiceResponse createService(String userId, ProviderDtos.ServiceCreateRequest request) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        ProviderService service = new ProviderService();
        service.setProviderId(provider.getId());
        service.setProviderName(provider.getProviderName());
        updateServiceFromRequest(service, request);
        service.setStatus("DRAFT");
        service.setIsPublished(false);

        ProviderService savedService = serviceRepository.save(service);
        return convertToServiceResponse(savedService);
    }

    public ProviderDtos.ServiceResponse updateService(String userId, String serviceId, ProviderDtos.ServiceUpdateRequest request) {
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Verify ownership
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
        if (!service.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized access to service");
        }

        updateServiceFromRequest(service, request);

        ProviderService savedService = serviceRepository.save(service);
        return convertToServiceResponse(savedService);
    }

    public ProviderDtos.ServiceResponse publishService(String userId, String serviceId) {
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Verify ownership
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
        if (!service.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized access to service");
        }

        service.setStatus("ACTIVE");
        service.setIsPublished(true);
        service.setPublishedAt(java.time.LocalDateTime.now());

        ProviderService savedService = serviceRepository.save(service);
        return convertToServiceResponse(savedService);
    }

    public void deleteService(String userId, String serviceId) {
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Verify ownership
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
        if (!service.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized access to service");
        }

        serviceRepository.delete(service);
    }

    public List<ProviderDtos.ServiceResponse> getProviderServices(String userId) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        List<ProviderService> services = serviceRepository.findByProviderId(provider.getId());
        return services.stream()
                .map(this::convertToServiceResponse)
                .collect(Collectors.toList());
    }

    public ProviderDtos.ServiceResponse getService(String userId, String serviceId) {
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Verify ownership
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
        if (!service.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized access to service");
        }

        return convertToServiceResponse(service);
    }

    // Application Management Methods
    public List<ProviderDtos.ServiceApplicationResponse> getServiceApplications(String userId) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        List<ServiceApplication> applications = serviceApplicationRepository.findByProviderId(provider.getId());
        return applications.stream()
                .map(this::convertToApplicationResponse)
                .collect(Collectors.toList());
    }

    public ProviderDtos.ServiceApplicationResponse updateApplicationStatus(String userId, String applicationId, 
            ProviderDtos.ApplicationStatusUpdateRequest request) {
        ServiceApplication application = serviceApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify ownership
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
        if (!application.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized access to application");
        }

        application.setStatus(request.getStatus());
        application.setStatusNotes(request.getStatusNotes());
        application.setStatusUpdatedAt(LocalDateTime.now());
        application.setIsContacted(request.getIsContacted());
        application.setContactMethod(request.getContactMethod());
        application.setContactNotes(request.getContactNotes());
        if (request.getIsContacted()) {
            application.setContactedAt(LocalDateTime.now());
        }

        ServiceApplication savedApplication = serviceApplicationRepository.save(application);
        return convertToApplicationResponse(savedApplication);
    }

    // Message Methods
    public ProviderDtos.MessageResponse sendMessage(String userId, ProviderDtos.MessageRequest request) {
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSenderId(userId);
        message.setSenderName(sender.getFirstName() + " " + sender.getLastName());
        message.setSenderType("PROVIDER");
        message.setReceiverId(request.getReceiverId());
        message.setReceiverName(receiver.getFirstName() + " " + receiver.getLastName());
        message.setReceiverType(getUserRole(receiver));
        message.setSubject(request.getSubject());
        message.setContent(request.getContent());
        message.setMessageType("TEXT");
        message.setIsRead(false);
        message.setServiceId(request.getServiceId());
        message.setApplicationId(request.getApplicationId());
        message.setAttachmentUrl(request.getAttachmentUrl());
        message.setAttachmentName(request.getAttachmentName());
        message.setAttachmentType(request.getAttachmentType());
        message.setSentAt(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);
        return convertToMessageResponse(savedMessage);
    }

    public List<ProviderDtos.MessageResponse> getMessages(String userId) {
        List<Message> messages = messageRepository.findConversationMessages(userId);
        return messages.stream()
                .map(this::convertToMessageResponse)
                .collect(Collectors.toList());
    }

    public void markMessageAsRead(String userId, String messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getReceiverId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to message");
        }

        message.setIsRead(true);
        message.setReadAt(LocalDateTime.now());
        messageRepository.save(message);
    }

    // Helper Methods
    private void updateProviderFromRequest(Provider provider, ProviderDtos.ProfileUpdateRequest request) {
        // Only update fields if they are provided in the request
        if (request.getProviderName() != null) {
            provider.setProviderName(request.getProviderName());
        }
        if (request.getContactPersonName() != null) {
            provider.setContactPersonName(request.getContactPersonName());
        }
        if (request.getEmail() != null) {
            provider.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            provider.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getWebsite() != null) {
            provider.setWebsite(request.getWebsite());
        }
        if (request.getLogoUrl() != null) {
            provider.setLogoUrl(request.getLogoUrl());
        }
        if (request.getOrganizationType() != null) {
            provider.setOrganizationType(request.getOrganizationType());
        }
        if (request.getAddress() != null) {
            provider.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            provider.setCity(request.getCity());
        }
        if (request.getState() != null) {
            provider.setState(request.getState());
        }
        if (request.getCountry() != null) {
            provider.setCountry(request.getCountry());
        }
        if (request.getZipCode() != null) {
            provider.setZipCode(request.getZipCode());
        }
        if (request.getAbout() != null) {
            provider.setAbout(request.getAbout());
        }
        if (request.getServicesOffered() != null) {
            provider.setServicesOffered(request.getServicesOffered());
        }
        if (request.getCertificationDocumentIds() != null) {
            provider.setCertificationDocumentIds(request.getCertificationDocumentIds());
        }
        if (request.getAccreditationDocumentIds() != null) {
            provider.setAccreditationDocumentIds(request.getAccreditationDocumentIds());
        }
        if (request.getEmailNotifications() != null) {
            provider.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getSmsNotifications() != null) {
            provider.setSmsNotifications(request.getSmsNotifications());
        }
        if (request.getApplicationAlerts() != null) {
            provider.setApplicationAlerts(request.getApplicationAlerts());
        }
        if (request.getWeeklyReports() != null) {
            provider.setWeeklyReports(request.getWeeklyReports());
        }
        if (request.getShowContactInformation() != null) {
            provider.setShowContactInformation(request.getShowContactInformation());
        }
    }

    private void updateServiceFromRequest(ProviderService service, Object request) {
        if (request instanceof ProviderDtos.ServiceCreateRequest) {
            ProviderDtos.ServiceCreateRequest createRequest = (ProviderDtos.ServiceCreateRequest) request;
            updateServiceFromCreateRequest(service, createRequest);
        } else if (request instanceof ProviderDtos.ServiceUpdateRequest) {
            ProviderDtos.ServiceUpdateRequest updateRequest = (ProviderDtos.ServiceUpdateRequest) request;
            updateServiceFromUpdateRequest(service, updateRequest);
        }
    }

    private void updateServiceFromCreateRequest(ProviderService service, ProviderDtos.ServiceCreateRequest request) {
        if (StringUtils.hasText(request.getTitle())) {
            service.setTitle(request.getTitle());
        }
        if (StringUtils.hasText(request.getCategory())) {
            service.setCategory(request.getCategory());
        }
        if (StringUtils.hasText(request.getDescription())) {
            service.setDescription(request.getDescription());
        }
        if (StringUtils.hasText(request.getDuration())) {
            service.setDuration(request.getDuration());
        }
        if (StringUtils.hasText(request.getMode())) {
            service.setMode(request.getMode());
        }
        if (StringUtils.hasText(request.getLocation())) {
            service.setLocation(request.getLocation());
        }
        if (request.getFees() != null) {
            service.setFees(request.getFees());
        }
        if (StringUtils.hasText(request.getEligibility())) {
            service.setEligibility(request.getEligibility());
        }
        if (request.getLastDateToApply() != null) {
            service.setLastDateToApply(request.getLastDateToApply());
        }
        if (StringUtils.hasText(request.getBannerUrl())) {
            service.setBannerUrl(request.getBannerUrl());
        }
        if (request.getTags() != null) {
            service.setTags(request.getTags());
        }
        if (StringUtils.hasText(request.getPrerequisites())) {
            service.setPrerequisites(request.getPrerequisites());
        }
        if (StringUtils.hasText(request.getLearningOutcomes())) {
            service.setLearningOutcomes(request.getLearningOutcomes());
        }
        if (StringUtils.hasText(request.getInstructorName())) {
            service.setInstructorName(request.getInstructorName());
        }
        if (StringUtils.hasText(request.getContactEmail())) {
            service.setContactEmail(request.getContactEmail());
        }
        if (StringUtils.hasText(request.getContactPhone())) {
            service.setContactPhone(request.getContactPhone());
        }
    }

    private void updateServiceFromUpdateRequest(ProviderService service, ProviderDtos.ServiceUpdateRequest request) {
        updateServiceFromCreateRequest(service, new ProviderDtos.ServiceCreateRequest() {
            {
                setTitle(request.getTitle());
                setCategory(request.getCategory());
                setDescription(request.getDescription());
                setDuration(request.getDuration());
                setMode(request.getMode());
                setLocation(request.getLocation());
                setFees(request.getFees());
                setEligibility(request.getEligibility());
                setLastDateToApply(request.getLastDateToApply());
                setBannerUrl(request.getBannerUrl());
                setTags(request.getTags());
                setPrerequisites(request.getPrerequisites());
                setLearningOutcomes(request.getLearningOutcomes());
                setInstructorName(request.getInstructorName());
                setContactEmail(request.getContactEmail());
                setContactPhone(request.getContactPhone());
            }
        });

        if (StringUtils.hasText(request.getStatus())) {
            service.setStatus(request.getStatus());
        }
        if (request.getIsPublished() != null) {
            service.setIsPublished(request.getIsPublished());
        }
    }

    private Double calculateProfileCompletion(Provider provider) {
        int totalFields = 0;
        int completedFields = 0;

        // Basic Information (6 fields)
        totalFields += 6;
        if (StringUtils.hasText(provider.getProviderName())) completedFields++;
        if (StringUtils.hasText(provider.getContactPersonName())) completedFields++;
        if (StringUtils.hasText(provider.getEmail())) completedFields++;
        if (StringUtils.hasText(provider.getPhoneNumber())) completedFields++;
        if (StringUtils.hasText(provider.getWebsite())) completedFields++;
        if (StringUtils.hasText(provider.getLogoUrl())) completedFields++;

        // Organization Details (8 fields)
        totalFields += 8;
        if (StringUtils.hasText(provider.getOrganizationType())) completedFields++;
        if (StringUtils.hasText(provider.getAddress())) completedFields++;
        if (StringUtils.hasText(provider.getCity())) completedFields++;
        if (StringUtils.hasText(provider.getState())) completedFields++;
        if (StringUtils.hasText(provider.getCountry())) completedFields++;
        if (StringUtils.hasText(provider.getZipCode())) completedFields++;
        if (StringUtils.hasText(provider.getAbout())) completedFields++;
        if (provider.getServicesOffered() != null && !provider.getServicesOffered().isEmpty()) completedFields++;

        return totalFields > 0 ? (double) completedFields / totalFields * 100 : 0.0;
    }

    private String getUserRole(User user) {
        if (user.getRoles() != null) {
            if (user.getRoles().contains(com.wits.project.model.enums.Enums.UserRole.JOB_SEEKER)) {
                return "JOB_SEEKER";
            } else if (user.getRoles().contains(com.wits.project.model.enums.Enums.UserRole.EMPLOYER)) {
                return "EMPLOYER";
            } else if (user.getRoles().contains(com.wits.project.model.enums.Enums.UserRole.PROVIDER)) {
                return "PROVIDER";
            }
        }
        return "USER";
    }

    // Conversion Methods
    private ProviderDtos.ProfileResponse convertToProfileResponse(Provider provider) {
        ProviderDtos.ProfileResponse response = new ProviderDtos.ProfileResponse();
        response.setId(provider.getId());
        response.setUserId(provider.getUserId());
        response.setProviderName(provider.getProviderName());
        response.setContactPersonName(provider.getContactPersonName());
        response.setEmail(provider.getEmail());
        response.setPhoneNumber(provider.getPhoneNumber());
        response.setWebsite(provider.getWebsite());
        response.setLogoUrl(provider.getLogoUrl());
        response.setOrganizationType(provider.getOrganizationType());
        response.setAddress(provider.getAddress());
        response.setCity(provider.getCity());
        response.setState(provider.getState());
        response.setCountry(provider.getCountry());
        response.setZipCode(provider.getZipCode());
        response.setAbout(provider.getAbout());
        response.setServicesOffered(provider.getServicesOffered());
        response.setCertificationDocumentIds(provider.getCertificationDocumentIds());
        response.setAccreditationDocumentIds(provider.getAccreditationDocumentIds());
        response.setProfileCompletionPercent(provider.getProfileCompletionPercent());
        response.setIsVerified(provider.getIsVerified());
        response.setVerificationStatus(provider.getVerificationStatus());
        response.setVerificationNotes(provider.getVerificationNotes());
        response.setEmailNotifications(provider.getEmailNotifications());
        response.setSmsNotifications(provider.getSmsNotifications());
        response.setApplicationAlerts(provider.getApplicationAlerts());
        response.setWeeklyReports(provider.getWeeklyReports());
        response.setShowContactInformation(provider.getShowContactInformation());
        response.setTotalServicesPosted(provider.getTotalServicesPosted());
        response.setTotalApplicationsReceived(provider.getTotalApplicationsReceived());
        response.setAverageRating(provider.getAverageRating());
        response.setTotalReviews(provider.getTotalReviews());
        return response;
    }

    private ProviderDtos.ServiceResponse convertToServiceResponse(ProviderService service) {
        ProviderDtos.ServiceResponse response = new ProviderDtos.ServiceResponse();
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
        response.setTotalApplications(service.getTotalApplications());
        response.setAcceptedApplications(service.getAcceptedApplications());
        response.setRejectedApplications(service.getRejectedApplications());
        response.setPendingApplications(service.getPendingApplications());
        response.setAverageRating(service.getAverageRating());
        response.setTotalReviews(service.getTotalReviews());
        response.setTags(service.getTags());
        response.setPrerequisites(service.getPrerequisites());
        response.setLearningOutcomes(service.getLearningOutcomes());
        response.setInstructorName(service.getInstructorName());
        response.setContactEmail(service.getContactEmail());
        response.setContactPhone(service.getContactPhone());
        return response;
    }

    private ProviderDtos.ServiceApplicationResponse convertToApplicationResponse(ServiceApplication application) {
        ProviderDtos.ServiceApplicationResponse response = new ProviderDtos.ServiceApplicationResponse();
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

    private ProviderDtos.MessageResponse convertToMessageResponse(Message message) {
        ProviderDtos.MessageResponse response = new ProviderDtos.MessageResponse();
        response.setId(message.getId());
        response.setSenderId(message.getSenderId());
        response.setSenderName(message.getSenderName());
        response.setSenderType(message.getSenderType());
        response.setReceiverId(message.getReceiverId());
        response.setReceiverName(message.getReceiverName());
        response.setReceiverType(message.getReceiverType());
        response.setSubject(message.getSubject());
        response.setContent(message.getContent());
        response.setMessageType(message.getMessageType());
        response.setIsRead(message.getIsRead());
        response.setReadAt(message.getReadAt());
        response.setServiceId(message.getServiceId());
        response.setServiceTitle(message.getServiceTitle());
        response.setApplicationId(message.getApplicationId());
        response.setSentAt(message.getSentAt());
        response.setAttachmentUrl(message.getAttachmentUrl());
        response.setAttachmentName(message.getAttachmentName());
        response.setAttachmentType(message.getAttachmentType());
        return response;
    }
}
