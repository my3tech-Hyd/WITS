import { useState, useEffect } from 'react'
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Card,
  CardContent,
  Grid,
  Stack,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material'
import {
  Dashboard,
  Work,
  Add,
  People,
  Business,
  Person,
  Menu as MenuIcon,
  WorkOutline,
  TrendingUp,
  Notifications,
  Search,
  LocationOn,
  Visibility,
  Edit,
  KeyboardArrowDown,
  Pause,
  CheckBox,
  Delete,
  CalendarToday,
  Close,
  MoreVert,
  Block,
  Schedule,
  Event,
  Assignment,
  Star,
  Description
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { jobAPI, applicationAPI, roleUtils, userAPI, employerAPI } from '../../api/apiService.js'
import { 
  DashboardCard, 
  StatsCard, 
  JobCard, 
  AnimatedBox, 
  AnimatedTypography, 
  PrimaryButton, 
  SecondaryButton,
  StatusChip,
  PageContainer
} from '../../components/StyledComponents.jsx'

const drawerWidth = 280

// Dashboard Component
function DashboardHome() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    recentApplications: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        
        // Get authentication status
        roleUtils.getAuthStatus()
        
        // Get jobs and applications data
        const [jobsResponse, applicationsResponse] = await Promise.all([
          jobAPI.getAllJobs(),
          applicationAPI.listApplications()
        ])
        
        const jobs = jobsResponse || []
        const applications = applicationsResponse || []

        setStats({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          activeJobs: jobs.filter(job => job.status === 'ACTIVE').length,
          recentApplications: applications.filter(app => {
            const appDate = new Date(app.applicationDate)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return appDate > weekAgo
          }).length
        })
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
        // Don't set any fallback data - let it be empty if API fails
        setStats({
          totalJobs: 0,
          totalApplications: 0,
          activeJobs: 0,
          recentApplications: 0
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        Welcome back!
      </AnimatedTypography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.3}>
            <StatsCard 
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
                color: 'white', 
                cursor: 'pointer' 
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Work sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalJobs}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Jobs
                  </Typography>
                </Box>
              </Stack>
            </StatsCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <StatsCard 
              sx={{ 
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', 
                color: 'white', 
                cursor: 'pointer' 
              }}
            onClick={() => setSelectedTab('applicants')}
          >
              <Stack direction="row" alignItems="center" spacing={2}>
                <People sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalApplications}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Applications
                  </Typography>
                </Box>
              </Stack>
            </StatsCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.5}>
            <StatsCard 
              sx={{ 
                background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)', 
                color: 'white', 
                cursor: 'pointer' 
              }}
            onClick={() => setSelectedTab('job-postings')}
          >
              <Stack direction="row" alignItems="center" spacing={2}>
                <WorkOutline sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.activeJobs}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Jobs
                  </Typography>
                </Box>
              </Stack>
            </StatsCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.6}>
            <StatsCard 
              sx={{ 
                background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)', 
                color: 'white', 
                cursor: 'pointer' 
              }}
            onClick={() => setSelectedTab('applicants')}
          >
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUp sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.recentApplications}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Recent Applications
                  </Typography>
                </Box>
              </Stack>
            </StatsCard>
          </AnimatedBox>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnimatedBox animation="fadeInUp" delay={0.7}>
            <DashboardCard>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { bgcolor: 'grey.50' }
                }}>
                  <Typography variant="body2">New job application received</Typography>
                  <Chip label="2 min ago" size="small" />
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { bgcolor: 'grey.50' }
                }}>
                  <Typography variant="body2">Job posting published</Typography>
                  <Chip label="1 hour ago" size="small" />
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { bgcolor: 'grey.50' }
                }}>
                  <Typography variant="body2">Application status updated</Typography>
                  <Chip label="3 hours ago" size="small" />
                </Box>
              </Stack>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <AnimatedBox animation="fadeInUp" delay={0.8}>
            <DashboardCard>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { bgcolor: 'grey.50' }
                }}>
                  <Typography variant="body2">Post a new job</Typography>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => navigate('/employer/create-job')}
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { bgcolor: 'grey.50' }
                }}>
                  <Typography variant="body2">View applications</Typography>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => setSelectedTab('applicants')}
                  >
                    <People />
                  </IconButton>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { bgcolor: 'grey.50' }
                }}>
                  <Typography variant="body2">Update company profile</Typography>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => setSelectedTab('company')}
                  >
                    <Business />
                  </IconButton>
                </Box>
              </Stack>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

// My Job Postings Component
function MyJobPostings() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewJobModal, setViewJobModal] = useState({ open: false, job: null })
  const [editJobModal, setEditJobModal] = useState({ open: false, job: null, formData: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, job: null })
  const [actionMenu, setActionMenu] = useState({ open: false, anchorEl: null, job: null })
  const [editLoading, setEditLoading] = useState(false)
  const [editMessage, setEditMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [applicantsModal, setApplicantsModal] = useState({ open: false, job: null, applicants: [] })
  const [applicantsLoading, setApplicantsLoading] = useState(false)
  const [applicationStatuses, setApplicationStatuses] = useState([])
  const [interviewModal, setInterviewModal] = useState({ open: false, application: null, interviewData: null })
  const [interviewLoading, setInterviewLoading] = useState(false)
  const [documentContent, setDocumentContent] = useState({
    resume: null,
    coverLetter: null,
    loading: false,
    error: null
  })

  useEffect(() => {
      const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await jobAPI.getEmployerJobs()
      setJobs(response || [])
      console.log("All Jobs:",response);
    } catch (error) {
      console.error('Failed to load jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

    const loadApplicationStatuses = async () => {
      try {
        const statuses = await applicationAPI.getApplicationStatuses()
        setApplicationStatuses(statuses || [])
      } catch (error) {
        console.error('Failed to load application statuses:', error)
        // Fallback to hardcoded statuses if API fails
        setApplicationStatuses([
          'RECEIVED',
          'UNDER_REVIEW', 
          'INTERVIEW_SCHEDULED',
          'OFFERED',
          'REJECTED',
          'WITHDRAWN'
        ])
    }
  }

    loadJobs()
    loadApplicationStatuses()
  }, [])

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewJob = (job) => {
    setViewJobModal({ open: true, job })
  }

  const handleEditJob = (job) => {
    // Initialize form data with current job values
    const formData = {
      jobTitle: job.title || '',
      companyName: job.companyName || '',
      description: job.description || '',
      jobType: job.jobType || 'FULL_TIME',
      location: job.location || '',
      status: job.status || 'ACTIVE',
      minSalary: job.minSalary || '',
      maxSalary: job.maxSalary || '',
      requirements: job.requiredSkills || []
    }
    setEditJobModal({ open: true, job, formData })
  }

  const handleEditFormChange = (field, value) => {
    setEditJobModal(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }))
  }

  const handleEditSave = async () => {
    try {
      setEditLoading(true)
      setEditMessage('')
      
      // Transform form data to match API expectations
      const updateData = {
        jobTitle: editJobModal.formData.jobTitle,
        companyName: editJobModal.formData.companyName,
        description: editJobModal.formData.description,
        jobType: editJobModal.formData.jobType,
        location: editJobModal.formData.location,
        status: editJobModal.formData.status,
        minSalary: editJobModal.formData.minSalary ? parseFloat(editJobModal.formData.minSalary) : null,
        maxSalary: editJobModal.formData.maxSalary ? parseFloat(editJobModal.formData.maxSalary) : null,
        requirements: editJobModal.formData.requirements || []
      }
      
      await jobAPI.updateJob(editJobModal.job.id, updateData)
      
      // Update the job in the local state
      setJobs(prev => prev.map(job => 
        job.id === editJobModal.job.id 
          ? { 
              ...job, 
              title: updateData.jobTitle,
              companyName: updateData.companyName,
              description: updateData.description,
              jobType: updateData.jobType,
              location: updateData.location,
              status: updateData.status,
              minSalary: updateData.minSalary,
              maxSalary: updateData.maxSalary,
              requiredSkills: updateData.requirements
            }
          : job
      ))
      
      setEditJobModal({ open: false, job: null, formData: null })
      setEditMessage('Job updated successfully!')
      setSuccessMessage('Job updated successfully!')
    } catch (error) {
      console.error('Failed to update job:', error)
      setEditMessage(error.message || 'Failed to update job')
    } finally {
      setEditLoading(false)
    }
  }

  const handleViewApplicants = async (job) => {
    try {
      console.log('🔍 Loading applicants for job:', job.title)
      setApplicantsLoading(true)
      setApplicantsModal({ open: true, job, applicants: [] })
      
      // Load applicants for this job
      const applicants = await applicationAPI.getJobApplicationsWithUserDetails(job.id)
      console.log('🔍 Raw applicants data:', applicants)
      
      // Load complete JobSeeker details for each applicant
      const applicantsWithFullDetails = []
      for (const applicant of (applicants || [])) {
        try {
          const userId = applicant.application?.userId || applicant.user?.id
          if (userId) {
            console.log(`🔍 Loading JobSeeker details for user: ${userId}`)
            const userProfile = await userAPI.getUserProfileById(userId)
            console.log(`🔍 JobSeeker profile for user ${userId}:`, userProfile)
            
            applicantsWithFullDetails.push({
              ...applicant,
              jobSeekerProfile: userProfile?.jobSeeker,
              resumeDocumentId: userProfile?.resumeDocumentId,
              coverLetterDocumentId: userProfile?.coverLetterDocumentId,
              userProfile: userProfile
            })
          } else {
            console.warn('⚠️ No user ID found for applicant:', applicant)
            applicantsWithFullDetails.push(applicant)
          }
        } catch (error) {
          console.error(`❌ Failed to load JobSeeker details for applicant:`, error)
          applicantsWithFullDetails.push(applicant)
        }
      }
      
      console.log('🔍 Applicants with full details:', applicantsWithFullDetails)
      setApplicantsModal({ open: true, job, applicants: applicantsWithFullDetails })
    } catch (error) {
      console.error('❌ Failed to load applicants:', error)
      setApplicantsModal({ open: true, job, applicants: [] })
    } finally {
      setApplicantsLoading(false)
    }
  }

  const handleViewApplicantDetails = async (application) => {
    try {
      console.log('🔍 Loading full applicant details for:', application)
      
      // Get the user ID from the application
      const userId = application.application?.userId || application.user?.id
      console.log('🔍 User ID:', userId)
      
      if (!userId) {
        console.error('❌ No user ID found in application:', application)
        alert('No user ID found for this applicant')
        return
      }

      // Fetch complete applicant profile from JobSeeker table
      const userProfile = await userAPI.getUserProfileById(userId)
      console.log('✅ Complete applicant profile loaded:', userProfile)
      console.log('🔍 JobSeeker data:', userProfile?.jobSeeker)
      console.log('🔍 Resume document ID:', userProfile?.jobSeeker?.resumeDocumentId)
      console.log('🔍 Cover letter document ID:', userProfile?.jobSeeker?.coverLetterDocumentId)

      // Open the applicant details modal with complete data
      setApplicantsModal(prev => ({
        ...prev,
        selectedApplicant: {
          ...application,
          profile: userProfile,
          jobSeekerProfile: userProfile?.jobSeeker
        }
      }))
      
      console.log('✅ Applicant details modal opened with profile data')
    } catch (error) {
      console.error('❌ Failed to load applicant details:', error)
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      alert('Failed to load applicant details: ' + error.message)
    }
  }

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus)
      
      // Update the application status in the local state
      setApplicantsModal(prev => ({
        ...prev,
        applicants: prev.applicants.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      }))
      
      setSuccessMessage('Application status updated successfully!')
    } catch (error) {
      console.error('Failed to update application status:', error)
      setEditMessage('Failed to update application status: ' + error.message)
      
      // If backend is not available, just update the status locally
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        setApplicantsModal(prev => ({
          ...prev,
          applicants: prev.applicants.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        }))
        setSuccessMessage('Application status updated locally (backend not available)')
      }
    }
  }

  const handleScheduleInterview = (application) => {
    setInterviewModal({
      open: true,
      application,
      interviewData: {
        jobPostingId: application.jobPostingId,
        scheduledDateTime: '',
        location: '',
        interviewType: 'IN_PERSON',
        notes: ''
      }
    })
  }

  const handleInterviewFormChange = (field, value) => {
    setInterviewModal(prev => ({
      ...prev,
      interviewData: {
        ...prev.interviewData,
        [field]: value
      }
    }))
  }

  const handleSaveInterview = async () => {
    try {
      setInterviewLoading(true)
      
      await applicationAPI.scheduleInterview(
        interviewModal.application.id,
        interviewModal.interviewData
      )
      
      // Update the application status in the local state
      setApplicantsModal(prev => ({
        ...prev,
        applicants: prev.applicants.map(app => 
          app.id === interviewModal.application.id 
            ? { ...app, status: 'INTERVIEW_SCHEDULED' }
            : app
        )
      }))
      
      setInterviewModal({ open: false, application: null, interviewData: null })
      setSuccessMessage('Interview scheduled successfully!')
    } catch (error) {
      console.error('Failed to schedule interview:', error)
      setEditMessage('Failed to schedule interview: ' + error.message)
    } finally {
      setInterviewLoading(false)
    }
  }

  const handleScheduleInterviewWithDateTime = async (application) => {
    try {
      const interviewData = {
        jobPostingId: application.jobPostingId,
        scheduledDateTime: application.interviewDateTime,
        location: 'To be confirmed',
        interviewType: 'IN_PERSON',
        notes: 'Interview scheduled via status update'
      }
      
      await applicationAPI.scheduleInterview(application.id, interviewData)
      
      // Update the application status and hide the date picker
      setApplicantsModal(prev => ({
        ...prev,
        applicants: prev.applicants.map(app => 
          app.id === application.id 
            ? { ...app, status: 'INTERVIEW_SCHEDULED', showDateTimePicker: false, interviewDateTime: '' }
            : app
        )
      }))
      
      setSuccessMessage('Interview scheduled successfully!')
    } catch (error) {
      console.error('Failed to schedule interview:', error)
      setEditMessage('Failed to schedule interview: ' + error.message)
      
      // If backend is not available, just update the status locally
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        setApplicantsModal(prev => ({
          ...prev,
          applicants: prev.applicants.map(app => 
            app.id === application.id 
              ? { ...app, status: 'INTERVIEW_SCHEDULED', showDateTimePicker: false, interviewDateTime: '' }
              : app
          )
        }))
        setSuccessMessage('Interview status updated locally (backend not available)')
      }
    }
  }

  const handleJobAction = async (job, action) => {
    try {
      switch (action) {
        case 'activate':
          await jobAPI.updateJobStatus(job.id, 'ACTIVE')
          // Update job status in local state
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, status: 'ACTIVE' } : j
          ))
          setSuccessMessage('Job activated successfully!')
          break
        case 'deactivate':
          await jobAPI.updateJobStatus(job.id, 'INACTIVE')
          // Update job status in local state
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, status: 'INACTIVE' } : j
          ))
          setSuccessMessage('Job deactivated successfully!')
          break
        case 'hold':
          await jobAPI.updateJobStatus(job.id, 'HOLD')
          // Update job status in local state
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, status: 'HOLD' } : j
          ))
          setSuccessMessage('Job put on hold successfully!')
          break
        case 'delete':
          setDeleteConfirm({ open: true, job })
          break
        default:
          break
      }
    } catch (error) {
      console.error('Failed to perform job action:', error)
      setEditMessage('Failed to perform job action: ' + error.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await jobAPI.deleteJob(deleteConfirm.job.id)
      // Remove job from list
      setJobs(prev => prev.filter(job => job.id !== deleteConfirm.job.id))
      setDeleteConfirm({ open: false, job: null })
      setSuccessMessage('Job deleted successfully!')
    } catch (error) {
      console.error('Failed to delete job:', error)
      setEditMessage('Failed to delete job: ' + error.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'INACTIVE': return 'error'
      case 'HOLD': return 'warning'
      default: return 'default'
    }
  }

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED': return 'info'
      case 'UNDER_REVIEW': return 'warning'
      case 'INTERVIEW_SCHEDULED': return 'primary'
      case 'OFFERED': return 'success'
      case 'REJECTED': return 'error'
      case 'WITHDRAWN': return 'default'
      default: return 'info'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
  return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
          My Job Postings
      </AnimatedTypography>

      {successMessage && (
        <AnimatedBox animation="fadeInUp" delay={0.1} sx={{ mb: 3 }}>
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </AnimatedBox>
      )}

      {editMessage && (
        <AnimatedBox animation="fadeInUp" delay={0.1} sx={{ mb: 3 }}>
          <Alert severity="error" onClose={() => setEditMessage('')}>
            {editMessage}
          </Alert>
        </AnimatedBox>
      )}

      {/* Search Bar */}
      <AnimatedBox animation="fadeInUp" delay={0.3} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search jobs by title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </AnimatedBox>

      {/* Stats Cards */}
      <AnimatedBox animation="fadeInUp" delay={0.4} sx={{ mb: 4 }}>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                    {jobs.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Jobs
                  </Typography>
                </Box>
            </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {jobs.filter(job => job.status === 'ACTIVE').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Jobs
                </Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  {jobs.filter(job => job.status === 'HOLD').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Hold
                </Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                  {jobs.reduce((total, job) => total + (job.applications || 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Applications
                  </Typography>
                </Box>
            </DashboardCard>
        </Grid>
      </Grid>
      </AnimatedBox>

      {/* Jobs Table */}
      <AnimatedBox animation="fadeInUp" delay={0.5}>
        <DashboardCard>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Job Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Applications</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Posted Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchQuery ? 'No jobs found matching your search.' : 'No job postings yet.'}
          </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => ( 
                    <TableRow key={job.id} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {job.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {job.companyName|| 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {job.location}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.status}
                          color={getStatusColor(job.status)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {job.applications || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(job.postedDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewJob(job)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditJob(job)}
                            sx={{ color: 'secondary.main' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleViewApplicants(job)}
                            sx={{ color: 'info.main' }}
                          >
                            <People />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => setActionMenu({ open: true, anchorEl: e.currentTarget, job })}
                          >
                            <MoreVert />
                          </IconButton>
                </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardCard>
      </AnimatedBox>

      {/* View Job Modal */}
      <Dialog
        open={viewJobModal.open}
        onClose={() => setViewJobModal({ open: false, job: null })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Job Details
            </Typography>
            <Chip 
              label={viewJobModal.job?.status} 
              color={getStatusColor(viewJobModal.job?.status)}
              size="medium"
              sx={{ fontWeight: 600, px: 2 }}
            />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {viewJobModal.job && (
            <Box>
              {/* Header Section */}
              <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                  {viewJobModal.job.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {viewJobModal.job.companyName || viewJobModal.job.company}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {viewJobModal.job.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {viewJobModal.job.jobType?.replace('_', ' ') || 'Full Time'}
                    </Typography>
                  </Box>
                </Box>
                {viewJobModal.job.minSalary && viewJobModal.job.maxSalary && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                      ${viewJobModal.job.minSalary.toLocaleString()} - ${viewJobModal.job.maxSalary.toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Grid container spacing={4}>
                {/* Job Description */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                      <Assignment sx={{ mr: 1 }} />
                      Job Description
                    </Typography>
                    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {viewJobModal.job.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Required Skills */}
                  {viewJobModal.job.requiredSkills && viewJobModal.job.requiredSkills.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ mr: 1 }} />
                        Required Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {viewJobModal.job.requiredSkills.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="medium" 
                            color="primary" 
                            variant="filled"
                            sx={{ fontWeight: 500, px: 2 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>

                {/* Job Details Sidebar */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ position: 'sticky', top: 20 }}>
                    <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 3, mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                        Job Information
                      </Typography>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Posted Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(viewJobModal.job.postedDate)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Job Type
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {viewJobModal.job.jobType?.replace('_', ' ') || 'Full Time'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Location
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {viewJobModal.job.location}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Applications
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {viewJobModal.job.applications || 0} applicants
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Status
                          </Typography>
                          <Chip 
                            label={viewJobModal.job.status} 
                            color={getStatusColor(viewJobModal.job.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Stack>
                    </Box>

                    {/* Quick Actions */}
                
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setViewJobModal({ open: false, job: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog
        open={editJobModal.open}
        onClose={() => setEditJobModal({ open: false, job: null, formData: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Job Posting
          </Typography>
        </DialogTitle>
        <DialogContent>
          {editJobModal.formData && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                {/* Job Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    value={editJobModal.formData.jobTitle}
                    onChange={(e) => handleEditFormChange('jobTitle', e.target.value)}
                    required
                  />
                </Grid>

                {/* Company Name */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={editJobModal.formData.companyName}
                    onChange={(e) => handleEditFormChange('companyName', e.target.value)}
                    required
                  />
                </Grid>

                {/* Job Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Description"
                    value={editJobModal.formData.description}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>

                {/* Job Type and Location */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={editJobModal.formData.jobType}
                      onChange={(e) => handleEditFormChange('jobType', e.target.value)}
                      label="Job Type"
                    >
                      <MenuItem value="FULL_TIME">Full Time</MenuItem>
                      <MenuItem value="PART_TIME">Part Time</MenuItem>
                      <MenuItem value="CONTRACT">Contract</MenuItem>
                      <MenuItem value="INTERNSHIP">Internship</MenuItem>
                      <MenuItem value="TEMPORARY">Temporary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={editJobModal.formData.location}
                    onChange={(e) => handleEditFormChange('location', e.target.value)}
                    required
                  />
                </Grid>

                {/* Salary Range */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Salary"
                    type="number"
                    value={editJobModal.formData.minSalary || ''}
                    onChange={(e) => handleEditFormChange('minSalary', e.target.value)}
                    placeholder="50000"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Salary"
                    type="number"
                    value={editJobModal.formData.maxSalary || ''}
                    onChange={(e) => handleEditFormChange('maxSalary', e.target.value)}
                    placeholder="80000"
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editJobModal.formData.status}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                      <MenuItem value="HOLD">Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Required Skills */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Required Skills
              </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {editJobModal.formData.requirements?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => {
                          const newRequirements = editJobModal.formData.requirements.filter((_, i) => i !== index)
                          handleEditFormChange('requirements', newRequirements)
                        }}
                        deleteIcon={<Close />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Add Skill"
                      size="small"
                      sx={{ flexGrow: 1 }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const newSkill = e.target.value.trim()
                          if (newSkill && !editJobModal.formData.requirements?.includes(newSkill)) {
                            const newRequirements = [...(editJobModal.formData.requirements || []), newSkill]
                            handleEditFormChange('requirements', newRequirements)
                            e.target.value = ''
                          }
                        }
                      }}
                    />
                  </Stack>
                </Grid>

                {/* Error/Success Messages */}
                {editMessage && (
                  <Grid item xs={12}>
                    <Alert severity={editMessage.includes('successfully') ? 'success' : 'error'}>
                      {editMessage}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditJobModal({ open: false, job: null, formData: null })}
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditSave}
            disabled={editLoading || !editJobModal.formData?.jobTitle || !editJobModal.formData?.description}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Applicants Modal */}
      <Dialog
        open={applicantsModal.open}
        onClose={() => setApplicantsModal({ open: false, job: null, applicants: [] })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Applicants for {applicantsModal.job?.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${applicantsModal.applicants.length} applicants`}
                color="primary"
                size="medium"
                sx={{ fontWeight: 600 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  console.log('🔍 Applicants Modal Data:', {
                    job: applicantsModal.job,
                    applicants: applicantsModal.applicants,
                    applicantsCount: applicantsModal.applicants.length
                  })
                  alert(`Debug: ${applicantsModal.applicants.length} applicants loaded. Check console for details.`)
                }}
              >
                Debug
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {applicantsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : applicantsModal.applicants.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No applicants yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Applicants will appear here once they apply for this position.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {applicantsModal.applicants.map((application, index) => (
                <Grid item xs={12} key={application.id || index}>
                  <Card sx={{ 
                    p: 3, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 3,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main'
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                            {application.jobSeekerProfile?.firstName?.charAt(0) || application.user?.firstName?.charAt(0) || 'U'}
                          </Typography>
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {application.jobSeekerProfile?.firstName} {application.jobSeekerProfile?.lastName} || {application.user?.firstName} {application.user?.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {application.jobSeekerProfile?.email || application.user?.email}
                          </Typography>
                          {application.jobSeekerProfile?.profileCompletionPercent && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Profile: {Math.round(application.jobSeekerProfile.profileCompletionPercent)}% Complete
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={application.jobSeekerProfile.profileCompletionPercent}
                                sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                      {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip 
                          label={application.status?.replace('_', ' ')} 
                          color={getApplicationStatusColor(application.status)}
                          size="medium"
                          sx={{ fontWeight: 600 }}
                        />
                      
                      </Box> */}
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Phone
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {application.jobSeekerProfile?.phoneNumber || application.user?.phone || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Applied Date
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatDate(application.applicationDate)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Location
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {application.jobSeekerProfile?.address || application.user?.address || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Education
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {application.jobSeekerProfile?.education || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Additional JobSeeker Information */}
                    {(application.jobSeekerProfile?.skills || application.jobSeekerProfile?.certifications || application.jobSeekerProfile?.expectedSalary) && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Grid container spacing={2}>
                          {application.jobSeekerProfile?.skills && application.jobSeekerProfile.skills.length > 0 && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Skills
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {application.jobSeekerProfile.skills.slice(0, 3).map((skill, index) => (
                                  <Chip key={index} label={skill} size="small" color="primary" variant="outlined" />
                                ))}
                                {application.jobSeekerProfile.skills.length > 3 && (
                                  <Chip label={`+${application.jobSeekerProfile.skills.length - 3} more`} size="small" color="default" variant="outlined" />
                                )}
                              </Box>
                            </Grid>
                          )}
                          {application.jobSeekerProfile?.certifications && application.jobSeekerProfile.certifications.length > 0 && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Certifications
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {application.jobSeekerProfile.certifications.slice(0, 2).map((cert, index) => (
                                  <Chip key={index} label={cert} size="small" color="secondary" variant="outlined" />
                                ))}
                                {application.jobSeekerProfile.certifications.length > 2 && (
                                  <Chip label={`+${application.jobSeekerProfile.certifications.length - 2} more`} size="small" color="default" variant="outlined" />
                                )}
                              </Box>
                            </Grid>
                          )}
                          {application.jobSeekerProfile?.expectedSalary && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Expected Salary
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                                ${application.jobSeekerProfile.expectedSalary.toLocaleString()}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setApplicantsModal({ open: false, job: null, applicants: [] })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
                              

      {/* Interview Scheduling Modal */}
      <Dialog
        open={interviewModal.open}
        onClose={() => setInterviewModal({ open: false, application: null, interviewData: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Schedule Interview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Schedule interview for {interviewModal.application?.user?.firstName} {interviewModal.application?.user?.lastName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {interviewModal.interviewData && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date & Time"
                    type="datetime-local"
                    value={interviewModal.interviewData.scheduledDateTime}
                    onChange={(e) => handleInterviewFormChange('scheduledDateTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Interview Type</InputLabel>
                    <Select
                      value={interviewModal.interviewData.interviewType}
                      onChange={(e) => handleInterviewFormChange('interviewType', e.target.value)}
                      label="Interview Type"
                    >
                      <MenuItem value="IN_PERSON">In Person</MenuItem>
                      <MenuItem value="VIDEO_CALL">Video Call</MenuItem>
                      <MenuItem value="PHONE">Phone</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location/Meeting Link"
                    value={interviewModal.interviewData.location}
                    onChange={(e) => handleInterviewFormChange('location', e.target.value)}
                    placeholder={interviewModal.interviewData.interviewType === 'IN_PERSON' ? 'Office address' : 'Meeting link or phone number'}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={interviewModal.interviewData.notes}
                    onChange={(e) => handleInterviewFormChange('notes', e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Additional notes for the candidate..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setInterviewModal({ open: false, application: null, interviewData: null })}
            disabled={interviewLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveInterview}
            disabled={interviewLoading || !interviewModal.interviewData?.scheduledDateTime || !interviewModal.interviewData?.location}
          >
            {interviewLoading ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenu.anchorEl}
        open={actionMenu.open}
        onClose={() => setActionMenu({ open: false, anchorEl: null, job: null })}
      >
        <MenuItem onClick={() => {
          handleJobAction(actionMenu.job, 'activate')
          setActionMenu({ open: false, anchorEl: null, job: null })
        }}>
          <ListItemIcon>
            <CheckBox fontSize="small" />
          </ListItemIcon>
          Activate
        </MenuItem>
        <MenuItem onClick={() => {
          handleJobAction(actionMenu.job, 'deactivate')
          setActionMenu({ open: false, anchorEl: null, job: null })
        }}>
          <ListItemIcon>
            <Block fontSize="small" />
          </ListItemIcon>
          Deactivate
        </MenuItem>
        <MenuItem onClick={() => {
          handleJobAction(actionMenu.job, 'hold')
          setActionMenu({ open: false, anchorEl: null, job: null })
        }}>
          <ListItemIcon>
            <Pause fontSize="small" />
          </ListItemIcon>
          Hold
        </MenuItem>
        <MenuItem onClick={() => {
          setActionMenu({ open: false, anchorEl: null, job: null })
          setDeleteConfirm({ open: true, job: actionMenu.job })
        }}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, job: null })}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the job "{deleteConfirm.job?.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, job: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}
// List New Vacancy Component
function ListNewVacancy() {
  const [form, setForm] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: '',
    salary: '',
    description: '',
    requirements: [],
    qualifications: []
  })
  const [requirementInput, setRequirementInput] = useState('')
  const [qualificationInput, setQualificationInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [companyData, setCompanyData] = useState(null)

  // Removed loadCompanyData to avoid 404 errors

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addRequirement = () => {
    if (requirementInput.trim() && !form.requirements.includes(requirementInput.trim())) {
      setForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }))
      setRequirementInput('')
    }
  }

  const removeRequirement = (requirementToRemove) => {
    setForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirementToRemove)
    }))
  }

  const addQualification = () => {
    if (qualificationInput.trim() && !form.qualifications.includes(qualificationInput.trim())) {
      setForm(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, qualificationInput.trim()]
      }))
      setQualificationInput('')
    }
  }

  const removeQualification = (qualificationToRemove) => {
    setForm(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(qual => qual !== qualificationToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    setLoading(true)

    try {
      // Submit job posting to database
      await jobAPI.createJob(form)
      setMsg('Job posting created successfully!')
      // Reset form
      setForm({
        jobTitle: '',
        companyName: companyData?.name || '',
        location: '',
        jobType: '',
        salary: '',
        description: '',
        requirements: [],
        qualifications: []
      })
    } catch (error) {
      setErr(error.message || 'Failed to create job posting')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        List New Vacancy
      </AnimatedTypography>

      {msg && (
        <AnimatedBox animation="fadeInUp" delay={0.1}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {msg}
          </Alert>
        </AnimatedBox>
      )}

      {err && (
        <AnimatedBox animation="fadeInUp" delay={0.1}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {err}
          </Alert>
        </AnimatedBox>
      )}

      <AnimatedBox animation="fadeInUp" delay={0.3}>
        <DashboardCard sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Basic Information
      </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={onChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={form.companyName}
                  onChange={onChange}
                  required
                  disabled={!!companyData?.name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  required
                  placeholder="e.g., New York, NY"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Job Type"
                  name="jobType"
                  value={form.jobType}
                  onChange={onChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="FULL_TIME">Full Time</MenuItem>
                  <MenuItem value="PART_TIME">Part Time</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                  <MenuItem value="INTERNSHIP">Internship</MenuItem>
                  <MenuItem value="REMOTE">Remote</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salary Range"
                  name="salary"
                  value={form.salary}
                  onChange={onChange}
                  placeholder="e.g., $50,000 - $70,000"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Job Description */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Job Description
          </Typography>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  multiline
                  rows={6}
                  required
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Requirements Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Requirements & Skills
          </Typography>
                
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Add Requirement"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      size="small"
                      sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      placeholder="e.g., 3+ years of experience"
                    />
                    <Button
                      variant="contained"
                      onClick={addRequirement}
                      startIcon={<Add />}
                      disabled={!requirementInput.trim()}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Add
                    </Button>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
                    {form.requirements.map((requirement, index) => (
                      <Chip
                        key={index}
                        label={requirement}
                        onDelete={() => removeRequirement(requirement)}
                        deleteIcon={<Close />}
            color="primary" 
                        variant="filled"
                        sx={{ borderRadius: 2, fontWeight: 500 }}
                      />
                    ))}
                    {form.requirements.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No requirements added yet
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>

              {/* Qualifications Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                  Qualifications & Education
                </Typography>
                
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Add Qualification"
                      value={qualificationInput}
                      onChange={(e) => setQualificationInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                      size="small"
                      sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      placeholder="e.g., Bachelor's degree in Computer Science"
                    />
                    <Button
                      variant="contained"
                      onClick={addQualification}
                      startIcon={<Add />}
                      disabled={!qualificationInput.trim()}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Add
                    </Button>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
                    {form.qualifications.map((qualification, index) => (
                      <Chip
                        key={index}
                        label={qualification}
                        onDelete={() => removeQualification(qualification)}
                        deleteIcon={<Close />}
                        color="secondary"
                        variant="filled"
                        sx={{ borderRadius: 2, fontWeight: 500 }}
                      />
                    ))}
                    {form.qualifications.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No qualifications added yet
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pt: 2 }}>
                  <PrimaryButton
                    type="submit"
                    disabled={loading}
            sx={{ 
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      minWidth: 200
                    }}
                  >
                    {loading ? 'Creating Job Posting...' : 'Create Job Posting'}
                  </PrimaryButton>
    </Box>
              </Grid>
            </Grid>
          </form>
        </DashboardCard>
      </AnimatedBox>
    </PageContainer>
  )
}

// View Applicants Component
function ViewApplicants() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [applicationStatuses, setApplicationStatuses] = useState([])
  const [profileModal, setProfileModal] = useState({ open: false, applicant: null })
  const [contactModal, setContactModal] = useState({ open: false, applicant: null, userProfile: null, loading: false, error: null })
  const [rejectionModal, setRejectionModal] = useState({ open: false, applicationId: null, rejectReason: '' })
  const [applicantsModal, setApplicantsModal] = useState({ 
    open: false, 
    job: null, 
    applicants: [], 
    selectedApplicant: null 
  })
  const [filters, setFilters] = useState({
    status: 'All Statuses',
    job: 'All Jobs'
  })

  const [documentContent, setDocumentContent] = useState({
    resume: null,
    coverLetter: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    const loadApplications = async () => {
      try {
        console.log('🔍 Starting to load applications...')
        setLoading(true)
        
        // Get all jobs for the current employer first
        const jobsResponse = await jobAPI.getEmployerJobs()
        console.log('🔍 Jobs loaded:', jobsResponse)
        const jobs = jobsResponse || []
        
        // Fetch applications for each job with complete details
        const allApplications = []
        for (const job of jobs) {
          try {
            console.log(`🔍 Loading applications for job: ${job.title} (ID: ${job.id})`)
            const jobApplications = await applicationAPI.getJobApplicationsWithUserDetails(job.id)
            console.log(`🔍 Applications for job ${job.title}:`, jobApplications)
            
            if (jobApplications && jobApplications.length > 0) {
              // Add job information to each application
              const applicationsWithJobInfo = jobApplications.map(app => ({
                ...app,
                jobTitle: job.title,
                companyName: job.companyName || job.company,
                jobId: job.id
              }))
              allApplications.push(...applicationsWithJobInfo)
            }
          } catch (error) {
            console.error(`❌ Failed to load applications for job ${job.id}:`, error)
          }
        }
        
        console.log('🔍 Total applications loaded:', allApplications.length)
        console.log('🔍 Applications data:', allApplications)
        setApplications(allApplications)
      } catch (error) {
        console.error('❌ Failed to load applications:', error)
        setApplications([])
      } finally {
        setLoading(false)
        console.log('🔍 Loading finished')
      }
    }

    const loadApplicationStatuses = async () => {
      try {
        const statuses = await applicationAPI.getApplicationStatuses()
        setApplicationStatuses(statuses || [])
      } catch (error) {
        console.error('Failed to load application statuses:', error)
        // Fallback to hardcoded statuses if API fails
        setApplicationStatuses([
          'RECEIVED',
          'UNDER_REVIEW', 
          'INTERVIEW_SCHEDULED',
          'OFFERED',
          'REJECTED'
        ])
      }
    }

    loadApplications()
    loadApplicationStatuses()
  }, [])

  const filteredApplications = applications.filter(app => {
    const status = app.application?.status || app.status
    const jobTitle = app.jobTitle || 'Unknown Job'
    
    if (filters.status !== 'All Statuses' && status !== filters.status) return false
    if (filters.job !== 'All Jobs' && jobTitle !== filters.job) return false
    return true
  })

  const totalApplications = applications.length
  const filteredCount = filteredApplications.length

  const handleUpdateApplicationStatus = async (applicationId, newStatus, rejectReason = null) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus, rejectReason)
      
      // Update the application status in the local state
      setApplications(prev => prev.map(app => {
        const appId = app.application?.id || app.id
        if (appId === applicationId) {
          return {
            ...app,
            application: {
              ...app.application,
              status: newStatus,
              rejectReason: rejectReason
            }
          }
        }
        return app
      }))
      
      // Show success message (you can add a state for this)
      console.log('Application status updated successfully!')
    } catch (error) {
      console.error('Failed to update application status:', error)
      // If backend is not available, just update the status locally
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        setApplications(prev => prev.map(app => {
          const appId = app.application?.id || app.id
          if (appId === applicationId) {
            return {
              ...app,
              application: {
                ...app.application,
                status: newStatus,
                rejectReason: rejectReason
              }
            }
          }
          return app
        }))
        console.log('Application status updated locally (backend not available)')
      }
    }
  }

  const handleRejectionWithReason = async () => {
    if (!rejectionModal.rejectReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    
    try {
      await handleUpdateApplicationStatus(rejectionModal.applicationId, 'REJECTED', rejectionModal.rejectReason.trim())
      setRejectionModal({ open: false, applicationId: null, rejectReason: '' })
    } catch (error) {
      console.error('Failed to reject application:', error)
      alert('Failed to reject application: ' + error.message)
    }
  }

  const handleScheduleInterviewWithDateTime = async (application) => {
    try {
      const interviewData = {
        jobPostingId: application.jobPostingId || application.application?.jobPostingId,
        scheduledDateTime: application.interviewDateTime,
        location: 'To be confirmed',
        interviewType: 'IN_PERSON',
        notes: 'Interview scheduled via status update'
      }
      
      await applicationAPI.scheduleInterview(application.application?.id || application.id, interviewData)
      
      // Update the application status and hide the date picker
      setApplications(prev => prev.map(app => {
        const appId = app.application?.id || app.id
        const currentAppId = application.application?.id || application.id
        if (appId === currentAppId) {
          return {
            ...app,
            application: {
              ...app.application,
              status: 'INTERVIEW_SCHEDULED'
            },
            showDateTimePicker: false,
            interviewDateTime: ''
          }
        }
        return app
      }))
      
      console.log('Interview scheduled successfully!')
    } catch (error) {
      console.error('Failed to schedule interview:', error)
      // If backend is not available, just update the status locally
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        setApplications(prev => prev.map(app => {
          const appId = app.application?.id || app.id
          const currentAppId = application.application?.id || application.id
          if (appId === currentAppId) {
            return {
              ...app,
              application: {
                ...app.application,
                status: 'INTERVIEW_SCHEDULED'
              },
              showDateTimePicker: false,
              interviewDateTime: ''
            }
          }
          return app
        }))
        console.log('Interview status updated locally (backend not available)')
      }
    }
  }

  const handleViewProfile = async (applicant) => {
    try {
      console.log('🔍 Loading complete profile for applicant:', applicant)
      
      // Get the user ID from the application
      const userId = applicant.application?.userId || applicant.user?.id
      if (!userId) {
        console.error('❌ No user ID found in application:', applicant)
        setProfileModal({
          open: true,
          applicant,
          loading: false,
          error: 'No user ID found'
        })
        return
      }

      setProfileModal({
        open: true,
        applicant,
        loading: true,
        error: null
      })

      // Fetch complete user profile
      const userProfile = await userAPI.getUserProfileById(userId)
      console.log('✅ Complete user profile loaded:', userProfile)
      console.log('🔍 JobSeeker data:', userProfile?.jobSeeker)
      console.log('🔍 Resume document:', userProfile?.resumeDocument)
      console.log('🔍 Cover letter document:', userProfile?.coverLetterDocument)

      setProfileModal({
        open: true,
        applicant,
        userProfile,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('❌ Failed to load user profile:', error)
      setProfileModal({
        open: true,
        applicant,
        loading: false,
        error: error.message
      })
    }
  }

  const handleContact = async (applicant) => {
    try {
      console.log('📞 Loading contact information for:', applicant)
      
      // Set loading state
      setContactModal({
        open: true,
        applicant,
        userProfile: null,
        loading: true,
        error: null
      })

      // Get the user ID from the application
      const userId = applicant.application?.userId || applicant.user?.id
      if (!userId) {
        console.error('❌ No user ID found in application:', applicant)
        setContactModal(prev => ({
          ...prev,
          loading: false,
          error: 'No user ID found for this applicant'
        }))
        return
      }

      // Fetch complete applicant profile from JobSeeker table
      const userProfile = await userAPI.getUserProfileById(userId)
      console.log('✅ Contact profile loaded:', userProfile)

      // Update modal with complete data
      setContactModal(prev => ({
        ...prev,
        userProfile,
        loading: false,
        error: null
      }))
    } catch (error) {
      console.error('❌ Failed to load contact information:', error)
      setContactModal(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load contact information: ' + error.message
      }))
    }
  }

  const handleViewApplicantDetails = async (application) => {
    try {
      console.log('🔍 Loading applicant details for:', application)
      
      // Get the user ID from the application
      const userId = application.application?.userId || application.user?.id
      if (!userId) {
        console.error('❌ No user ID found in application:', application)
        alert('No user ID found for this applicant')
        return
      }

      // Fetch complete applicant profile from JobSeeker table
      const applicantProfile = await userAPI.getUserProfileById(userId)
      console.log('✅ Applicant profile loaded:', applicantProfile)

      // Open the applicant details modal with complete data
      setApplicantsModal(prev => ({
        ...prev,
        selectedApplicant: {
          ...application,
          profile: applicantProfile
        }
      }))
    } catch (error) {
      console.error('❌ Failed to load applicant details:', error)
      alert('Failed to load applicant details: ' + error.message)
    }
  }

  const handleDownloadResume = async (userId) => {
    try {
      console.log('📄 Downloading resume for user:', userId)
      
      // Check if user has a resume document ID
      const applicantProfile = await userAPI.getUserProfileById(userId)
      if (!applicantProfile?.resumeDocumentId) {
        alert('No resume document found for this applicant')
        return
      }
      
      console.log('📄 Resume document ID:', applicantProfile.resumeDocumentId)
      const blob = await userAPI.downloadResume(userId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `resume_${userId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('✅ Resume downloaded successfully')
    } catch (error) {
      console.error('❌ Failed to download resume:', error)
      if (error.message.includes('404')) {
        alert('Resume document not found. The applicant may not have uploaded a resume.')
      } else {
        alert('Failed to download resume: ' + error.message)
      }
    }
  }

  const handleDownloadCoverLetter = async (userId) => {
    try {
      console.log('📄 Downloading cover letter for user:', userId)
      
      // Check if user has a cover letter document ID
      const applicantProfile = await userAPI.getUserProfileById(userId)
      if (!applicantProfile?.coverLetterDocumentId) {
        alert('No cover letter document found for this applicant')
        return
      }
      
      console.log('📄 Cover letter document ID:', applicantProfile.coverLetterDocumentId)
      const blob = await userAPI.downloadCoverLetter(userId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cover_letter_${userId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('✅ Cover letter downloaded successfully')
    } catch (error) {
      console.error('❌ Failed to download cover letter:', error)
      if (error.message.includes('404')) {
        alert('Cover letter document not found. The applicant may not have uploaded a cover letter.')
      } else {
        alert('Failed to download cover letter: ' + error.message)
      }
    }
  }

  const loadDocumentContent = async (userId, documentType) => {
    try {
      console.log(`📄 Loading ${documentType} content for user:`, userId);
      setDocumentContent(prev => ({ ...prev, loading: true, error: null }));
      
      let blob;
      if (documentType === 'resume') {
        blob = await userAPI.downloadResume(userId);
      } else if (documentType === 'coverLetter') {
        blob = await userAPI.downloadCoverLetter(userId);
      }
      
      // Convert blob to text for display
      const text = await blob.text();
      console.log(`✅ ${documentType} content loaded:`, text.substring(0, 100) + '...');
      
      setDocumentContent(prev => ({
        ...prev,
        [documentType]: text,
        loading: false
      }));
    } catch (error) {
      console.error(`❌ Failed to load ${documentType}:`, error);
      setDocumentContent(prev => ({
        ...prev,
        loading: false,
        error: `Failed to load ${documentType}: ${error.message}`
      }));
    }
  };

  const openDocumentInNewTab = async (userId, documentType) => {
    try {
      console.log(`📄 Opening ${documentType} in new tab for user:`, userId)
      
      // Check if document exists
      const applicantProfile = await userAPI.getUserProfileById(userId)
      console.log(`🔍 Applicant profile:`, applicantProfile)
      console.log(`🔍 JobSeeker data:`, applicantProfile?.jobSeeker)
      
      const documentId = documentType === 'resume' ? 
        applicantProfile?.jobSeeker?.resumeDocumentId || applicantProfile?.resumeDocumentId : 
        applicantProfile?.jobSeeker?.coverLetterDocumentId || applicantProfile?.coverLetterDocumentId
      
      console.log(`🔍 Document ID for ${documentType}:`, documentId)
      
      if (!documentId) {
        console.warn(`⚠️ No ${documentType} document ID found`)
        console.log(`🔍 Full profile structure:`, JSON.stringify(applicantProfile, null, 2))
        alert(`No ${documentType} document found for this applicant`)
        return
      }
      
      // Get the document blob
      let blob
      if (documentType === 'resume') {
        console.log(`📄 Downloading resume for user: ${userId}`)
        blob = await userAPI.downloadResume(userId)
      } else if (documentType === 'coverLetter') {
        console.log(`📄 Downloading cover letter for user: ${userId}`)
        blob = await userAPI.downloadCoverLetter(userId)
      }
      
      console.log(`✅ Document blob received:`, blob)
      console.log(`📄 Blob size:`, blob.size)
      console.log(`📄 Blob type:`, blob.type)
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)
      console.log(`📄 Created blob URL:`, url)
      
      // Open in new tab
      const newTab = window.open(url, '_blank')
      
      if (newTab) {
        console.log(`✅ ${documentType} opened in new tab successfully`)
      } else {
        console.warn(`⚠️ Popup blocked, trying to download instead`)
        // Fallback to download if popup is blocked
        const link = document.createElement('a')
        link.href = url
        link.download = `${documentType}_${userId}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      // Clean up the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        console.log(`🧹 Cleaned up blob URL`)
      }, 1000)
      
    } catch (error) {
      console.error(`❌ Failed to open ${documentType}:`, error)
      console.error(`❌ Error details:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      })
      alert(`Failed to open ${documentType}: ${error.message}`)
    }
  }

  // Helper function to get application status color
  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED': return 'info'
      case 'UNDER_REVIEW': return 'warning'
      case 'INTERVIEW_SCHEDULED': return 'primary'
      case 'OFFERED': return 'success'
      case 'REJECTED': return 'error'
      default: return 'info'
    }
  }

  if (loading) {
  return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        Applications ({totalApplications})
      </AnimatedTypography>

      {/* Debug Section */}
    

      {/* Filters and Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.3}>
            <DashboardCard sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Filter by Status
      </Typography>
              <TextField
                select
                fullWidth
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                size="small"
              >
                <MenuItem value="All Statuses">All Statuses</MenuItem>
                <MenuItem value="RECEIVED">Received</MenuItem>
                <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                <MenuItem value="INTERVIEW_SCHEDULED">Interview Scheduled</MenuItem>
                <MenuItem value="OFFERED">Offered</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </TextField>
            </DashboardCard>
          </AnimatedBox>
        </Grid>

        <Grid item xs={12} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <DashboardCard sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Filter by Job
          </Typography>
              <TextField
                select
                fullWidth
                value={filters.job}
                onChange={(e) => setFilters(prev => ({ ...prev, job: e.target.value }))}
                size="small"
              >
                <MenuItem value="All Jobs">All Jobs</MenuItem>
                {Array.from(new Set(applications.map(app => app.jobTitle || 'Unknown Job'))).map(jobTitle => (
                  <MenuItem key={jobTitle} value={jobTitle}>{jobTitle}</MenuItem>
                ))}
              </TextField>
            </DashboardCard>
          </AnimatedBox>
        </Grid>

        <Grid item xs={12} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.5}>
            <StatsCard sx={{ textAlign: 'center', p: 2 }}>
              <People sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {totalApplications}
              </Typography>
                  <Typography variant="body2" color="text.secondary">
                Total Applications
              </Typography>
            </StatsCard>
          </AnimatedBox>
        </Grid>

        <Grid item xs={12} md={3}>
          <AnimatedBox animation="fadeInUp" delay={0.6}>
            <StatsCard sx={{ textAlign: 'center', p: 2 }}>
              <CalendarToday sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {filteredCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </StatsCard>
          </AnimatedBox>
        </Grid>
      </Grid>

      {/* Applications List */}
      <AnimatedBox animation="fadeInUp" delay={0.7}>
        <DashboardCard>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Applications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredCount} application(s) found
                  </Typography>
                </Box>

          <Box sx={{ p: 3 }}>
            {filteredApplications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No applications found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {applications.length === 0 ? 'No applications have been submitted yet.' : 'No applications match your current filters.'}
                </Typography>
                
                {/* Add sample data for testing */}
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    const sampleApplications = [
                      {
                        id: 'sample-1',
                        application: {
                          id: 'app-1',
                          status: 'RECEIVED',
                          applicationDate: new Date().toISOString(),
                          userId: 'user-1'
                        },
                        applicantName: 'John Doe',
                        email: 'john.doe@example.com',
                        phoneNumber: '+1-555-0123',
                        location: 'New York, NY',
                        jobTitle: 'Software Developer',
                        companyName: 'Tech Corp',
                        education: 'Bachelor in Computer Science',
                        skills: ['JavaScript', 'React', 'Node.js'],
                        certifications: ['AWS Certified Developer']
                      },
                      {
                        id: 'sample-2',
                        application: {
                          id: 'app-2',
                          status: 'UNDER_REVIEW',
                          applicationDate: new Date().toISOString(),
                          userId: 'user-2'
                        },
                        applicantName: 'Jane Smith',
                        email: 'jane.smith@example.com',
                        phoneNumber: '+1-555-0456',
                        location: 'San Francisco, CA',
                        jobTitle: 'Data Analyst',
                        companyName: 'Data Corp',
                        education: 'Master in Data Science',
                        skills: ['Python', 'SQL', 'Tableau'],
                        certifications: ['Google Data Analytics']
                      }
                    ]
                    setApplications(sampleApplications)
                    console.log('🔍 Sample data loaded:', sampleApplications)
                  }}
                >
                  Load Sample Data (Testing)
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {filteredApplications.map((application) => (
                  <Box
                    key={application.application?.id || application.id}
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {application.applicantName || 'Applicant'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Chip
                            label={application.application?.status || application.status || 'RECEIVED'}
                            color={getApplicationStatusColor(application.application?.status || application.status)}
                            size="small"
                          />
                          <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 500 }}>
                            {Math.floor(Math.random() * 30) + 70}% Match
                          </Typography>
                        </Box>
                       
                        <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                          {application.jobTitle || 'Job Title'}
                        </Typography>
                  <Typography variant="body2" color="text.secondary">
                          {application.companyName || 'Company Name'}
                  </Typography>
                </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Email:
                          </Typography>
                          <Typography variant="body2">
                            {application.email || 'email@example.com'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Location:
                          </Typography>
                          <Typography variant="body2">
                            {application.location || 'Location'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Phone:
                          </Typography>
                          <Typography variant="body2">
                            {application.phoneNumber || '+1-555-0000'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Applied:
                          </Typography>
                          <Typography variant="body2">
                            {application.application?.applicationDate ?
                              new Date(application.application.applicationDate).toLocaleDateString() :
                              new Date().toLocaleDateString()}
                          </Typography>
                        </Box>
                         {/* Show rejection reason if status is REJECTED */}
                         {(application.application?.status === 'REJECTED' || application.status === 'REJECTED') && 
                         (application.application?.rejectReason || application.rejectReason) && (
                          <Box sx={{mt: 1, p: 1, borderRadius: 1, border: '0.5px solid', borderColor: 'error.main' }}>
                            <Typography variant="body2" sx={{ color: 'error.dark', fontWeight: 500, mb: 0.5 }}>
                              Rejection Reason: {application.application?.rejectReason || application.rejectReason}

                            </Typography>
                            {/* <Typography variant="body2" sx={{ color: 'error.dark' }}>
                            </Typography> */}
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    {/* Additional applicant information */}
                    {(application.education || application.skills || application.certifications) && (
                      <Box sx={{ mb: 2 }}>
                        {application.education && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Education:
                            </Typography>
                            <Typography variant="body2">
                              {application.education}
                            </Typography>
                          </Box>
                        )}
                        {application.skills && application.skills.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Skills:
                            </Typography>
                            <Typography variant="body2">
                              {application.skills.join(', ')}
                            </Typography>
                          </Box>
                        )}
                        {application.certifications && application.certifications.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Certifications:
                            </Typography>
                            <Typography variant="body2">
                              {application.certifications.join(', ')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={application.application?.status || application.status || 'RECEIVED'}
                          onChange={(e) => {
                            const newStatus = e.target.value
                            if (newStatus === 'INTERVIEW_SCHEDULED') {
                              // Show date/time picker inline
                              setApplications(prev => prev.map(app => {
                                const appId = app.application?.id || app.id
                                const currentAppId = application.application?.id || application.id
                                if (appId === currentAppId) {
                                  return { 
                                    ...app, 
                                    application: { ...app.application, status: newStatus },
                                    showDateTimePicker: true 
                                  }
                                }
                                return app
                              }))
                            } else if (newStatus === 'REJECTED') {
                              // Show rejection reason modal
                              setRejectionModal({
                                open: true,
                                applicationId: application.application?.id || application.id,
                                rejectReason: ''
                              })
                            } else {
                              handleUpdateApplicationStatus(application.application?.id || application.id, newStatus)
                            }
                          }}
                          sx={{ minWidth: 120 }}
                        >
                          {applicationStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status.replace('_', ' ')}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
               
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleContact(application)}
                      >
                        Contact
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Visibility />}
                        onClick={() => handleViewApplicantDetails(application)}
                      >
                        View Details
                      </Button>
                    </Box>
                    {application.showDateTimePicker && (
                      <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Schedule Interview
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <TextField
                            size="small"
                            type="datetime-local"
                            label="Interview Date & Time"
                            value={application.interviewDateTime || ''}
                            onChange={(e) => {
                              setApplications(prev => prev.map(app => {
                                const appId = app.application?.id || app.id
                                const currentAppId = application.application?.id || application.id
                                if (appId === currentAppId) {
                                  return { ...app, interviewDateTime: e.target.value }
                                }
                                return app
                              }))
                            }}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 200 }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleScheduleInterviewWithDateTime(application)}
                            disabled={!application.interviewDateTime}
                          >
                            Schedule
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setApplications(prev => prev.map(app => {
                                const appId = app.application?.id || app.id
                                const currentAppId = application.application?.id || application.id
                                if (appId === currentAppId) {
                                  return { 
                                    ...app, 
                                    showDateTimePicker: false, 
                                    interviewDateTime: '' 
                                  }
                                }
                                return app
                              }))
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    )}
            </Box>
          ))}
              </Stack>
            )}
    </Box>
        </DashboardCard>
      </AnimatedBox>

      {/* Profile Modal */}
      <Dialog
        open={profileModal.open}
        onClose={() => setProfileModal({ open: false, applicant: null, userProfile: null, loading: false, error: null })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Applicant Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileModal.applicant?.jobTitle || 'Job Application'}
              </Typography>
            </Box>
            {profileModal.userProfile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                                 <Button
                   variant="outlined"
                   startIcon={<Description />}
                   onClick={() => {
                     const userId = profileModal.applicant?.application?.userId || profileModal.applicant?.user?.id
                     if (userId) handleDownloadResume(userId)
                   }}
                   disabled={!profileModal.userProfile?.resumeDocumentId}
                 >
                   Download Resume
                 </Button>
                 <Button
                   variant="outlined"
                   startIcon={<Description />}
                   onClick={() => {
                     const userId = profileModal.applicant?.application?.userId || profileModal.applicant?.user?.id
                     if (userId) handleDownloadCoverLetter(userId)
                   }}
                   disabled={!profileModal.userProfile?.coverLetterDocumentId}
                 >
                   Download Cover Letter
                 </Button>
              </Box>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {profileModal.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : profileModal.error ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                Error: {profileModal.error}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  const applicant = profileModal.applicant
                  setProfileModal({ open: false, applicant: null, userProfile: null, loading: false, error: null })
                  setTimeout(() => handleViewProfile(applicant), 100)
                }}
              >
                Retry
              </Button>
            </Box>
          ) : profileModal.applicant ? (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                {/* Header Section */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: 'primary.light', 
                    borderRadius: 2, 
                    color: 'white',
                    mb: 3
                  }}>
                                         <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                       {profileModal.userProfile?.jobSeeker?.firstName} {profileModal.userProfile?.jobSeeker?.lastName}
                     </Typography>
                     <Typography variant="h6" sx={{ opacity: 0.9 }}>
                       {profileModal.userProfile?.jobSeeker?.email}
                     </Typography>
                     {profileModal.userProfile?.jobSeeker?.profileCompletionPercent && (
                       <Box sx={{ mt: 2 }}>
                         <Typography variant="body2" sx={{ mb: 1 }}>
                           Profile Completion: {Math.round(profileModal.userProfile.jobSeeker.profileCompletionPercent)}%
                         </Typography>
                         <LinearProgress 
                           variant="determinate" 
                           value={profileModal.userProfile.jobSeeker.profileCompletionPercent}
                           sx={{ height: 8, borderRadius: 4 }}
                         />
                       </Box>
                     )}
                  </Box>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Contact Information
                  </Typography>
                </Grid>
                
                                 <Grid item xs={12} sm={6}>
                   <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                   <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                     {profileModal.userProfile?.jobSeeker?.email || profileModal.applicant.email || 'N/A'}
                   </Typography>
                 </Grid>
                 
                 <Grid item xs={12} sm={6}>
                   <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                   <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                     {profileModal.userProfile?.jobSeeker?.phoneNumber || profileModal.applicant.phoneNumber || 'N/A'}
                   </Typography>
                 </Grid>
                 
                 <Grid item xs={12}>
                   <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                   <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                     {profileModal.userProfile?.jobSeeker?.address || profileModal.applicant.address || 'N/A'}
                   </Typography>
                 </Grid>

                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Personal Information
                  </Typography>
                </Grid>
                
                                 <Grid item xs={12} sm={6}>
                   <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                   <Typography variant="body1" sx={{ mb: 2 }}>
                     {profileModal.userProfile?.jobSeeker?.dateOfBirth ? 
                       new Date(profileModal.userProfile.jobSeeker.dateOfBirth).toLocaleDateString() : 
                       'N/A'
                     }
                   </Typography>
                 </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Applied Date</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {profileModal.applicant.application?.applicationDate ? 
                      new Date(profileModal.applicant.application.applicationDate).toLocaleDateString() : 
                      'N/A'
                    }
                  </Typography>
                </Grid>

                {/* Professional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Professional Information
                  </Typography>
                </Grid>
                
                                 {profileModal.userProfile?.jobSeeker?.education && (
                   <Grid item xs={12}>
                     <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                     <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                       {profileModal.userProfile.jobSeeker.education}
                     </Typography>
                   </Grid>
                 )}
                 
                 {profileModal.userProfile?.jobSeeker?.workHistory && (
                   <Grid item xs={12}>
                     <Typography variant="subtitle2" color="text.secondary">Work History</Typography>
                     <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                       {profileModal.userProfile.jobSeeker.workHistory}
                     </Typography>
                   </Grid>
                 )}
                 
                 {profileModal.userProfile?.jobSeeker?.skills && profileModal.userProfile.jobSeeker.skills.length > 0 && (
                   <Grid item xs={12}>
                     <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                       {profileModal.userProfile.jobSeeker.skills.map((skill, index) => (
                         <Chip key={index} label={skill} size="small" color="primary" variant="outlined" />
                       ))}
                     </Box>
                   </Grid>
                 )}
                 
                 {profileModal.userProfile?.jobSeeker?.certifications && profileModal.userProfile.jobSeeker.certifications.length > 0 && (
                   <Grid item xs={12}>
                     <Typography variant="subtitle2" color="text.secondary">Certifications</Typography>
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                       {profileModal.userProfile.jobSeeker.certifications.map((cert, index) => (
                         <Chip key={index} label={cert} size="small" color="success" variant="outlined" />
                       ))}
                     </Box>
                   </Grid>
                 )}

                {/* Military Status */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Military Status
                  </Typography>
                </Grid>
                
                                 <Grid item xs={12} sm={6}>
                   <Typography variant="subtitle2" color="text.secondary">Veteran Status</Typography>
                   <Typography variant="body1" sx={{ mb: 2 }}>
                     {profileModal.userProfile?.jobSeeker?.veteran ? 'Yes' : 'No'}
                   </Typography>
                 </Grid>
                 
                 <Grid item xs={12} sm={6}>
                   <Typography variant="subtitle2" color="text.secondary">Military Spouse</Typography>
                   <Typography variant="body1" sx={{ mb: 2 }}>
                     {profileModal.userProfile?.jobSeeker?.spouse ? 'Yes' : 'No'}
                   </Typography>
                 </Grid>

                {/* Job Seeker Specific Information */}
                {profileModal.userProfile?.jobSeeker && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Job Seeker Profile
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Preferred Job Type</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {profileModal.userProfile.jobSeeker.preferredJobType || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Preferred Location</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {profileModal.userProfile.jobSeeker.preferredLocation || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Expected Salary</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {profileModal.userProfile.jobSeeker.expectedSalary ? 
                          `$${profileModal.userProfile.jobSeeker.expectedSalary}` : 'N/A'
                        }
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {profileModal.userProfile.jobSeeker.availability || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Willing to Relocate</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {profileModal.userProfile.jobSeeker.willingToRelocate ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Resource Referral Opt-in</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {profileModal.userProfile.jobSeeker.resourceReferralOptIn ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                    
                    {profileModal.userProfile.jobSeeker.linkedInProfile && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">LinkedIn Profile</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          <a 
                            href={profileModal.userProfile.jobSeeker.linkedInProfile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            View Profile
                          </a>
                        </Typography>
                      </Grid>
                    )}
                    
                    {profileModal.userProfile.jobSeeker.portfolioUrl && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Portfolio URL</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          <a 
                            href={profileModal.userProfile.jobSeeker.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            View Portfolio
                          </a>
                        </Typography>
                      </Grid>
                    )}
                    
                    {profileModal.userProfile.jobSeeker.summary && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Professional Summary</Typography>
                        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                          {profileModal.userProfile.jobSeeker.summary}
                        </Typography>
                      </Grid>
                    )}
                  </>
                )}

                {/* Documents Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Documents
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Description color="primary" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">Resume</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {applicantsModal.selectedApplicant?.profile?.resumeDocumentId ? 'Available' : 'Not uploaded'}
                      </Typography>
                    </Box>
                    {applicantsModal.selectedApplicant?.profile?.resumeDocumentId && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                          if (userId) handleDownloadResume(userId)
                        }}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Description color="primary" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">Cover Letter</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {applicantsModal.selectedApplicant?.profile?.coverLetterDocumentId ? 'Available' : 'Not uploaded'}
                      </Typography>
                    </Box>
                    {applicantsModal.selectedApplicant?.profile?.coverLetterDocumentId && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                          if (userId) handleDownloadCoverLetter(userId)
                        }}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Applicant profile not available.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileModal({ open: false, applicant: null, userProfile: null, loading: false, error: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Modal */}
      <Dialog
        open={contactModal.open}
        onClose={() => setContactModal({ open: false, applicant: null, userProfile: null, loading: false, error: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Contact Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {contactModal.applicant?.applicantName || 'Applicant'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {contactModal.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : contactModal.error ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                Error: {contactModal.error}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  const applicant = contactModal.applicant
                  setContactModal({ open: false, applicant: null, userProfile: null, loading: false, error: null })
                  setTimeout(() => handleContact(applicant), 100)
                }}
              >
                Retry
              </Button>
            </Box>
          ) : contactModal.applicant ? (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    {contactModal.userProfile?.jobSeeker?.firstName} {contactModal.userProfile?.jobSeeker?.lastName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {contactModal.userProfile?.jobSeeker?.email || contactModal.applicant.email || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {contactModal.userProfile?.jobSeeker?.phoneNumber || contactModal.applicant.phoneNumber || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {contactModal.userProfile?.jobSeeker?.address || contactModal.applicant.address || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">LinkedIn Profile</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {contactModal.userProfile?.jobSeeker?.linkedInProfile ? (
                      <a 
                        href={contactModal.userProfile.jobSeeker.linkedInProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        View LinkedIn Profile
                      </a>
                    ) : 'Not provided'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Portfolio/GitHub</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {contactModal.userProfile?.jobSeeker?.portfolioUrl ? (
                      <a 
                        href={contactModal.userProfile.jobSeeker.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        View Portfolio
                      </a>
                    ) : 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Contact information not available.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactModal({ open: false, applicant: null, userProfile: null, loading: false, error: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Applicant Details Modal */}
      <Dialog
        open={applicantsModal.selectedApplicant !== null}
        onClose={() => setApplicantsModal(prev => ({ ...prev, selectedApplicant: null }))}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Applicant Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {applicantsModal.selectedApplicant?.profile?.jobSeeker?.firstName} {applicantsModal.selectedApplicant?.profile?.jobSeeker?.lastName}
              </Typography>
            </Box>
            {applicantsModal.selectedApplicant?.profile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={() => {
                    const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                    if (userId) handleDownloadResume(userId)
                  }}
                  disabled={!applicantsModal.selectedApplicant?.profile?.resumeDocumentId}
                >
                  Download Resume
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={() => {
                    const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                    if (userId) handleDownloadCoverLetter(userId)
                  }}
                  disabled={!applicantsModal.selectedApplicant?.profile?.coverLetterDocumentId}
                >
                  Download Cover Letter
                </Button>
              </Box>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {applicantsModal.selectedApplicant && applicantsModal.selectedApplicant.profile ? (
            <Box>
              <Grid container spacing={3}>
                {/* Header Section */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: 'primary.light', 
                    borderRadius: 2, 
                    color: 'white',
                    mb: 3
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {applicantsModal.selectedApplicant?.profile?.jobSeeker?.firstName || applicantsModal.selectedApplicant?.profile?.user?.firstName} {applicantsModal.selectedApplicant?.profile?.jobSeeker?.lastName || applicantsModal.selectedApplicant?.profile?.user?.lastName}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {applicantsModal.selectedApplicant?.profile?.jobSeeker?.email || applicantsModal.selectedApplicant?.profile?.user?.email}
                    </Typography>
                    {(applicantsModal.selectedApplicant?.profile?.jobSeeker?.profileCompletionPercent || applicantsModal.selectedApplicant?.profile?.user?.profileCompletionPercent) && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Profile Completion: {Math.round(applicantsModal.selectedApplicant?.profile?.jobSeeker?.profileCompletionPercent || applicantsModal.selectedApplicant?.profile?.user?.profileCompletionPercent || 0)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={applicantsModal.selectedApplicant?.profile?.jobSeeker?.profileCompletionPercent || applicantsModal.selectedApplicant?.profile?.user?.profileCompletionPercent || 0}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Personal Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.dateOfBirth ? 
                      new Date(applicantsModal.selectedApplicant.profile.jobSeeker.dateOfBirth).toLocaleDateString() : 'N/A'
                    }
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Applied Date</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {applicantsModal.selectedApplicant?.application?.appliedDate ? 
                      new Date(applicantsModal.selectedApplicant.application.appliedDate).toLocaleDateString() : 'N/A'
                    }
                  </Typography>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Contact Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.email || applicantsModal.selectedApplicant?.profile?.user?.email || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.phoneNumber || applicantsModal.selectedApplicant?.profile?.user?.phoneNumber || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.address || applicantsModal.selectedApplicant?.profile?.user?.address || 'N/A'}
                  </Typography>
                </Grid>

                {/* Social Links */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Social Links
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">LinkedIn Profile</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.linkedInProfile ? (
                      <a 
                        href={applicantsModal.selectedApplicant.profile.jobSeeker.linkedInProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        View LinkedIn Profile
                      </a>
                    ) : 'Not provided'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Portfolio/GitHub</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.portfolioUrl ? (
                      <a 
                        href={applicantsModal.selectedApplicant.profile.jobSeeker.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        View Portfolio
                      </a>
                    ) : 'Not provided'}
                  </Typography>
                </Grid>

                {/* Professional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Professional Information
                  </Typography>
                </Grid>
                
                {applicantsModal.selectedApplicant?.profile?.jobSeeker?.education && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {applicantsModal.selectedApplicant?.profile?.jobSeeker?.education}
                    </Typography>
                  </Grid>
                )}
                
                {applicantsModal.selectedApplicant?.profile?.jobSeeker?.workHistory && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Work History</Typography>
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {applicantsModal.selectedApplicant?.profile?.jobSeeker?.workHistory}
                    </Typography>
                  </Grid>
                )}
                
                {applicantsModal.selectedApplicant?.profile?.jobSeeker?.skills && applicantsModal.selectedApplicant?.profile?.jobSeeker?.skills.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {applicantsModal.selectedApplicant?.profile?.jobSeeker?.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {applicantsModal.selectedApplicant?.profile?.jobSeeker?.certifications && applicantsModal.selectedApplicant?.profile?.jobSeeker?.certifications.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Certifications</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {applicantsModal.selectedApplicant?.profile?.jobSeeker?.certifications.map((cert, index) => (
                        <Chip key={index} label={cert} size="small" color="success" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}

                {/* Job Preferences */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Job Preferences
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Preferred Job Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.preferredJobType || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Preferred Location</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.preferredLocation || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Expected Salary</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.expectedSalary ? 
                      `$${applicantsModal.selectedApplicant?.profile?.jobSeeker?.expectedSalary.toLocaleString()}` : 'N/A'
                    }
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.availability || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Willing to Relocate</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {applicantsModal.selectedApplicant?.profile?.jobSeeker?.willingToRelocate ? 'Yes' : 'No'}
                  </Typography>
                </Grid>

                {/* Professional Summary */}
                {applicantsModal.selectedApplicant?.profile?.jobSeeker?.summary && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Professional Summary</Typography>
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {applicantsModal.selectedApplicant?.profile?.jobSeeker?.summary}
                    </Typography>
                  </Grid>
                )}

                {/* Documents Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Documents
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Description color="primary" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">Resume</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {applicantsModal.selectedApplicant?.profile?.resumeDocumentId ? 'Available' : 'Not uploaded'}
                      </Typography>
                    </Box>
                    {applicantsModal.selectedApplicant?.profile?.resumeDocumentId && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                          if (userId) handleDownloadResume(userId)
                        }}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Description color="primary" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">Cover Letter</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {applicantsModal.selectedApplicant?.profile?.coverLetterDocumentId ? 'Available' : 'Not uploaded'}
                      </Typography>
                    </Box>
                    {applicantsModal.selectedApplicant?.profile?.coverLetterDocumentId && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                          if (userId) handleDownloadCoverLetter(userId)
                        }}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                </Grid>

                {/* Document Actions */}
                {(applicantsModal.selectedApplicant?.profile?.resumeDocumentId || applicantsModal.selectedApplicant?.profile?.coverLetterDocumentId) && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 2,
                      backgroundColor: 'grey.50'
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Quick Actions
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {applicantsModal.selectedApplicant?.profile?.resumeDocumentId && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Description />}
                            onClick={() => {
                              const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                              if (userId) openDocumentInNewTab(userId, 'resume')
                            }}
                          >
                            Open Resume
                          </Button>
                        )}
                        {applicantsModal.selectedApplicant?.profile?.coverLetterDocumentId && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Description />}
                            onClick={() => {
                              const userId = applicantsModal.selectedApplicant?.application?.userId || applicantsModal.selectedApplicant?.user?.id
                              if (userId) openDocumentInNewTab(userId, 'coverLetter')
                            }}
                          >
                            Open Cover Letter
                          </Button>
                        )}
                       
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Document Content Display */}
                {(documentContent.resume || documentContent.coverLetter) && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      mt: 2, 
                      p: 3, 
                      border: '1px solid', 
                      borderColor: 'primary.main', 
                      borderRadius: 2,
                      backgroundColor: 'background.paper'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Document Content
                      </Typography>
                      
                      {documentContent.loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                          <CircularProgress size={24} />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            Loading document...
                          </Typography>
                        </Box>
                      ) : documentContent.error ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {documentContent.error}
                        </Alert>
                      ) : (
                        <Box>
                          {documentContent.resume && (
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                                Resume Content:
                              </Typography>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px solid', 
                                borderColor: 'divider', 
                                borderRadius: 1,
                                backgroundColor: 'grey.50',
                                maxHeight: '300px',
                                overflow: 'auto'
                              }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                  {documentContent.resume}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          
                          {documentContent.coverLetter && (
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                                Cover Letter Content:
                              </Typography>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px solid', 
                                borderColor: 'divider', 
                                borderRadius: 1,
                                backgroundColor: 'grey.50',
                                maxHeight: '300px',
                                overflow: 'auto'
                              }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                  {documentContent.coverLetter}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setDocumentContent({ resume: null, coverLetter: null, loading: false, error: null })}
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Applicant details not available.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicantsModal(prev => ({ ...prev, selectedApplicant: null }))}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog
        open={rejectionModal.open}
        onClose={() => setRejectionModal({ open: false, applicationId: null, rejectReason: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Rejection Reason
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please provide a reason for rejecting this application
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            placeholder="Please provide a detailed reason for rejecting this application..."
            value={rejectionModal.rejectReason}
            onChange={(e) => setRejectionModal(prev => ({ ...prev, rejectReason: e.target.value }))}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRejectionModal({ open: false, applicationId: null, rejectReason: '' })}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleRejectionWithReason}
            disabled={!rejectionModal.rejectReason.trim()}
          >
            Reject Application
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

// My Company Component
function MyCompany() {
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0
  })
  const [saveLoading, setSaveLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    description: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    contactEmail: '',
    benefits: '',
    culture: ''
  })

  // Load employer profile data and stats
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true)
        
        // Load employer profile
        const response = await employerAPI.getMyProfile()
        console.log('Employer profile response:', response)
        
        if (response) {
          setCompanyData(response)
          // Update form data with existing values
          setFormData({
            companyName: response.companyName || response.company?.name || '',
            industry: response.industry || '',
            companySize: response.companySize || '',
            website: response.website || '',
            description: response.description || '',
            streetAddress: response.streetAddress || response.address?.street || '',
            city: response.city || response.address?.city || '',
            state: response.state || response.address?.state || '',
            zipCode: response.zipCode || response.address?.zipCode || '',
            phone: response.companyPhone || response.phone || '',
            contactEmail: response.contactEmail || response.email || '',
            benefits: response.benefits || '',
            culture: response.culture || ''
          })
        }
        
        // Load stats
        try {
          const jobsResponse = await jobAPI.getEmployerJobs()
          const activeJobs = jobsResponse.filter(job => job.status === 'ACTIVE').length
          
          // Get total applications by fetching applications for each job
          let totalApplications = 0
          for (const job of jobsResponse) {
            try {
              const jobApplications = await applicationAPI.getJobApplicationsWithUserDetails(job.id)
              totalApplications += jobApplications.length
            } catch (error) {
              console.error(`Failed to load applications for job ${job.id}:`, error)
            }
          }
          
          setStats({
            activeJobs,
            totalApplications
          })
        } catch (statsError) {
          console.error('Failed to load stats:', statsError)
          // Set default stats if loading fails
          setStats({
            activeJobs: 0,
            totalApplications: 0
          })
        }
      } catch (error) {
        console.error('Failed to load company data:', error)
        // If profile doesn't exist, that's okay - user can create one
      } finally {
        setLoading(false)
      }
    }

    loadCompanyData()
  }, [])

  const handleSave = async () => {
    try {
      setSaveLoading(true)
      setMessage('')
      
      // Merge existing personal data with new company data to prevent data loss
      const updateData = {
        // Company information
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        website: formData.website,
        description: formData.description,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        companyPhone: formData.phone,
        contactEmail: formData.contactEmail,
        benefits: formData.benefits,
        culture: formData.culture,
        
        // Preserve existing personal data
        fullName: companyData?.fullName || '',
        email: companyData?.email || '',
        phone: companyData?.phone || companyData?.phoneNumber || '',
        jobPosition: companyData?.jobPosition || companyData?.position || '',
        department: companyData?.department || '',
        profilePicture: companyData?.profilePicture || null
      }
      
      console.log('Sending company update data:', updateData)
      
      const response = await employerAPI.updateProfile(updateData)
      setCompanyData(response)
      setEditMode(false)
      setMessage('Company profile updated successfully!')
      
      console.log('Company profile updated successfully:', response)
    } catch (error) {
      console.error('Failed to save company data:', error)
      setMessage('Failed to update company profile. Please try again.')
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
  return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        My Company
      </AnimatedTypography>

      {message && (
        <AnimatedBox animation="fadeInUp" delay={0.1} sx={{ mb: 3 }}>
          <Alert severity={message.includes('successfully') ? 'success' : 'error'} onClose={() => setMessage('')}>
            {message}
          </Alert>
        </AnimatedBox>
      )}

      {/* Debug button for company data */}
      <AnimatedBox animation="fadeInUp" delay={0.1} sx={{ mb: 3 }}>
    
      </AnimatedBox>

      {!companyData && !loading && !editMode ? (
        <AnimatedBox animation="fadeInUp" delay={0.3}>
          <DashboardCard sx={{ p: 4, textAlign: 'center' }}>
            <Business sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              No Company Profile Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create your company profile to start posting jobs and attracting talent.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setEditMode(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              Create Company Profile
            </Button>
          </DashboardCard>
        </AnimatedBox>
      ) : (
        <Grid container spacing={4}>
          {/* Company Information */}
          <Grid item xs={12} md={8}>
            <AnimatedBox animation="fadeInUp" delay={0.3}>
              <DashboardCard sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Company Information
          </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setEditMode(!editMode)}
                    startIcon={editMode ? <Visibility /> : <Edit />}
                  >
                    {editMode ? 'Cancel' : 'Edit Company Profile'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Size"
                      value={formData.companySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!editMode}
                      multiline
                      rows={4}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  {/* Address Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  {/* Contact Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      disabled={!editMode}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  {/* Additional Fields */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Benefits"
                      value={formData.benefits}
                      onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                      disabled={!editMode}
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Culture"
                      value={formData.culture}
                      onChange={(e) => setFormData(prev => ({ ...prev, culture: e.target.value }))}
                      disabled={!editMode}
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saveLoading}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </DashboardCard>
            </AnimatedBox>
          </Grid>

          {/* Company Stats */}
          <Grid item xs={12} md={4}>
            <AnimatedBox animation="fadeInUp" delay={0.4}>
              <DashboardCard sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Company Stats
          </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                    <Work sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {stats.activeJobs}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Jobs
                    </Typography>
    </Box>
                  
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                    <People sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {stats.totalApplications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applications
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
                    <Visibility sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Profile Views
                    </Typography>
                  </Box>
                </Stack>
              </DashboardCard>
            </AnimatedBox>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  )
}
// My Profile Component
function MyProfile() {
  const [userData, setUserData] = useState(null)
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobPosition: '',
    department: '',
    profilePicture: null
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        setMessage('')
        
        // Load employer profile data
        const response = await employerAPI.getMyProfile()
        console.log('Employer profile response:', response)
        
        if (response) {
          setUserData(response)
          setCompanyData(response)
          
          // Populate form data with existing values - handle different possible data structures
          const firstName = response.firstName || response.user?.firstName || ''
          const lastName = response.lastName || response.user?.lastName || ''
          const fullName = response.fullName || (firstName && lastName ? `${firstName} ${lastName}` : '') || ''
          
          setFormData({
            fullName: fullName,
            email: response.email || response.user?.email || '',
            phone: response.phone || response.phoneNumber || response.user?.phone || '',
            jobPosition: response.jobPosition || response.position || response.title || '',
            department: response.department || '',
            profilePicture: response.profilePicture || response.user?.profilePicture || null
          })
        } else {
          // If no employer profile, try to load basic user data
          try {
            const userResponse = await userAPI.getUserById('current') // or get current user data
            console.log('User data response:', userResponse)
            if (userResponse) {
              setUserData(userResponse)
              setFormData({
                fullName: userResponse.fullName || `${userResponse.firstName || ''} ${userResponse.lastName || ''}`.trim(),
                email: userResponse.email || '',
                phone: userResponse.phone || userResponse.phoneNumber || '',
                jobPosition: userResponse.jobPosition || userResponse.position || '',
                department: userResponse.department || '',
                profilePicture: userResponse.profilePicture || null
              })
            }
          } catch (userError) {
            console.error('Failed to load user data:', userError)
          }
        }
      } catch (error) {
        console.error('Failed to load employer profile data:', error)
        setUserData(null)
        setMessage('Failed to load profile data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleSave = async () => {
    try {
      setSaveLoading(true)
      setMessage('')
      
      // Merge existing data with new form data to prevent data loss
      const updateData = {
        // Personal information
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        jobPosition: formData.jobPosition,
        department: formData.department,
        profilePicture: formData.profilePicture,
        
        // Preserve existing company data
        companyName: companyData?.companyName || userData?.companyName || '',
        industry: companyData?.industry || '',
        companySize: companyData?.companySize || '',
        website: companyData?.website || '',
        description: companyData?.description || '',
        streetAddress: companyData?.streetAddress || '',
        city: companyData?.city || '',
        state: companyData?.state || '',
        zipCode: companyData?.zipCode || '',
        companyPhone: companyData?.companyPhone || companyData?.phone || '',
        contactEmail: companyData?.contactEmail || '',
        benefits: companyData?.benefits || '',
        culture: companyData?.culture || ''
      }
      
      console.log('Sending update data:', updateData)
      
      const response = await employerAPI.updateProfile(updateData)
      setUserData(response)
      setCompanyData(response)
      setEditMode(false)
      setMessage('Profile updated successfully!')
      
      console.log('Profile updated successfully:', response)
    } catch (error) {
      console.error('Failed to save profile data:', error)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleRefreshData = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      // Reload data
      const response = await employerAPI.getMyProfile()
      console.log('Refreshed employer profile response:', response)
      
      if (response) {
        setUserData(response)
        setCompanyData(response)
        
        // Update form data
        const firstName = response.firstName || response.user?.firstName || ''
        const lastName = response.lastName || response.user?.lastName || ''
        const fullName = response.fullName || (firstName && lastName ? `${firstName} ${lastName}` : '') || ''
        
        setFormData({
          fullName: fullName,
          email: response.email || response.user?.email || '',
          phone: response.phone || response.phoneNumber || response.user?.phone || '',
          jobPosition: response.jobPosition || response.position || response.title || '',
          department: response.department || '',
          profilePicture: response.profilePicture || response.user?.profilePicture || null
        })
        
        setMessage('Data refreshed successfully!')
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
      setMessage('Failed to refresh data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
  return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        My Profile
      </AnimatedTypography>

      {message && (
        <AnimatedBox animation="fadeInUp" delay={0.1} sx={{ mb: 3 }}>
          <Alert severity={message.includes('successfully') ? 'success' : 'error'} onClose={() => setMessage('')}>
            {message}
          </Alert>
        </AnimatedBox>
      )}

      {/* Debug buttons - remove these in production */}
     

      <Grid container spacing={4}>
        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <AnimatedBox animation="fadeInUp" delay={0.3}>
            <DashboardCard sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
      </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(!editMode)}
                  startIcon={editMode ? <Visibility /> : <Edit />}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    src={formData.profilePicture}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  {editMode && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<Add />}
                      sx={{ mt: 1 }}
                    >
                      Upload Profile Picture
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            setFormData(prev => ({ ...prev, profilePicture: URL.createObjectURL(file) }))
                          }
                        }}
                      />
                    </Button>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!editMode}
                    placeholder={editMode ? "Enter your full name" : "No name provided"}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!editMode}
                    placeholder={editMode ? "Enter your email address" : "No email provided"}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editMode}
                    placeholder={editMode ? "Enter your phone number" : "No phone provided"}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Position"
                    value={formData.jobPosition || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobPosition: e.target.value }))}
                    disabled={!editMode}
                    placeholder={editMode ? "Enter your job position" : "No position specified"}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={formData.department || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    disabled={!editMode}
                    placeholder={editMode ? "Enter your department" : "No department specified"}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {editMode && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saveLoading}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </DashboardCard>
          </AnimatedBox>
        </Grid>

        {/* Company Information */}
        <Grid item xs={12} md={4}>
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <DashboardCard sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Company Information
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Company Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {companyData?.companyName || userData?.companyName || companyData?.company?.name || userData?.company?.name || 'Not specified'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formData.department || companyData?.department || userData?.department || 'Not specified'}
                  </Typography>
                </Box>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  To update company information, visit the Company Profile page.
                </Alert>
          </Stack>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
      </Grid>

      {/* Notification Preferences */}
      <AnimatedBox animation="fadeInUp" delay={0.5} sx={{ mt: 4 }}>
        <DashboardCard sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Notification Preferences
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Email Notifications
          </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive updates via email
                  </Typography>
    </Box>
                <Button variant="outlined" size="small" disabled>
                  Save
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    SMS Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive updates via SMS
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" disabled>
                  Save
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Application Alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get notified of new applications
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" disabled>
                  Save
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Weekly Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive weekly summary reports
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" disabled>
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DashboardCard>
      </AnimatedBox>

      {/* Privacy Settings */}
      <AnimatedBox animation="fadeInUp" delay={0.6} sx={{ mt: 4 }}>
        <DashboardCard sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Privacy Settings
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Show Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Allow others to see your contact details
              </Typography>
            </Box>
            <Button variant="outlined" size="small" disabled>
              Save
            </Button>
          </Box>
        </DashboardCard>
      </AnimatedBox>
    </PageContainer>
  )
}
// Main Employer Dashboard Component
export default function EmployerDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, value: 'dashboard' },
    { text: 'My Job Postings', icon: <Work />, value: 'job-postings' },
    { text: 'List New Vacancy', icon: <Add />, value: 'new-vacancy' },
    { text: 'View Applicants', icon: <People />, value: 'applicants' },
    { text: 'My Company', icon: <Business />, value: 'company' },
    { text: 'My Profile', icon: <Person />, value: 'profile' }
  ]

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <DashboardHome />
      case 'job-postings':
        return <MyJobPostings />
      case 'new-vacancy':
        return <ListNewVacancy />
      case 'applicants':
        return <ViewApplicants />
      case 'company':
        return <MyCompany />
      case 'profile':
        return <MyProfile />
      default:
        return <DashboardHome />
    }
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        p: 3,
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          fontSize: '1.1rem',
          letterSpacing: '0.025em',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}>
          Navigation
        </Typography>
      </Box> */}
      
      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
                onClick={() => {
                  setSelectedTab(item.value)
                  if (mobileOpen) setMobileOpen(false)
                }}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              selected={selectedTab === item.value}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: selectedTab === item.value ? 'white' : 'text.secondary',
                  transition: 'color 0.2s ease-in-out'
                }}>
                {item.icon}
              </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    fontWeight: selectedTab === item.value ? 600 : 500,
                    fontSize: '0.95rem',
                    letterSpacing: '0.025em'
                  }} 
                />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', pt: '70px' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              top: '70px',
              height: 'calc(100% - 70px)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              top: '70px',
              height: 'calc(100% - 70px)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: 'calc(100vh - 70px)'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  )
}


