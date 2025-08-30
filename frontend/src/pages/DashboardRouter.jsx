import { useMemo } from 'react'
import { Typography, Grid, Card, CardContent, Button, Box } from '@mui/material'
import { Assignment, Event, Business, School, Work, TrendingUp, People, Security } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext.jsx'
import EmployerDashboard from './employer/EmployerDashboard.jsx'
import JobSeekerDashboard from './jobseeker/JobSeekerDashboard.jsx'
import { DashboardCard, AnimatedBox, AnimatedTypography, PageContainer } from '../components/StyledComponents.jsx'

function StaffDashboard() {
  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        Staff Dashboard
      </AnimatedTypography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnimatedBox animation="fadeInUp" delay={0.3}>
            <DashboardCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Cases Management
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage active cases and track progress. Review applications and process approvals.
              </Typography>
              <Button variant="outlined" color="primary" size="small">
                View Cases
              </Button>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <DashboardCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Events & Services
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Track services, manage vouchers, and coordinate training events.
              </Typography>
              <Button variant="outlined" color="primary" size="small">
                Manage Events
              </Button>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

function ProviderDashboard() {
  return (
    <PageContainer>
      <AnimatedTypography variant="h4" animation="fadeInUp" delay={0.2} sx={{ mb: 4, fontWeight: 700 }}>
        Provider Dashboard
      </AnimatedTypography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnimatedBox animation="fadeInUp" delay={0.3}>
            <DashboardCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Provider Profile
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Maintain ETPL documentation and update provider information.
              </Typography>
              <Button variant="outlined" color="primary" size="small">
                Update Profile
              </Button>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <AnimatedBox animation="fadeInUp" delay={0.4}>
            <DashboardCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Training Programs
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage training offerings, track compliance, and update program details.
              </Typography>
              <Button variant="outlined" color="primary" size="small">
                Manage Programs
              </Button>
            </DashboardCard>
          </AnimatedBox>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default function DashboardRouter() {
  const { user } = useAuth()
  const role = useMemo(() => (user?.roles?.[0] || 'JOB_SEEKER'), [user])

  if (role === 'EMPLOYER') return <EmployerDashboard />
  if (role === 'STAFF') return <StaffDashboard />
  if (role === 'PROVIDER') return <ProviderDashboard />
  return <JobSeekerDashboard />
}
