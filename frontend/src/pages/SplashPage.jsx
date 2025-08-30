import { useEffect } from 'react'
import { Box, CircularProgress, Typography, Grid, Button } from '@mui/material'
import { Work, Business, School, TrendingUp, People, Security } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { HeroSection, FeatureCard, AnimatedBox, AnimatedTypography, PrimaryButton, SecondaryButton } from '../components/StyledComponents.jsx'

export default function SplashPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  useEffect(() => {
    const t = setTimeout(() => {
      if (user) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }, 3000)
    return () => clearTimeout(t)
  }, [navigate, user])

  const features = [
    {
      icon: <Work sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Find Your Dream Job',
      description: 'Browse thousands of job opportunities and find the perfect match for your skills and career goals.'
    },
    {
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Post Job Openings',
      description: 'Employers can easily post job openings and reach qualified candidates quickly.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Connect & Network',
      description: 'Build professional relationships and expand your network in the industry.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Career Growth',
      description: 'Track your applications and career progress with our comprehensive dashboard.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Educational Resources',
      description: 'Access learning materials and career development resources to enhance your skills.'
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedTypography variant="h2" animation="fadeInUp" delay={0.2} sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to WITS Job Portal
          </AnimatedTypography>
          <AnimatedTypography variant="h5" animation="fadeInUp" delay={0.4} sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Your gateway to professional opportunities. Connect with top employers and advance your career with confidence.
          </AnimatedTypography>
          <AnimatedBox animation="fadeInUp" delay={0.6} sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <PrimaryButton 
              size="large" 
              onClick={() => navigate('/register')}
              sx={{ px: 4, py: 1.5 }}
            >
              Get Started
            </PrimaryButton>
            <SecondaryButton 
              size="large" 
              onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.5, color: 'white', borderColor: 'white' }}
            >
              Sign In
            </SecondaryButton>
          </AnimatedBox>
        </Box>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 4 } }}>
        <AnimatedTypography 
          variant="h3" 
          animation="fadeInUp" 
          delay={0.2} 
          sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}
        >
          Why Choose WITS?
        </AnimatedTypography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AnimatedBox animation="fadeInUp" delay={0.2 + index * 0.1}>
                <FeatureCard>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </AnimatedBox>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Loading Overlay */}
      <Box 
        sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          bgcolor: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 9999,
          gap: 2
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="white">
          Loading WITS Job Portal...
        </Typography>
      </Box>
    </Box>
  )
}


