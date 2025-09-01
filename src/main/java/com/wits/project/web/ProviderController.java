package com.wits.project.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.wits.project.service.ProviderServiceManager;
import com.wits.project.web.dto.ProviderDtos;

@RestController
@RequestMapping("/api/provider")
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderController {

    @Autowired
    private ProviderServiceManager providerService;

    // Provider Profile Endpoints
    @PostMapping("/profile")
    public ResponseEntity<ProviderDtos.ProfileResponse> createProviderProfile(
            Authentication authentication,
            @RequestBody ProviderDtos.ProfileUpdateRequest request) {
        try {
            System.out.println("DEBUG: Authentication: " + authentication);
            
            if (authentication == null) {
                System.out.println("DEBUG: Authentication is null");
                return ResponseEntity.status(401).build();
            }
            
            System.out.println("DEBUG: Authentication.getName(): " + authentication.getName());
            System.out.println("DEBUG: Request: " + request);
            
            String userId = authentication.getName();
            if (userId == null || userId.trim().isEmpty()) {
                System.out.println("DEBUG: UserId is null or empty");
                return ResponseEntity.badRequest().build();
            }
            
            if (request == null) {
                System.out.println("DEBUG: Request is null");
                return ResponseEntity.badRequest().build();
            }
            
            ProviderDtos.ProfileResponse response = providerService.createProviderProfile(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in createProviderProfile: " + e.getMessage());
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ProviderDtos.ProfileResponse> updateProviderProfile(
            Authentication authentication,
            @RequestBody ProviderDtos.ProfileUpdateRequest request) {
        try {
            String userId = authentication.getName();
            ProviderDtos.ProfileResponse response = providerService.updateProviderProfile(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ProviderDtos.ProfileResponse> getProviderProfile(Authentication authentication) {
        try {
            String userId = authentication.getName();
            ProviderDtos.ProfileResponse response = providerService.getProviderProfile(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in getProviderProfile: " + e.getMessage());
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ProviderDtos.DashboardStats> getDashboardStats(Authentication authentication) {
        try {
            System.out.println("DEBUG: Authentication: " + authentication);
            
            if (authentication == null) {
                System.out.println("DEBUG: Authentication is null");
                return ResponseEntity.status(401).build();
            }
            
            System.out.println("DEBUG: Authentication.getName(): " + authentication.getName());
            System.out.println("DEBUG: Authentication.getAuthorities(): " + authentication.getAuthorities());
            
            String userId = authentication.getName();
            if (userId == null || userId.trim().isEmpty()) {
                System.out.println("DEBUG: UserId is null or empty");
                return ResponseEntity.badRequest().build();
            }
            
            ProviderDtos.DashboardStats stats = providerService.getDashboardStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in getDashboardStats: " + e.getMessage());
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.internalServerError().build();
        }
    }

    // Service Management Endpoints
    @PostMapping("/services")
    public ResponseEntity<ProviderDtos.ServiceResponse> createService(
            Authentication authentication,
            @RequestBody ProviderDtos.ServiceCreateRequest request) {
        try {
            String userId = authentication.getName();
            ProviderDtos.ServiceResponse response = providerService.createService(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in createService: " + e.getMessage());
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/services/{serviceId}")
    public ResponseEntity<ProviderDtos.ServiceResponse> updateService(
            Authentication authentication,
            @PathVariable String serviceId,
            @RequestBody ProviderDtos.ServiceUpdateRequest request) {
        try {
            String userId = authentication.getName();
            request.setId(serviceId);
            ProviderDtos.ServiceResponse response = providerService.updateService(userId, serviceId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/services/{serviceId}/publish")
    public ResponseEntity<ProviderDtos.ServiceResponse> publishService(
            Authentication authentication,
            @PathVariable String serviceId) {
        try {
            String userId = authentication.getName();
            ProviderDtos.ServiceResponse response = providerService.publishService(userId, serviceId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<Void> deleteService(
            Authentication authentication,
            @PathVariable String serviceId) {
        try {
            String userId = authentication.getName();
            providerService.deleteService(userId, serviceId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/services")
    public ResponseEntity<List<ProviderDtos.ServiceResponse>> getProviderServices(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<ProviderDtos.ServiceResponse> services = providerService.getProviderServices(userId);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/services/{serviceId}")
    public ResponseEntity<ProviderDtos.ServiceResponse> getService(
            Authentication authentication,
            @PathVariable String serviceId) {
        try {
            String userId = authentication.getName();
            ProviderDtos.ServiceResponse service = providerService.getService(userId, serviceId);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Application Management Endpoints
    @GetMapping("/applications")
    public ResponseEntity<List<ProviderDtos.ServiceApplicationResponse>> getServiceApplications(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<ProviderDtos.ServiceApplicationResponse> applications = providerService.getServiceApplications(userId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<ProviderDtos.ServiceApplicationResponse> updateApplicationStatus(
            Authentication authentication,
            @PathVariable String applicationId,
            @RequestBody ProviderDtos.ApplicationStatusUpdateRequest request) {
        try {
            String userId = authentication.getName();
            ProviderDtos.ServiceApplicationResponse response = providerService.updateApplicationStatus(userId, applicationId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Message Endpoints
    @PostMapping("/messages")
    public ResponseEntity<ProviderDtos.MessageResponse> sendMessage(
            Authentication authentication,
            @RequestBody ProviderDtos.MessageRequest request) {
        try {
            String userId = authentication.getName();
            ProviderDtos.MessageResponse response = providerService.sendMessage(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ProviderDtos.MessageResponse>> getMessages(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<ProviderDtos.MessageResponse> messages = providerService.getMessages(userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/messages/{messageId}/read")
    public ResponseEntity<Void> markMessageAsRead(
            Authentication authentication,
            @PathVariable String messageId) {
        try {
            String userId = authentication.getName();
            providerService.markMessageAsRead(userId, messageId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
