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
  TextField,
  Button,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  Alert,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  LinearProgress
} from '@mui/material'
import {
  Dashboard,
  Person,
  Work,
  Search,
  Menu as MenuIcon,
  Notifications,
  TrendingUp,
  Assignment,
  Business,
  LocationOn,
  Visibility,
  Send,
  CloudUpload,
  Add,
  Close,
  Event,
  CheckCircle,
  Edit,
  Refresh,
  Star,
  Flag
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { jobAPI, applicationAPI, userAPI, roleUtils, jobSeekerAPI } from '../../api/apiService.js'
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
function DashboardHome({ setSelectedTab }) {
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeApplications: 0,
    interviewsScheduled: 0,
    profileCompletion: 0
  })
  const [recentJobs, setRecentJobs] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load applications
        const applicationsResponse = await applicationAPI.getMyApplicationsWithJobDetails()
        const applications = applicationsResponse || []
        

        
        // Load recent jobs
        const jobsResponse = await jobAPI.getAllJobs()
        const jobs = jobsResponse || []
        
        setStats({
          totalApplications: applications.length,
          activeApplications: applications.filter(app => 
            ['RECEIVED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED'].includes(app.application?.status || app.status)
          ).length,
          interviewsScheduled: applications.filter(app => 
            (app.application?.status || app.status) === 'INTERVIEW_SCHEDULED'
          ).length,
          profileCompletion: 75 // Mock data
        })
        
        setRecentJobs(jobs.slice(0, 5)) // Get first 5 jobs
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }

    loadDashboardData()
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
              onClick={() => setSelectedTab('applications')}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Assignment sx={{ fontSize: 40 }} />
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
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <StatsCard 
              sx={{ 
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', 
                color: 'white', 
                cursor: 'pointer' 
              }}
              onClick={() => setSelectedTab('applications')}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Work sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.activeApplications}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Applications
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
              onClick={() => setSelectedTab('applications')}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Business sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.interviewsScheduled}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Interviews Scheduled
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
              onClick={() => setSelectedTab('profile')}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUp sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.profileCompletion}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Profile Complete
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
                Recent Job Opportunities
              </Typography>
              <Stack spacing={2}>
                {recentJobs.map((job, index) => (
                  <Box 
                    key={job.id || index} 
                    sx={{ 
                      p: 2, 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'grey.50',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => setSelectedTab('job-search')}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <PrimaryButton 
                        size="small" 
                        startIcon={<Send />}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle apply logic here
                        }}
                      >
                        Apply
                      </PrimaryButton>
                    </Stack>
                  </Box>
                ))}
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
                  <Typography variant="body2">Search for jobs</Typography>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => setSelectedTab('job-search')}
                  >
                    <Search />
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
                  <Typography variant="body2">Update profile</Typography>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => setSelectedTab('profile')}
                  >
                    <Person />
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
                    onClick={() => setSelectedTab('applications')}
                  >
                    <Assignment />
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
// My Company Component
function MyCompany() {
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0
  })
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
            companyName: response.companyName || '',
            industry: response.industry || '',
            companySize: response.companySize || '',
            website: response.website || '',
            description: response.description || '',
            streetAddress: response.streetAddress || '',
            city: response.city || '',
            state: response.state || '',
            zipCode: response.zipCode || '',
            phone: response.companyPhone || '',
            contactEmail: response.contactEmail || '',
            benefits: response.benefits || '',
            culture: response.culture || ''
          })
        }
        
        // Load stats
        try {
          const [jobsResponse, applicationsResponse] = await Promise.all([
            jobAPI.getEmployerJobs(),
            applicationAPI.getAllEmployerApplicationsWithDetails()
          ])
          
          const activeJobs = jobsResponse.filter(job => job.status === 'ACTIVE').length
          const totalApplications = applicationsResponse.length
          
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
      // Save company data using employer API
      const updateData = {
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
        culture: formData.culture
      }
      
      const response = await employerAPI.updateProfile(updateData)
      setCompanyData(response)
      setEditMode(false)
      
      console.log('Company profile updated successfully:', response)
    } catch (error) {
      console.error('Failed to save company data:', error)
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

      {!companyData ? (
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
                    {editMode ? 'Cancel' : 'Create Company Profile'}
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
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Save Changes
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
  const [form, setForm] = useState({ 
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    address: '',
    education: '', 
    workHistory: '', 
    skills: [], 
    certifications: [],
    veteran: false, 
    spouse: false,
    resourceReferralOptIn: false,
    preferredJobType: '',
    preferredLocation: '',
    expectedSalary: '',
    availability: 'Immediate',
    willingToRelocate: false,
    linkedInProfile: '',
    portfolioUrl: '',
    summary: ''
  })
  const [skillInput, setSkillInput] = useState('')
  const [certificationInput, setCertificationInput] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const currentUser = roleUtils.getCurrentUser()

  // Load profile data on component mount
  useEffect(() => {
    loadProfile()
  }, [])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: '' }))
      }
    }
  }

  const removeSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addCertification = () => {
    if (certificationInput.trim() && !form.certifications.includes(certificationInput.trim())) {
      setForm(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }))
      setCertificationInput('')
    }
  }

  const removeCertification = (certificationToRemove) => {
    setForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certificationToRemove)
    }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    console.log(`📁 File selected for ${fileType}:`, file ? `${file.name} (${file.size} bytes, ${file.type})` : 'None')
    
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErr('File size must be less than 10MB')
        return
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setErr('Please upload only PDF or DOCX files')
        return
      }
      
      if (fileType === 'resume') {
        setResumeFile(file)
        console.log('✅ Resume file set in state')
      } else if (fileType === 'coverLetter') {
        setCoverLetterFile(file)
        console.log('✅ Cover letter file set in state')
      }
      setErr('') // Clear any previous errors
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.education.trim()) newErrors.education = 'Education is required'
    if (!form.workHistory.trim()) newErrors.workHistory = 'Work history is required'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (form.phoneNumber && !phoneRegex.test(form.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    // Skills validation
    if (!form.skills.length) newErrors.skills = 'At least one skill is required'

    // LinkedIn URL validation
    if (form.linkedInProfile && !form.linkedInProfile.includes('linkedin.com')) {
      newErrors.linkedInProfile = 'Please enter a valid LinkedIn URL'
    }

    // Portfolio URL validation
    if (form.portfolioUrl && !form.portfolioUrl.startsWith('http')) {
      newErrors.portfolioUrl = 'Please enter a valid URL starting with http:// or https://'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const save = async () => {
    if (!validateForm()) {
      setErr('Please fix the validation errors before saving')
      return
    }

    setMsg('')
    setErr('')
    setLoading(true)
    
    try { 
      console.log('🔄 Starting profile save process...')
      console.log('📁 Resume file:', resumeFile ? `${resumeFile.name} (${resumeFile.size} bytes)` : 'None')
      console.log('📁 Cover letter file:', coverLetterFile ? `${coverLetterFile.name} (${coverLetterFile.size} bytes)` : 'None')
      
      // Upload files first if they exist
      if (resumeFile) {
        console.log('📤 Uploading resume file...')
        const resumeResponse = await jobSeekerAPI.uploadResume(resumeFile)
        console.log('✅ Resume upload response:', resumeResponse)
        setMsg(prev => prev + ' Resume uploaded successfully. ')
      }
      if (coverLetterFile) {
        console.log('📤 Uploading cover letter file...')
        const coverLetterResponse = await jobSeekerAPI.uploadCoverLetter(coverLetterFile)
        console.log('✅ Cover letter upload response:', coverLetterResponse)
        setMsg(prev => prev + ' Cover letter uploaded successfully. ')
      }

      // Update profile data
      const profileData = {
        ...form,
        skills: form.skills,
        certifications: form.certifications
      }

      console.log('📤 Sending profile data:', profileData)
      const profileResponse = await jobSeekerAPI.updateProfile(profileData)
      console.log('✅ Profile update response:', profileResponse)
      
      // Update the form with the response data to get the latest profile completion
      if (profileResponse) {
        setForm(prev => ({
          ...prev,
          profileCompletionPercent: profileResponse.profileCompletionPercent || prev.profileCompletionPercent
        }))
      }
      
      setMsg('Profile updated successfully') 
      
      // Clear file inputs after successful save
      setResumeFile(null)
      setCoverLetterFile(null)
      
      // Refresh profile data to get the latest information
      setTimeout(() => {
        loadProfile()
      }, 1000)
      
    } catch (ex) { 
      console.error('❌ Profile update error:', ex)
      console.error('❌ Error details:', ex.response?.data)
      setErr(ex.response?.data?.message || ex.message) 
    } finally {
      setLoading(false)
    }
  }

  // Function to reload profile data
  const loadProfile = async () => {
    try {
      console.log('🔍 Loading JobSeeker profile...')
      const response = await jobSeekerAPI.getMyProfile()
      console.log('✅ JobSeeker profile loaded:', response)
      
      if (response) {
        setForm(prev => ({
          ...prev,
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          dateOfBirth: response.dateOfBirth || '',
          email: response.email || '',
          phoneNumber: response.phoneNumber || '',
          address: response.address || '',
          education: response.education || '',
          workHistory: response.workHistory || '',
          skills: response.skills || [],
          certifications: response.certifications || [],
          veteran: response.veteran || false,
          spouse: response.spouse || false,
          resourceReferralOptIn: response.resourceReferralOptIn || false,
          preferredJobType: response.preferredJobType || '',
          preferredLocation: response.preferredLocation || '',
          expectedSalary: response.expectedSalary || '',
          availability: response.availability || 'Immediate',
          willingToRelocate: response.willingToRelocate || false,
          linkedInProfile: response.linkedInProfile || '',
          portfolioUrl: response.portfolioUrl || '',
          summary: response.summary || '',
          profileCompletionPercent: response.profileCompletionPercent || 0
        }))
      }
    } catch (error) {
      console.error('Failed to load JobSeeker profile:', error)
      // Try to load user data as fallback
      try {
        const userResponse = await userAPI.getCurrentUser()
        if (userResponse) {
          setForm(prev => ({
            ...prev,
            firstName: userResponse.firstName || '',
            lastName: userResponse.lastName || '',
            dateOfBirth: userResponse.dateOfBirth || '',
            email: userResponse.email || '',
            phoneNumber: userResponse.phoneNumber || '',
            address: userResponse.address || '',
            education: userResponse.education || '',
            skills: userResponse.skills || [],
            certifications: userResponse.certifications || [],
            veteran: userResponse.veteran || false,
            spouse: userResponse.spouse || false,
            resourceReferralOptIn: userResponse.resourceReferralOptIn || false
          }))
        }
      } catch (userError) {
        console.error('Failed to load user data as fallback:', userError)
        setErr('Failed to load profile data')
      }
    }
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
        My Profile
      </AnimatedTypography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <AnimatedBox animation="fadeInUp" delay={0.3}>
            <DashboardCard>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 3, 
                  bgcolor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <Person sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {currentUser.email}
                </Typography>
                <Chip 
                  label={currentUser.roles?.[0] || 'Job Seeker'} 
                  color="primary" 
                  variant="filled"
                  sx={{ fontWeight: 600, px: 2 }}
                />
                
                {/* Profile Completion Progress */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Profile Completion
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={form.profileCompletionPercent || 0} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {form.profileCompletionPercent || 0}% Complete
                  </Typography>
                </Box>
              </Box>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <DashboardCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Profile Information
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={loadProfile}
                    startIcon={<Refresh />}
                    sx={{ borderRadius: 2 }}
                  >
                    Refresh
                  </Button>
                </Box>
                
                {msg && <Alert severity="success" sx={{ mb: 3 }}>{msg}</Alert>}
                {err && <Alert severity="error" sx={{ mb: 3 }}>{err}</Alert>}
                
                <Stack spacing={4}>
                  {/* Personal Information */}
                  <Box>
                    <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1 }} />
                      Personal Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth
                          label="First Name *" 
                          name="firstName" 
                          value={form.firstName} 
                          onChange={onChange}
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth
                          label="Last Name *" 
                          name="lastName" 
                          value={form.lastName} 
                          onChange={onChange}
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth
                          type="date"
                          label="Date of Birth" 
                          name="dateOfBirth" 
                          value={form.dateOfBirth} 
                          onChange={onChange}
                          InputLabelProps={{ shrink: true }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth
                          label="Phone Number *" 
                          name="phoneNumber" 
                          value={form.phoneNumber} 
                          onChange={onChange}
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber}
                          placeholder="+1 (555) 123-4567"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth
                          label="Address *" 
                          name="address" 
                          value={form.address} 
                          onChange={onChange}
                          error={!!errors.address}
                          helperText={errors.address}
                          multiline
                          rows={2}
                          placeholder="Enter your full address..."
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Professional Information */}
                  <Box>
                    <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ mr: 1 }} />
                      Professional Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth
                          label="Education *" 
                          name="education" 
                          value={form.education} 
                          onChange={onChange}
                          error={!!errors.education}
                          helperText={errors.education}
                          multiline
                          rows={3}
                          placeholder="List your educational background, degrees, institutions, and graduation dates..."
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth
                          label="Work History *" 
                          name="workHistory" 
                          value={form.workHistory} 
                          onChange={onChange}
                          error={!!errors.workHistory}
                          helperText={errors.workHistory}
                          multiline
                  rows={4}
                  placeholder="Describe your work experience, responsibilities, and achievements..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Skills & Certifications */}
          <Box>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Star sx={{ mr: 1 }} />
              Skills & Certifications
            </Typography>
            
            {/* Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Skills *
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  label="Add Skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  size="medium"
                  sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  placeholder="e.g., JavaScript, React, Node.js, Project Management"
                  error={!!errors.skills}
                  helperText={errors.skills}
                />
                <Button
                  variant="contained"
                  onClick={addSkill}
                  startIcon={<Add />}
                  disabled={!skillInput.trim()}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Add
                </Button>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {form.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                    deleteIcon={<Close />}
                    color="primary"
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Certifications */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Certifications
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  label="Add Certification"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  size="medium"
                  sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  placeholder="e.g., AWS Certified Solutions Architect, PMP, CISSP"
                />
                <Button
                  variant="contained"
                  onClick={addCertification}
                  startIcon={<Add />}
                  disabled={!certificationInput.trim()}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Add
                </Button>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {form.certifications.map((cert, index) => (
                  <Chip
                    key={index}
                    label={cert}
                    onDelete={() => removeCertification(cert)}
                    deleteIcon={<Close />}
                    color="secondary"
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Documents */}
          <Box>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <CloudUpload sx={{ mr: 1 }} />
              Documents
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  border: '2px dashed', 
                  borderColor: 'primary.main', 
                  borderRadius: 3, 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: 'primary.50',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'primary.100',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ py: 2, borderRadius: 2, borderColor: 'primary.main', color: 'primary.main' }}
                  >
                    Upload Resume (PDF/DOCX, max 10MB)
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.docx"
                      onChange={(e) => handleFileChange(e, 'resume')}
                    />
                  </Button>
                  {resumeFile && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                        ✓ {resumeFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  border: '2px dashed', 
                  borderColor: 'secondary.main', 
                  borderRadius: 3, 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: 'secondary.50',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'secondary.100',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ py: 2, borderRadius: 2, borderColor: 'secondary.main', color: 'secondary.main' }}
                  >
                    Upload Cover Letter (Optional)
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.docx"
                      onChange={(e) => handleFileChange(e, 'coverLetter')}
                    />
                  </Button>
                  {coverLetterFile && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                        ✓ {coverLetterFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Job Preferences */}
          <Box>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1 }} />
              Job Preferences
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Preferred Job Type" 
                  name="preferredJobType" 
                  value={form.preferredJobType} 
                  onChange={onChange}
                  placeholder="e.g., Full-time, Part-time, Contract"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Preferred Location" 
                  name="preferredLocation" 
                  value={form.preferredLocation} 
                  onChange={onChange}
                  placeholder="e.g., Remote, New York, CA"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  type="number"
                  label="Expected Salary ($)" 
                  name="expectedSalary" 
                  value={form.expectedSalary} 
                  onChange={onChange}
                  placeholder="e.g., 75000"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Availability" 
                  name="availability" 
                  value={form.availability} 
                  onChange={onChange}
                  placeholder="e.g., Immediate, 2 weeks notice"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="LinkedIn Profile" 
                  name="linkedInProfile" 
                  value={form.linkedInProfile} 
                  onChange={onChange}
                  error={!!errors.linkedInProfile}
                  helperText={errors.linkedInProfile}
                  placeholder="https://linkedin.com/in/yourprofile"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Portfolio URL" 
                  name="portfolioUrl" 
                  value={form.portfolioUrl} 
                  onChange={onChange}
                  error={!!errors.portfolioUrl}
                  helperText={errors.portfolioUrl}
                  placeholder="https://yourportfolio.com"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="willingToRelocate"
                      checked={form.willingToRelocate}
                      onChange={onChange}
                      sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                    />
                  }
                  label="I am willing to relocate for the right opportunity"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth
                  label="Professional Summary" 
                  name="summary" 
                  value={form.summary} 
                  onChange={onChange}
                  multiline
                  rows={4}
                  placeholder="Brief professional summary and career objectives..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Status Information */}
          <Box>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Flag sx={{ mr: 1 }} />
              Status Information
            </Typography>
            
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 3 }}>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="veteran"
                      checked={form.veteran}
                      onChange={onChange}
                      sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                    />
                  }
                  label="I am a veteran"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="spouse"
                      checked={form.spouse}
                      onChange={onChange}
                      sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                    />
                  }
                  label="I am a military spouse"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="resourceReferralOptIn"
                      checked={form.resourceReferralOptIn}
                      onChange={onChange}
                      sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                    />
                  }
                  label="I would like to receive resource referrals and notifications"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
              </Stack>
            </Box>
          </Box>

          {/* Save Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <PrimaryButton 
              onClick={save} 
              disabled={loading}
              sx={{ 
                px: 6, 
                py: 2, 
                borderRadius: 3, 
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Saving Profile...
                </Box>
              ) : (
                'Save Profile'
              )}
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </DashboardCard>
  </AnimatedBox>
</Grid>
</Grid>
</PageContainer>
)
}

// My Applications Component
function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await applicationAPI.getMyApplicationsWithJobDetails()
        setApplications(response || [])
        console.log("Enriched Job Data !!",response);
      } catch (error) {
        console.error('Failed to load applications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED': return 'info'
      case 'UNDER_REVIEW': return 'warning'
      case 'INTERVIEW_SCHEDULED': return 'primary'
      case 'OFFERED': return 'success'
      case 'REJECTED': return 'error'
      default: return 'default'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        My Applications
      </AnimatedTypography>
      
      <AnimatedBox animation="fadeInUp" delay={0.3}>
        <DashboardCard>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Application History ({applications.length})
          </Typography>
          
          {applications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No applications yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start searching for jobs to apply!
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {applications.map((app, index) => (
                <AnimatedBox key={app.id || index} animation="fadeInUp" delay={0.4 + index * 0.1}>
                  <Box sx={{ 
                    p: 3, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {app.jobTitle || 'Job Title'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {app.companyName || 'Company Name'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Applied on {formatDate(app.application?.applicationDate || app.applicationDate)}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <StatusChip 
                            label={app.application?.status || app.status || 'Received'} 
                            status={app.application?.status || app.status}
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            Application ID: {app.application?.id || app.id}
                          </Typography>
                        </Stack>
                      </Box>
                      <IconButton size="small" title="View Details" sx={{ color: 'primary.main' }}>
                        <Visibility />
                      </IconButton>
                    </Stack>
                  </Box>
                </AnimatedBox>
              ))}
            </Stack>
          )}
        </DashboardCard>
      </AnimatedBox>
    </PageContainer>
  )
}

// Job Search Component
function JobSearch({ setInterviewModal, setJobDetailsModal }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [interviewDetails, setInterviewDetails] = useState({})

  const searchJobs = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const response = await jobAPI.searchJobs(searchQuery)
      setJobs(response || [])
    } catch (error) {
      console.error('Failed to search jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllJobs = async () => {
    setLoading(true)
    try {
      const response = await jobAPI.getAllJobs()
      setJobs(response || [])
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllJobs()
    loadUserApplications()
  }, [])

  const handleApply = async (jobId) => {
    try {
      await applicationAPI.applyForJob({ jobPostingId: jobId })
      alert('Application submitted successfully!')
      // Refresh applications to update button status
      await loadUserApplications()
    } catch (error) {
      alert('Failed to apply for job: ' + error.message)
    }
  }

  const handleViewInterviewDetails = (jobId) => {
    const application = applications.find(app => app.application?.jobPostingId === jobId)
    if (application) {
      const interview = interviewDetails[application.application.id]
      setInterviewModal({
        open: true,
        application,
        interview
      })
    }
  }

  const handleViewJobDetails = (job) => {
    setJobDetailsModal({
      open: true,
      job
    })
  }

  const loadUserApplications = async () => {
    setApplicationsLoading(true)
    try {
      const response = await applicationAPI.getMyApplicationsWithJobDetails()
      setApplications(response || [])
      
      // Load interview details for applications with INTERVIEW_SCHEDULED status
      const interviewPromises = response
        .filter(app => app.application?.status === 'INTERVIEW_SCHEDULED')
        .map(async (app) => {
          try {
            const interview = await applicationAPI.getInterviewDetails(app.application.id)
            return { applicationId: app.application.id, interview }
          } catch (error) {
            console.error('Failed to load interview details:', error)
            return { applicationId: app.application.id, interview: null }
          }
        })
      
      const interviewResults = await Promise.all(interviewPromises)
      const interviewMap = {}
      interviewResults.forEach(result => {
        interviewMap[result.applicationId] = result.interview
      })
      setInterviewDetails(interviewMap)
    } catch (error) {
      console.error('Failed to load user applications:', error)
      setApplications([])
    } finally {
      setApplicationsLoading(false)
    }
  }

  // Check if user has applied to a specific job
  const getApplicationStatus = (jobId) => {
    const application = applications.find(app => app.application?.jobPostingId === jobId)
    return application ? application.application.status : null
  }

  // Get button properties based on application status
  const getApplyButtonProps = (jobId) => {
    const status = getApplicationStatus(jobId)
    
    switch (status) {
      case 'RECEIVED':
        return {
          variant: 'outlined',
          color: 'info',
          text: 'Application Received',
          disabled: true,
          startIcon: <CheckCircle />
        }
      case 'UNDER_REVIEW':
        return {
          variant: 'outlined',
          color: 'warning',
          text: 'Under Review',
          disabled: true,
          startIcon: <Assignment />
        }
      case 'INTERVIEW_SCHEDULED':
        return {
          variant: 'contained',
          color: 'primary',
          text: 'View Interview Details',
          disabled: false,
          startIcon: <Event />,
          onClick: () => handleViewInterviewDetails(jobId)
        }
      case 'OFFERED':
        return {
          variant: 'contained',
          color: 'success',
          text: 'Offer Received',
          disabled: true,
          startIcon: <TrendingUp />
        }
      case 'REJECTED':
        return {
          variant: 'outlined',
          color: 'error',
          text: 'Application Rejected',
          disabled: true,
          startIcon: <Close />
        }
      case 'WITHDRAWN':
        return {
          variant: 'outlined',
          color: 'default',
          text: 'Application Withdrawn',
          disabled: true,
          startIcon: <Close />
        }
      default:
        return {
          variant: 'contained',
          color: 'primary',
          text: 'Apply',
          disabled: false,
          startIcon: <Send />
        }
    }
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        Job Search
      </AnimatedTypography>
      
      <AnimatedBox animation="fadeInUp" delay={0.3}>
        <DashboardCard sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Find Your Next Opportunity
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Search jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Software Engineer, Marketing Manager..."
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <PrimaryButton 
              onClick={searchJobs}
              disabled={loading || !searchQuery.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </PrimaryButton>
            <SecondaryButton 
              onClick={loadAllJobs}
              disabled={loading}
            >
              View All
            </SecondaryButton>
          </Stack>
        </DashboardCard>
      </AnimatedBox>

      <AnimatedBox animation="fadeInUp" delay={0.4}>
        <DashboardCard>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Available Jobs ({jobs.length})
          </Typography>
          
          {jobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {loading ? 'Loading jobs...' : 'No jobs found'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {loading ? 'Please wait while we fetch available positions.' : 'Try adjusting your search criteria.'}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {jobs.map((job, index) => (
                <AnimatedBox key={job.id || index} animation="fadeInUp" delay={0.5 + index * 0.1}>
                  <JobCard>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {job.description?.substring(0, 150)}...
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {job.company || 'Company Name'}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {job.location}
                            </Typography>
                          </Stack>
                          <Chip label={job.jobType || 'Full Time'} size="small" />
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Visibility />}
                          onClick={() => handleViewJobDetails(job)}
                          sx={{
                            minWidth: 100,
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 2,
                            py: 1
                          }}
                        >
                          View
                        </Button>
                        {(() => {
                          const buttonProps = getApplyButtonProps(job.id)
                          return (
                            <Button
                              variant={buttonProps.variant}
                              color={buttonProps.color}
                              startIcon={buttonProps.startIcon}
                              onClick={buttonProps.onClick || (() => handleApply(job.id))}
                              disabled={buttonProps.disabled}
                              sx={{
                                minWidth: 140,
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                                py: 1
                              }}
                            >
                              {buttonProps.text}
                            </Button>
                          )
                        })()}
                      </Stack>
                    </Stack>
                  </JobCard>
                </AnimatedBox>
              ))}
            </Stack>
          )}
        </DashboardCard>
      </AnimatedBox>
    </PageContainer>
  )
}

// Main JobSeeker Dashboard Component
export default function JobSeekerDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [interviewModal, setInterviewModal] = useState({ open: false, application: null, interview: null })
  const [jobDetailsModal, setJobDetailsModal] = useState({ open: false, job: null })
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, value: 'dashboard' },
    { text: 'My Profile', icon: <Person />, value: 'profile' },
    { text: 'My Applications', icon: <Assignment />, value: 'applications' },
    { text: 'Job Search', icon: <Search />, value: 'job-search' }
  ]

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <DashboardHome setSelectedTab={setSelectedTab} />
      case 'profile':
        return <MyProfile />
      case 'applications':
        return <MyApplications />
      case 'job-search':
        return <JobSearch setInterviewModal={setInterviewModal} setJobDetailsModal={setJobDetailsModal} />
      default:
        return <DashboardHome setSelectedTab={setSelectedTab} />
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

      {/* Interview Details Modal */}
      <Dialog
        open={interviewModal.open}
        onClose={() => setInterviewModal({ open: false, application: null, interview: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Interview Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {interviewModal.application?.jobTitle} at {interviewModal.application?.companyName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {interviewModal.interview ? (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    🎉 Congratulations! Your interview has been scheduled.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(interviewModal.interview.scheduledDateTime).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {interviewModal.interview.interviewType?.replace('_', ' ')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Location/Meeting Details</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {interviewModal.interview.location}
                  </Typography>
                </Grid>
                
                {interviewModal.interview.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Additional Notes</Typography>
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {interviewModal.interview.notes}
                    </Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Important:</strong> Please arrive 10 minutes early for your interview. 
                      If you need to reschedule, please contact the employer as soon as possible.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Interview details are being prepared. Please check back later.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInterviewModal({ open: false, application: null, interview: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Details Modal */}
      <Dialog
        open={jobDetailsModal.open}
        onClose={() => setJobDetailsModal({ open: false, job: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Job Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {jobDetailsModal.job?.company || 'Company Name'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {jobDetailsModal.job ? (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                    {jobDetailsModal.job.title}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {jobDetailsModal.job.company || 'Company Name'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {jobDetailsModal.job.location}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Job Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {jobDetailsModal.job.jobType || 'Full Time'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Posted Date</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {jobDetailsModal.job.createdAt ? 
                      new Date(jobDetailsModal.job.createdAt).toLocaleDateString() : 
                      'Recently Posted'
                    }
                  </Typography>
                </Grid>
                
                {jobDetailsModal.job.minSalary && jobDetailsModal.job.maxSalary && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Salary Range</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      ${jobDetailsModal.job.minSalary.toLocaleString()} - ${jobDetailsModal.job.maxSalary.toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Job Description</Typography>
                  <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {jobDetailsModal.job.description}
                  </Typography>
                </Grid>
                
                {jobDetailsModal.job.requiredSkills && jobDetailsModal.job.requiredSkills.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Required Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {jobDetailsModal.job.requiredSkills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Interested in this position?</strong> Click the Apply button to submit your application.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Job details not available.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDetailsModal({ open: false, job: null })}>
            Close
          </Button>
          {jobDetailsModal.job && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                handleApply(jobDetailsModal.job.id)
                setJobDetailsModal({ open: false, job: null })
              }}
            >
              Apply Now
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
