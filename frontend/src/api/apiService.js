import api from "./client.js";

// Authentication API
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },
};

// User API
export const userAPI = {
  // Register new user (public)
  register: async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to register user"
      );
    }
  },

  // Update user profile (authenticated users)
  updateProfile: async (profileData) => {
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          if (typeof profileData[key] === "object") {
            formData.append(key, JSON.stringify(profileData[key]));
          } else {
            formData.append(key, profileData[key]);
          }
        }
      });
      const response = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  // Get user by ID (JOB_SEEKER, EMPLOYER, STAFF, PROVIDER)
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get user");
    }
  },

  // Get users by IDs (JOB_SEEKER, EMPLOYER, STAFF, PROVIDER)
  getUsersByIds: async (userIds) => {
    try {
      const ids = Array.isArray(userIds) ? userIds.join(",") : userIds;
      const response = await api.get(`/users?ids=${ids}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get users");
    }
  },

  // Get complete user profile by ID (for employers viewing job seekers)
  getUserProfileById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get user profile"
      );
    }
  },

  // Download resume for a specific user (employer access)
  downloadResume: async (userId) => {
    try {
      const response = await api.get(
        `/jobseekers/profile/resume/download/employer?userId=${userId}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to download resume"
      );
    }
  },

  // Download cover letter for a specific user (employer access)
  downloadCoverLetter: async (userId) => {
    try {
      const response = await api.get(
        `/jobseekers/profile/cover-letter/download/employer?userId=${userId}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to download cover letter"
      );
    }
  },

  // Link existing documents to job seeker profile
  linkExistingDocuments: async (userId) => {
    try {
      const response = await api.post(
        `/jobseekers/profile/link-documents/employer?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to link documents"
      );
    }
  },

  // Get document information for a specific user (employer access)
  getDocumentInfo: async (userId, documentType) => {
    try {
      const response = await api.get(
        `/jobseekers/profile/document-info/employer?userId=${userId}&documentType=${documentType}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get document info"
      );
    }
  },

  // Check document availability for a specific user (employer access)
  checkDocumentAvailability: async (userId) => {
    try {
      const response = await api.get(
        `/jobseekers/profile/documents/check/employer?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to check document availability"
      );
    }
  },

  // Get direct file access URL for a document (employer access)
  getDocumentUrl: async (userId, documentType) => {
    try {
      const response = await api.get(
        `/jobseekers/profile/document-url/employer?userId=${userId}&documentType=${documentType}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get document URL"
      );
    }
  },

  // Debug file structure (temporary)
  debugFileStructure: async (userId) => {
    try {
      const response = await api.get(
        `/jobseekers/debug/file-structure?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to debug file structure"
      );
    }
  },
};

// Job API
export const jobAPI = {
  // Create job posting (EMPLOYER only)
  createJob: async (jobData) => {
    try {
      // Transform frontend data to match backend CreateJobRequest structure
      const backendData = {
        title: jobData.title || jobData.jobTitle,
        companyName: jobData.companyName,
        description: jobData.description,
        jobType: jobData.jobType,
        location: jobData.location,
        status: jobData.status || "ACTIVE",
        minSalary: jobData.minSalary ? parseFloat(jobData.minSalary) : null,
        maxSalary: jobData.maxSalary ? parseFloat(jobData.maxSalary) : null,
        requiredSkills: jobData.requiredSkills || jobData.requirements || [],
      };

      // Fix jobType enum mapping
      if (backendData.jobType === "INTERNSHIP") {
        backendData.jobType = "INTERN";
      }

      const response = await api.post("/jobs", backendData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create job");
    }
  },

  // Update job posting (EMPLOYER only)
  updateJob: async (jobId, jobData) => {
    try {
      // Transform frontend data to match backend UpdateJobRequest structure
      const backendData = {
        title: jobData.jobTitle,
        companyName: jobData.companyName,
        description: jobData.description,
        jobType: jobData.jobType,
        location: jobData.location,
        status: jobData.status,
        minSalary: jobData.minSalary ? parseFloat(jobData.minSalary) : null,
        maxSalary: jobData.maxSalary ? parseFloat(jobData.maxSalary) : null,
        requiredSkills: jobData.requirements || [],
      };

      // Fix jobType enum mapping
      if (backendData.jobType === "INTERNSHIP") {
        backendData.jobType = "INTERN";
      }

      const response = await api.put(`/jobs/${jobId}`, backendData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update job");
    }
  },

  // Update job status (EMPLOYER only)
  updateJobStatus: async (jobId, status) => {
    try {
      const response = await api.put(`/jobs/${jobId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update job status"
      );
    }
  },

  // Delete job posting (EMPLOYER only)
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete job");
    }
  },

  // Get employer's jobs (EMPLOYER only)
  getEmployerJobs: async () => {
    try {
      const response = await api.get("/jobs/employer");

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get employer jobs"
      );
    }
  },

  // Get applications for a specific job (EMPLOYER only)
  getJobApplications: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get job applications"
      );
    }
  },

  // Search jobs (public)
  searchJobs: async (query = "") => {
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : "";
      // const response = await api.get(`/jobs${params}`)
      const response = await api.get(`/jobs/testJobs`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to search jobs");
    }
  },

  // Get all jobs (public)
  getAllJobs: async () => {
    try {
      const response = await api.get("/jobs/testJobs");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get jobs");
    }
  },
};

// Application API
export const applicationAPI = {
  // List applications (JOB_SEEKER, EMPLOYER, STAFF)
  listApplications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append("userId", filters.userId);
      if (filters.jobPostingId)
        params.append("jobPostingId", filters.jobPostingId);

      const response = await api.get(`/applications?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get applications"
      );
    }
  },

  // Get enriched applications for current user (job seeker) - with complete job details
  getMyApplicationsWithJobDetails: async () => {
    try {
      const response = await api.get("/applications/my-applications");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to get my applications with job details"
      );
    }
  },

  // Get enriched applications for a specific job (employer) - with complete user details
  getJobApplicationsWithUserDetails: async (jobPostingId) => {
    try {
      console.log(
        "🔍 API Call: Getting applications for job posting ID:",
        jobPostingId
      );
      const response = await api.get(
        `/applications/job/${jobPostingId}/enriched`
      );
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API Error:", error);
      console.error("❌ Error response:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to get job applications with user details"
      );
    }
  },

  // Apply for job (JOB_SEEKER only)
  applyForJob: async (applicationData) => {
    try {
      const response = await api.post("/applications", applicationData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to apply for job"
      );
    }
  },

  // Update application status (EMPLOYER, STAFF)
  updateApplicationStatus: async (
    applicationId,
    status,
    rejectReason = null
  ) => {
    try {
      const requestBody = {
        applicationId,
        status,
      };

      // Add rejectReason if provided
      if (rejectReason) {
        requestBody.rejectReason = rejectReason;
      }

      const response = await api.put("/applications/status", requestBody);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  },

  // Get all application statuses (for dropdown)
  getApplicationStatuses: async () => {
    try {
      const response = await api.get("/applications/statuses");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get application statuses"
      );
    }
  },

  // Schedule interview
  scheduleInterview: async (applicationId, interviewData) => {
    try {
      const response = await api.post(
        `/applications/${applicationId}/schedule-interview`,
        interviewData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to schedule interview"
      );
    }
  },

  // Get interview details
  getInterviewDetails: async (applicationId) => {
    try {
      const response = await api.get(
        `/applications/${applicationId}/interview`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get interview details"
      );
    }
  },

  // Get applications by user ID
  getApplicationsByUser: async (userId) => {
    try {
      const response = await api.get(`/applications?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get user applications"
      );
    }
  },

  // Get applications by job posting ID
  getApplicationsByJob: async (jobPostingId) => {
    try {
      const response = await api.get(
        `/applications?jobPostingId=${jobPostingId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get job applications"
      );
    }
  },
};

// Job Seeker Services API
export const jobSeekerServicesAPI = {
  // Get all available services
  getAllServices: async () => {
    try {
      const response = await api.get("/jobseeker/services");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get services"
      );
    }
  },

  // Apply for a service
  applyForService: async (serviceId, applicationData) => {
    try {
      const response = await api.post(
        `/jobseeker/services/${serviceId}/apply`,
        applicationData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to apply for service"
      );
    }
  },

  // Update service application
  updateServiceApplication: async (serviceId, applicationData) => {
    try {
      const response = await api.put(
        `/jobseeker/services/${serviceId}/application`,
        applicationData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update service application"
      );
    }
  },

  // Get my service applications
  getMyServiceApplications: async () => {
    try {
      const response = await api.get("/jobseeker/services/my-applications");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get my service applications"
      );
    }
  },
};

// Document API
// Document API
export const documentAPI = {
  // Upload document (JOB_SEEKER, STAFF)
  uploadDocument: async (file, programType, description) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("programType", programType);
      formData.append("description", description);

      const response = await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload document"
      );
    }
  },

  // List documents (JOB_SEEKER, STAFF)
  listDocuments: async () => {
    try {
      const response = await api.get("/documents");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get documents"
      );
    }
  },
};

// Home API
export const homeAPI = {
  // Get root endpoint
  getRoot: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get root");
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Health check failed");
    }
  },
};

// Utility functions for role-based access control
export const roleUtils = {
  // Check if user has specific role
  hasRole: (userRoles, requiredRole) => {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    return userRoles.includes(requiredRole);
  },

  // Check if user has any of the required roles
  hasAnyRole: (userRoles, requiredRoles) => {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    if (!requiredRoles || !Array.isArray(requiredRoles)) return false;
    return requiredRoles.some((role) => userRoles.includes(role));
  },

  // Get user roles from localStorage
  getUserRoles: () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.roles || [];
    } catch (error) {
      return [];
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get current user
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (error) {
      return {};
    }
  },

  // Get authentication status
  getAuthStatus: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userObj = user ? JSON.parse(user) : {};

    return {
      hasToken: !!token,
      hasUser: !!user,
      userData: userObj,
      userRoles: userObj.roles || [],
      isEmployer: userObj.roles?.includes("EMPLOYER") || false,
    };
  },
};

// Role-based API access helpers
export const roleBasedAPI = {
  // Only for EMPLOYER role
  employerOnly: (apiCall) => {
    const userRoles = roleUtils.getUserRoles();
    if (!roleUtils.hasRole(userRoles, "EMPLOYER")) {
      throw new Error("Access denied: EMPLOYER role required");
    }
    return apiCall;
  },

  // Only for JOB_SEEKER role
  jobSeekerOnly: (apiCall) => {
    const userRoles = roleUtils.getUserRoles();
    if (!roleUtils.hasRole(userRoles, "JOB_SEEKER")) {
      throw new Error("Access denied: JOB_SEEKER role required");
    }
    return apiCall;
  },

  // Only for STAFF role
  staffOnly: (apiCall) => {
    const userRoles = roleUtils.getUserRoles();
    if (!roleUtils.hasRole(userRoles, "STAFF")) {
      throw new Error("Access denied: STAFF role required");
    }
    return apiCall;
  },

  // For multiple roles
  multiRole: (apiCall, allowedRoles) => {
    const userRoles = roleUtils.getUserRoles();
    if (!roleUtils.hasAnyRole(userRoles, allowedRoles)) {
      throw new Error(
        `Access denied: One of ${allowedRoles.join(", ")} roles required`
      );
    }
    return apiCall;
  },
};
// Employer API
export const employerAPI = {
  // Get current user's employer profile
  getMyProfile: async () => {
    try {
      const response = await api.get("/employers/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get employer profile"
      );
    }
  },

  // Update employer profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/employers/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update employer profile"
      );
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/employers/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload profile picture"
      );
    }
  },

  // Get profile picture URL
  getProfilePictureUrl: () => {
    return `${api.defaults.baseURL}/employers/profile/picture/download`;
  },

  // Get company logo URL
  getCompanyLogoUrl: () => {
    return `${api.defaults.baseURL}/employers/profile/logo/download`;
  },

  // Upload company logo
  uploadCompanyLogo: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/employers/profile/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload company logo"
      );
    }
  },

  // Search employers (for admin/staff)
  searchEmployers: async (searchCriteria) => {
    try {
      const response = await api.get("/employers/search", {
        params: searchCriteria,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search employers"
      );
    }
  },

  // Get employer by ID (for admin/staff)
  getEmployerById: async (id) => {
    try {
      const response = await api.get(`/employers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get employer"
      );
    }
  },

  // Get all verified employers
  getVerifiedEmployers: async () => {
    try {
      const response = await api.get("/employers/verified");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get verified employers"
      );
    }
  },
};
// JobSeeker API
export const jobSeekerAPI = {
  // Get current user's job seeker profile
  getMyProfile: async () => {
    try {
      console.log("🔍 Attempting to get job seeker profile...");
      const response = await api.get("/jobseekers/profile");
      console.log("✅ Job seeker profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Failed to get job seeker profile:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Update current user's job seeker profile
  updateProfile: async (profileData) => {
    try {
      console.log("🔍 Attempting to update job seeker profile...");
      const response = await api.put("/jobseekers/profile", profileData);
      console.log("✅ Job seeker profile updated:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Failed to update job seeker profile:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data?.message || "Failed to update job seeker profile"
      );
    }
  },

  // Upload resume
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/jobseekers/profile/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload cover letter
  uploadCoverLetter: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/jobseekers/profile/cover-letter", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload profile picture
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/jobseekers/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get profile picture URL
  getProfilePictureUrl: () => {
    return `${api.defaults.baseURL}/jobseekers/profile/picture/download`;
  },

  // Search job seekers (for employers)
  searchJobSeekers: (params) => api.get("/jobseekers/search", { params }),

  // Get job seeker by ID (for employers)
  getJobSeekerById: (id) => api.get(`/jobseekers/${id}`),

  // Link existing documents to job seeker profile
  linkExistingDocuments: async () => {
    try {
      const response = await api.post("/jobseekers/profile/link-documents");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to link documents"
      );
    }
  },
};

// Provider API
export const providerAPI = {
  // Get current user's provider profile
  getMyProfile: async () => {
    try {
      const response = await api.get("/provider/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get provider profile"
      );
    }
  },

  // Create provider profile
  createProfile: async (profileData) => {
    try {
      const response = await api.post("/provider/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create provider profile"
      );
    }
  },

  // Update provider profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/provider/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update provider profile"
      );
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get("/provider/dashboard/stats");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get dashboard stats"
      );
    }
  },

  // Service Management
  createService: async (serviceData) => {
    try {
      const response = await api.post("/provider/services", serviceData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create service"
      );
    }
  },

  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(
        `/provider/services/${serviceId}`,
        serviceData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update service"
      );
    }
  },

  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/provider/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete service"
      );
    }
  },

  publishService: async (serviceId) => {
    try {
      const response = await api.post(
        `/provider/services/${serviceId}/publish`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to publish service"
      );
    }
  },

  getMyServices: async () => {
    try {
      const response = await api.get("/provider/services");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get services"
      );
    }
  },

  getService: async (serviceId) => {
    try {
      const response = await api.get(`/provider/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get service");
    }
  },

  // Application Management
  getServiceApplications: async () => {
    try {
      const response = await api.get("/provider/applications");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get applications"
      );
    }
  },

  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(
        `/provider/applications/${applicationId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  },

  // Messaging
  sendMessage: async (messageData) => {
    try {
      const response = await api.post("/provider/messages", messageData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  getMessages: async () => {
    try {
      const response = await api.get("/provider/messages");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get messages"
      );
    }
  },

  markMessageAsRead: async (messageId) => {
    try {
      const response = await api.put(`/provider/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to mark message as read"
      );
    }
  },
};
// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  job: jobAPI,
  application: applicationAPI,
  document: documentAPI,
  home: homeAPI,
  roleUtils,
  roleBasedAPI,
  jobSeekerAPI,
  employerAPI,
  providerAPI,
  jobSeekerServicesAPI,
};
