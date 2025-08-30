import { useState } from 'react'
import { TextField, Button, Grid, Typography, Alert, FormControl, InputLabel, Select, MenuItem, Box, Divider, Stepper, Step, StepLabel } from '@mui/material'
import { Person, Email, Phone, Home, Lock, Security, School, Work, Business, Group } from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import { userAPI } from '../api/apiService.js'
import { FormContainer, AnimatedBox, AnimatedTypography, PrimaryButton, SecondaryButton } from '../components/StyledComponents.jsx'

const ALL_ROLES = ['JOB_SEEKER', 'EMPLOYER', 'STAFF', 'PROVIDER']

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', 
    lastName: '', 
    dateOfBirth: '', 
    email: '', 
    phoneNumber: '', 
    address: '',
    username: '', 
    password: '', 
    confirmPassword: '',
    securityQuestion: '', 
    securityAnswer: '', 
    role: 'JOB_SEEKER'
  })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!form.username.trim()) newErrors.username = 'Username is required'
    if (!form.password) newErrors.password = 'Password is required'
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (!form.securityQuestion) newErrors.securityQuestion = 'Security question is required'
    if (!form.securityAnswer.trim()) newErrors.securityAnswer = 'Security answer is required'

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

    // Password validation
    if (form.password && form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    } else if (form.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character'
    }

    // Confirm password validation
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Date of birth validation (minimum 16 years old)
    if (form.dateOfBirth) {
      const today = new Date()
      const birthDate = new Date(form.dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      if (age < 16) {
        newErrors.dateOfBirth = 'You must be at least 16 years old'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const res = await userAPI.register(form)
      setMsg(`Registration successful! Welcome ${res.firstName}`)
      
      // Navigate to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (e) {
      setErr(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <AnimatedBox animation="fadeInUp" delay={0.2}>
        <FormContainer elevation={3} sx={{ maxWidth: '800px' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AnimatedBox animation="fadeInUp" delay={0.3} sx={{ mb: 2 }}>
              <School sx={{ fontSize: 48, color: 'primary.main' }} />
            </AnimatedBox>
            <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.4} sx={{ mb: 1, fontWeight: 700 }}>
              Join WITS Job Portal
            </AnimatedTypography>
            <AnimatedTypography variant="body1" animation="fadeInUp" delay={0.5} color="text.secondary">
              Create your account and start your professional journey
            </AnimatedTypography>
          </Box>

          {/* Alerts */}
          {msg && (
            <AnimatedBox animation="fadeInUp" delay={0.6}>
              <Alert severity="success" sx={{ mb: 3 }}>{msg}</Alert>
            </AnimatedBox>
          )}
          {err && (
            <AnimatedBox animation="fadeInUp" delay={0.6}>
              <Alert severity="error" sx={{ mb: 3 }}>{err}</Alert>
            </AnimatedBox>
          )}

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={0} alternativeLabel>
              <Step>
                <StepLabel>Personal Info</StepLabel>
              </Step>
              <Step>
                <StepLabel>Account Setup</StepLabel>
              </Step>
              <Step>
                <StepLabel>Security</StepLabel>
              </Step>
            </Stepper>
          </Box>
          
          <form onSubmit={submit}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <AnimatedTypography variant="h6" animation="fadeInUp" delay={0.7} sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  Personal Information
                </AnimatedTypography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={0.8}>
                  <TextField 
                    fullWidth 
                    label="First Name *" 
                    name="firstName" 
                    value={form.firstName} 
                    onChange={onChange} 
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={0.9}>
                  <TextField 
                    fullWidth 
                    label="Last Name *" 
                    name="lastName" 
                    value={form.lastName} 
                    onChange={onChange} 
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={1.0}>
                  <TextField 
                    type="date" 
                    fullWidth 
                    label="Date of Birth *" 
                    name="dateOfBirth" 
                    value={form.dateOfBirth} 
                    onChange={onChange} 
                    InputLabelProps={{ shrink: true }} 
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={1.1}>
                  <TextField 
                    fullWidth 
                    label="Email *" 
                    name="email" 
                    type="email"
                    value={form.email} 
                    onChange={onChange} 
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={1.2}>
                  <TextField 
                    fullWidth 
                    label="Phone Number *" 
                    name="phoneNumber" 
                    value={form.phoneNumber} 
                    onChange={onChange} 
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12}>
                <AnimatedBox animation="fadeInUp" delay={1.3}>
                  <TextField 
                    fullWidth 
                    label="Address" 
                    name="address" 
                    value={form.address} 
                    onChange={onChange} 
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: <Home sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />
                </AnimatedBox>
              </Grid>

              {/* Account Information */}
              <Grid item xs={12}>
                <AnimatedTypography variant="h6" animation="fadeInUp" delay={1.4} sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock />
                  Account Information
                </AnimatedTypography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={1.5}>
                  <TextField 
                    fullWidth 
                    label="Username *" 
                    name="username" 
                    value={form.username} 
                    onChange={onChange} 
                    error={!!errors.username}
                    helperText={errors.username}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={1.6}>
                  <FormControl fullWidth>
                    <InputLabel>Role *</InputLabel>
                    <Select 
                      name="role" 
                      value={form.role} 
                      label="Role *" 
                      onChange={onChange}
                    >
                      <MenuItem value="JOB_SEEKER">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Work />
                          Job Seeker
                        </Box>
                      </MenuItem>
                      <MenuItem value="EMPLOYER">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business />
                          Employer
                        </Box>
                      </MenuItem>
                      <MenuItem value="STAFF">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Group />
                          Staff
                        </Box>
                      </MenuItem>
                      <MenuItem value="PROVIDER">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Group />
                          Provider
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={1.7}>
                  <TextField 
                    fullWidth 
                    label="Password *" 
                    name="password" 
                    type="password"
                    value={form.password} 
                    onChange={onChange} 
                    error={!!errors.password}
                    helperText={errors.password}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={1.8}>
                  <TextField 
                    fullWidth 
                    label="Confirm Password *" 
                    name="confirmPassword" 
                    type="password"
                    value={form.confirmPassword} 
                    onChange={onChange} 
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required 
                  />
                </AnimatedBox>
              </Grid>

              {/* Security Information */}
              <Grid item xs={12}>
                <AnimatedTypography variant="h6" animation="fadeInUp" delay={1.9} sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security />
                  Security Information
                </AnimatedTypography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={2.0}>
                  <TextField 
                    fullWidth 
                    label="Security Question *" 
                    name="securityQuestion" 
                    value={form.securityQuestion} 
                    onChange={onChange} 
                    error={!!errors.securityQuestion}
                    helperText={errors.securityQuestion}
                    required 
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <AnimatedBox animation="fadeInUp" delay={2.1}>
                  <TextField 
                    fullWidth 
                    label="Security Answer *" 
                    name="securityAnswer" 
                    value={form.securityAnswer} 
                    onChange={onChange} 
                    error={!!errors.securityAnswer}
                    helperText={errors.securityAnswer}
                    required 
                  />
                </AnimatedBox>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <AnimatedBox animation="fadeInUp" delay={2.2} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <PrimaryButton 
                    type="submit" 
                    size="large"
                    disabled={loading}
                    sx={{ px: 6, py: 1.5 }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </PrimaryButton>
                </AnimatedBox>
              </Grid>
            </Grid>
          </form>

          {/* Divider */}
          <Box sx={{ my: 4 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
            </Divider>
          </Box>

          {/* Login Link */}
          <AnimatedBox animation="fadeInUp" delay={2.3} sx={{ textAlign: 'center' }}>
            <SecondaryButton
              component={Link}
              to="/login"
              fullWidth
              size="large"
            >
              Sign In to Existing Account
            </SecondaryButton>
          </AnimatedBox>
        </FormContainer>
      </AnimatedBox>
    </Box>
  )
}


