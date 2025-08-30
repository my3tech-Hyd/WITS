import api from './client.js'

// Authentication API
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }
}

// User API
export const userAPI = {
  // Register new user (public)
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register user')
    }
  },

  // Update user profile (authenticated users)
  updateProfile: async (profileData) => {
    try {
      const formData = new FormData()
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          if (typeof profileData[key] === 'object') {
            formData.append(key, JSON.stringify(profileData[key]))
          } else {
            formData.append(key, profileData[key])
          }
        }
      })
      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  },

  // Get user by ID (JOB_SEEKER, EMPLOYER, STAFF, PROVIDER)
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user')
    }
  },

  // Get users by IDs (JOB_SEEKER, EMPLOYER, STAFF, PROVIDER)
  getUsersByIds: async (userIds) => {
    try {
      const ids = Array.isArray(userIds) ? userIds.join(',') : userIds
      const response = await api.get(`/users?ids=${ids}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users')
    }
  }
}

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
        status: jobData.status || 'ACTIVE',
        minSalary: jobData.minSalary ? parseFloat(jobData.minSalary) : null,
        maxSalary: jobData.maxSalary ? parseFloat(jobData.maxSalary) : null,
        requiredSkills: jobData.requiredSkills || jobData.requirements || []
      }
      
      // Fix jobType enum mapping
      if (backendData.jobType === 'INTERNSHIP') {
        backendData.jobType = 'INTERN'
      }
      
      const response = await api.post('/jobs', backendData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create job')
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
        requiredSkills: jobData.requirements || []
      }
      
      // Fix jobType enum mapping
      if (backendData.jobType === 'INTERNSHIP') {
        backendData.jobType = 'INTERN'
      }
      
      const response = await api.put(`/jobs/${jobId}`, backendData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update job')
    }
  },

  // Update job status (EMPLOYER only)
  updateJobStatus: async (jobId, status) => {
    try {
      const response = await api.put(`/jobs/${jobId}/status`, { status })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update job status')
    }
  },

  // Delete job posting (EMPLOYER only)
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete job')
    }
  },

  // Get employer's jobs (EMPLOYER only)
  getEmployerJobs: async () => {
    try {
      const response = await api.get('/jobs/employer')
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get employer jobs')
    }
  },

  // Get applications for a specific job (EMPLOYER only)
  getJobApplications: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/applications`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get job applications')
    }
  },

  // Search jobs (public)
  searchJobs: async (query = '') => {
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : ''
      const response = await api.get(`/jobs${params}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search jobs')
    }
  },

  // Get all jobs (public)
  getAllJobs: async () => {
    try {
      const response = await api.get('/jobs')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get jobs')
    }
  }
}

// Application API
export const applicationAPI = {
  // List applications (JOB_SEEKER, EMPLOYER, STAFF)
  listApplications: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      if (filters.userId) params.append('userId', filters.userId)
      if (filters.jobPostingId) params.append('jobPostingId', filters.jobPostingId)
      
      const response = await api.get(`/applications?${params.toString()}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get applications')
    }
  },

  // Get enriched applications for current user (job seeker) - with complete job details
  getMyApplicationsWithJobDetails: async () => {
    try {
      const response = await api.get('/applications/my-applications')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get my applications with job details')
    }
  },

  // Get enriched applications for a specific job (employer) - with complete user details
  getJobApplicationsWithUserDetails: async (jobPostingId) => {
    try {
      const response = await api.get(`/applications/job/${jobPostingId}/enriched`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get job applications with user details')
    }
  },

  // Apply for job (JOB_SEEKER only)
  applyForJob: async (applicationData) => {
    try {
      const response = await api.post('/applications', applicationData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to apply for job')
    }
  },

  // Update application status (EMPLOYER, STAFF)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await api.put('/applications/status', {
        applicationId,
        status
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update application status')
    }
  },

  // Get all application statuses (for dropdown)
  getApplicationStatuses: async () => {
    try {
      const response = await api.get('/applications/statuses')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get application statuses')
    }
  },

  // Schedule interview
  scheduleInterview: async (applicationId, interviewData) => {
    try {
      const response = await api.post(`/applications/${applicationId}/schedule-interview`, interviewData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to schedule interview')
    }
  },

  // Get interview details
  getInterviewDetails: async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}/interview`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get interview details')
    }
  },

  // Get applications by user ID
  getApplicationsByUser: async (userId) => {
    try {
      const response = await api.get(`/applications?userId=${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user applications')
    }
  },

  // Get applications by job posting ID
  getApplicationsByJob: async (jobPostingId) => {
    try {
      const response = await api.get(`/applications?jobPostingId=${jobPostingId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get job applications')
    }
  }
}

// Document API
export const documentAPI = {
  // Upload document (JOB_SEEKER, STAFF)
  uploadDocument: async (file, programType, description) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('programType', programType)
      formData.append('description', description)
      
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload document')
    }
  },

  // List documents (JOB_SEEKER, STAFF)
  listDocuments: async () => {
    try {
      const response = await api.get('/documents')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get documents')
    }
  }
}

// Home API
export const homeAPI = {
  // Get root endpoint
  getRoot: async () => {
    try {
      const response = await api.get('/')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get root')
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Health check failed')
    }
  }
}

// Utility functions for role-based access control
export const roleUtils = {
  // Check if user has specific role
  hasRole: (userRoles, requiredRole) => {
    if (!userRoles || !Array.isArray(userRoles)) return false
    return userRoles.includes(requiredRole)
  },

  // Check if user has any of the required roles
  hasAnyRole: (userRoles, requiredRoles) => {
    if (!userRoles || !Array.isArray(userRoles)) return false
    if (!requiredRoles || !Array.isArray(requiredRoles)) return false
    return requiredRoles.some(role => userRoles.includes(role))
  },

  // Get user roles from localStorage
  getUserRoles: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.roles || []
    } catch (error) {
      return []
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Get current user
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch (error) {
      return {}
    }
  },

  // Get authentication status
  getAuthStatus: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    const userObj = user ? JSON.parse(user) : {}
    
    return {
      hasToken: !!token,
      hasUser: !!user,
      userData: userObj,
      userRoles: userObj.roles || [],
      isEmployer: userObj.roles?.includes('EMPLOYER') || false
    }
  }
}

// Role-based API access helpers
export const roleBasedAPI = {
  // Only for EMPLOYER role
  employerOnly: (apiCall) => {
    const userRoles = roleUtils.getUserRoles()
    if (!roleUtils.hasRole(userRoles, 'EMPLOYER')) {
      throw new Error('Access denied: EMPLOYER role required')
    }
    return apiCall
  },

  // Only for JOB_SEEKER role
  jobSeekerOnly: (apiCall) => {
    const userRoles = roleUtils.getUserRoles()
    if (!roleUtils.hasRole(userRoles, 'JOB_SEEKER')) {
      throw new Error('Access denied: JOB_SEEKER role required')
    }
    return apiCall
  },

  // Only for STAFF role
  staffOnly: (apiCall) => {
    const userRoles = roleUtils.getUserRoles()
    if (!roleUtils.hasRole(userRoles, 'STAFF')) {
      throw new Error('Access denied: STAFF role required')
    }
    return apiCall
  },

  // For multiple roles
  multiRole: (apiCall, allowedRoles) => {
    const userRoles = roleUtils.getUserRoles()
    if (!roleUtils.hasAnyRole(userRoles, allowedRoles)) {
      throw new Error(`Access denied: One of ${allowedRoles.join(', ')} roles required`)
    }
    return apiCall
  }
}

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  job: jobAPI,
  application: applicationAPI,
  document: documentAPI,
  home: homeAPI,
  roleUtils,
  roleBasedAPI
}
