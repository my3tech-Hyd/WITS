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
  FormControlLabel
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
  Close
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { jobAPI, applicationAPI, userAPI, roleUtils } from '../../api/apiService.js'
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
    veteranStatus: false, 
    spouseStatus: false,
    resourceReferralOptIn: false
  })
  const [skillInput, setSkillInput] = useState('')
  const [certificationInput, setCertificationInput] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const currentUser = roleUtils.getCurrentUser()

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
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
    if (file) {
      if (fileType === 'resume') {
        setResumeFile(file)
      } else if (fileType === 'coverLetter') {
        setCoverLetterFile(file)
      }
    }
  }
  
  const save = async () => {
    setMsg('')
    setErr('')
    setLoading(true)
    
    try { 
      // Create FormData for file uploads
      const formData = new FormData()
      
      // Add all form fields
      Object.keys(form).forEach(key => {
        if (key === 'skills' || key === 'certifications') {
          formData.append(key, JSON.stringify(form[key]))
        } else {
          formData.append(key, form[key])
        }
      })

      // Add files
      if (resumeFile) {
        formData.append('resume', resumeFile)
      }
      if (coverLetterFile) {
        formData.append('coverLetter', coverLetterFile)
      }

      // Debug: Log what's being sent
      console.log('Sending profile data:', Object.fromEntries(formData.entries()))
      console.log('Resume file:', resumeFile)
      console.log('Cover letter file:', coverLetterFile)

      await userAPI.updateProfile(formData)
      setMsg('Profile updated successfully') 
    } catch (ex) { 
      console.error('Profile update error:', ex)
      setErr(ex.response?.data?.message || ex.message) 
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        My Profile
      </AnimatedTypography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <AnimatedBox animation="fadeInUp" delay={0.3}>
            <DashboardCard>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  <Person sx={{ fontSize: 50 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {currentUser.email}
                </Typography>
                <Chip label={currentUser.roles?.[0] || 'Job Seeker'} color="primary" />
              </Box>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <DashboardCard>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Profile Information
              </Typography>
              
              {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
              {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
              
                            <Stack spacing={3}>
                {/* Personal Information */}
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth
                      label="First Name" 
                      name="firstName" 
                      value={form.firstName} 
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth
                      label="Last Name" 
                      name="lastName" 
                      value={form.lastName} 
                      onChange={onChange}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth
                      label="Phone Number" 
                      name="phoneNumber" 
                      value={form.phoneNumber} 
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth
                      label="Address" 
                      name="address" 
                      value={form.address} 
                      onChange={onChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>

                {/* Professional Information */}
                <Typography variant="h6" sx={{ color: 'primary.main', mt: 2 }}>
                  Professional Information
                </Typography>
                
                <TextField 
                  label="Education" 
                  name="education" 
                  value={form.education} 
                  onChange={onChange}
                  multiline
                  rows={2}
                  placeholder="List your educational background..."
                />
                
                <TextField 
                  label="Work History" 
                  name="workHistory" 
                  value={form.workHistory} 
                  onChange={onChange} 
                  multiline
                  rows={4}
                  placeholder="Describe your work experience, responsibilities, and achievements..."
                />
                
                {/* Skills */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Skills
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField
                      label="Add Skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      size="small"
                      sx={{ flexGrow: 1 }}
                      placeholder="e.g., JavaScript, React, Node.js"
                    />
                    <Button
                      variant="outlined"
                      onClick={addSkill}
                      startIcon={<Add />}
                      disabled={!skillInput.trim()}
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
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Certifications */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Certifications
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField
                      label="Add Certification"
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      size="small"
                      sx={{ flexGrow: 1 }}
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                    <Button
                      variant="outlined"
                      onClick={addCertification}
                      startIcon={<Add />}
                      disabled={!certificationInput.trim()}
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
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Documents */}
                <Typography variant="h6" sx={{ color: 'primary.main', mt: 2 }}>
                  Documents
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Update Resume (PDF/DOCX, max 10MB)
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.docx"
                        onChange={(e) => handleFileChange(e, 'resume')}
                      />
                    </Button>
                    {resumeFile && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                        ✓ {resumeFile.name}
                      </Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Update Cover Letter (Optional)
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.docx"
                        onChange={(e) => handleFileChange(e, 'coverLetter')}
                      />
                    </Button>
                    {coverLetterFile && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                        ✓ {coverLetterFile.name}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {/* Status Information */}
                <Typography variant="h6" sx={{ color: 'primary.main', mt: 2 }}>
                  Status Information
                </Typography>
                
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="veteranStatus"
                        checked={form.veteranStatus}
                        onChange={onChange}
                      />
                    }
                    label="I am a veteran"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="spouseStatus"
                        checked={form.spouseStatus}
                        onChange={onChange}
                      />
                    }
                    label="I am a military spouse"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="resourceReferralOptIn"
                        checked={form.resourceReferralOptIn}
                        onChange={onChange}
                      />
                    }
                    label="I would like to receive resource referrals and notifications"
                  />
                </Stack>

                <PrimaryButton 
                  onClick={save} 
                  disabled={loading}
                  sx={{ alignSelf: 'flex-start', mt: 2 }}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </PrimaryButton>
              </Stack>
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
function JobSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)

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

  const loadUserApplications = async () => {
    setApplicationsLoading(true)
    try {
      const response = await applicationAPI.getMyApplicationsWithJobDetails()
      setApplications(response || [])
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
          startIcon: <Checkbox />
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
          text: 'Interview Scheduled',
          disabled: true,
          startIcon: <TrendingUp />
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
                      {(() => {
                        const buttonProps = getApplyButtonProps(job.id)
                        return (
                          <Button
                            variant={buttonProps.variant}
                            color={buttonProps.color}
                            startIcon={buttonProps.startIcon}
                            onClick={() => handleApply(job.id)}
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
        return <DashboardHome />
      case 'profile':
        return <MyProfile />
      case 'applications':
        return <MyApplications />
      case 'job-search':
        return <JobSearch />
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
