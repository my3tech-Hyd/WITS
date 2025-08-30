import { useState } from 'react'
import { TextField, Button, Grid, Typography, Alert, Stack, Box, Divider } from '@mui/material'
import { Login, Person, Lock, School } from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/client.js'
import { FormContainer, AnimatedBox, AnimatedTypography, PrimaryButton, SecondaryButton } from '../components/StyledComponents.jsx'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setMsg(''); setErr(''); setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data)
      setMsg('Login successful! Redirecting...')
      setTimeout(() => navigate(from, { replace: true }), 1000)
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <AnimatedBox animation="fadeInUp" delay={0.2}>
        <FormContainer elevation={3}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AnimatedBox animation="fadeInUp" delay={0.3} sx={{ mb: 2 }}>
              <School sx={{ fontSize: 48, color: 'primary.main' }} />
            </AnimatedBox>
            <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.4} sx={{ mb: 1, fontWeight: 700 }}>
              Welcome Back
            </AnimatedTypography>
            <AnimatedTypography variant="body1" animation="fadeInUp" delay={0.5} color="text.secondary">
              Sign in to your WITS account to continue
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

          {/* Form */}
          <form onSubmit={submit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AnimatedBox animation="fadeInUp" delay={0.7}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={onChange}
                    required
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ mb: 2 }}
                  />
                </AnimatedBox>
              </Grid>
              
              <Grid item xs={12}>
                <AnimatedBox animation="fadeInUp" delay={0.8}>
                  <TextField
                    type="password"
                    fullWidth
                    label="Password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </AnimatedBox>
              </Grid>

              <Grid item xs={12}>
                <AnimatedBox animation="fadeInUp" delay={0.9}>
                  <PrimaryButton
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={loading}
                    startIcon={loading ? null : <Login />}
                    sx={{ py: 1.5, mb: 2 }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </PrimaryButton>
                </AnimatedBox>
              </Grid>
            </Grid>
          </form>

          {/* Divider */}
          <Box sx={{ my: 3 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>
          </Box>

          {/* Register Link */}
          <AnimatedBox animation="fadeInUp" delay={1.0} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Don't have an account?
            </Typography>
            <SecondaryButton
              component={Link}
              to="/register"
              fullWidth
              size="large"
            >
              Create Account
            </SecondaryButton>
          </AnimatedBox>
        </FormContainer>
      </AnimatedBox>
    </Box>
  )
}


