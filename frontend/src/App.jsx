import { CssBaseline, AppBar, Toolbar, Typography, Container, Button, Stack, IconButton, Badge, ThemeProvider, Box } from '@mui/material'
import { Notifications, Logout, Work, Business, School } from '@mui/icons-material'
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SplashPage from './pages/SplashPage.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import JobsPage from './pages/JobsPage.jsx'
import ApplicationsPage from './pages/ApplicationsPage.jsx'
import AppointmentsPage from './pages/AppointmentsPage.jsx'
import DocumentsPage from './pages/DocumentsPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import DashboardRouter from './pages/DashboardRouter.jsx'
import CreateJobForm from './pages/employer/CreateJobForm.jsx'
import theme from './theme/theme.js'
import { AnimatedBox, AnimatedTypography } from './components/StyledComponents.jsx'
import My3Logo from './assests/My3-Logo.png'

function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const roles = user?.roles || []
  const isJobSeeker = roles.includes('JOB_SEEKER')
  const isEmployer = roles.includes('EMPLOYER')
  const isStaff = roles.includes('STAFF')
  const isProvider = roles.includes('PROVIDER')
  
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }
  
  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
        minHeight: '70px',
        height: '70px'
      }}>
        {/* Left Section - Logo */}
        <AnimatedBox animation="slideInLeft" delay={0.1}>
          <Box
            component={Link}
            to={user ? "/dashboard" : "/"}
          sx={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          >
            <img 
              src={My3Logo} 
              alt="My3 Logo" 
              style={{ 
                height: '80px', 
                width: 'auto',
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
              }} 
            />
          </Box>
        </AnimatedBox>
        
        {/* Center Section - Navigation Links (only when logged in) */}
        {user && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            flex: 1,
            justifyContent: 'center',
            mx: 4
          }}>
            <AnimatedBox animation="fadeInUp" delay={0.2}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: 'white',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.025em'
              }}>
                {isJobSeeker && 'Job Seeker Portal'}
                {isEmployer && 'Employer Portal'}
                {isStaff && 'Staff Portal'}
                {isProvider && 'Provider Portal'}
        </Typography>
            </AnimatedBox>
          </Box>
        )}
        
        {/* Right Section - Auth Buttons or Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Before Login - Show Login and Register */}
          {!user && (
            <>
              <AnimatedBox animation="fadeInUp" delay={0.2}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '0.95rem',
                    letterSpacing: '0.025em',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
              >
                Login
              </Button>
              </AnimatedBox>
              <AnimatedBox animation="fadeInUp" delay={0.3}>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ 
                  textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.6)',
                    borderWidth: 2,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '0.95rem',
                    letterSpacing: '0.025em',
                  '&:hover': {
                      borderColor: 'rgba(255,255,255,0.9)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
              >
                Register
              </Button>
              </AnimatedBox>
            </>
          )}
          
          {/* After Login - Show Notification and Logout */}
          {user && (
            <>
              <AnimatedBox animation="fadeInUp" delay={0.5}>
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to="/notifications"
                  sx={{ 
                    ml: 1,
                    p: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', height: 20, minWidth: 20 } }}>
                    <Notifications sx={{ fontSize: 24 }} />
                </Badge>
              </IconButton>
              </AnimatedBox>
              
              <AnimatedBox animation="fadeInUp" delay={0.6}>
              <IconButton 
                color="inherit" 
                  onClick={handleLogout}
                  sx={{ 
                    ml: 1,
                    p: 1.5,
                    borderRadius: 2,
                    title: "Logout",
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Logout sx={{ fontSize: 24 }} />
              </IconButton>
              </AnimatedBox>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}

// Public Route Component (only for non-authenticated users)
function PublicRoute({ children }) {
  const { user } = useAuth()
  
  if (user) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <CssBaseline />
      <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
              <SplashPage />
            </Container>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <LoginPage />
              </Container>
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <RegisterPage />
              </Container>
            </PublicRoute>
          } />
          
          {/* Protected Routes - Dashboard pages have their own layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />
          <Route path="/employer/create-job" element={
            <ProtectedRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <CreateJobForm />
              </Container>
            </ProtectedRoute>
          } />
          

          <Route path="/jobs" element={
            <ProtectedRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <JobsPage />
              </Container>
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <ApplicationsPage />
              </Container>
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <AppointmentsPage />
              </Container>
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <DocumentsPage />
              </Container>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Container maxWidth="xl" sx={{ mt: '90px', mb: 3, px: { xs: 2, md: 3 } }}>
                <NotificationsPage />
              </Container>
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to appropriate page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </AuthProvider>
    </ThemeProvider>
  )
}


