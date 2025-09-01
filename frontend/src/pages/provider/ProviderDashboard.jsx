import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI } from '../../api/apiService.js';
import ProviderProfile from './ProviderProfile.jsx';
import CreateService from './CreateService.jsx';
import ManageServices from './ManageServices.jsx';
import Applications from './Applications.jsx';
import Messages from './Messages.jsx';
import { 
  Box, 
  Drawer, 
  List, 
  Typography, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Avatar,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Person,
  Assignment,
  Add,
  People,
  Message,
  Business,
  TrendingUp,
  Star,
  Notifications,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '& .MuiTypography-h4': {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  '& .MuiTypography-body2': {
    opacity: 0.9,
  },
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    transform: 'scale(1.05)',
  },
}));

// Dashboard Home Component
function DashboardHome({ setSelectedTab }) {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    profileCompletionPercent: 0,
    totalServicesPosted: 0,
    totalApplicationsReceived: 0,
    averageRating: 0,
    totalReviews: 0,
    pendingApplications: 0,
    unreadMessages: 0,
    activeServices: 0,
    draftServices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const stats = await providerAPI.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'post-service':
        setSelectedTab('new-service');
        break;
      case 'manage-services':
        setSelectedTab('manage-services');
        break;
      case 'applications':
        setSelectedTab('applications');
        break;
      case 'messages':
        setSelectedTab('messages');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Provider Dashboard
      </Typography>

      {/* Profile Completion */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <Business />
          </Avatar>
          <Typography variant="h6">Profile Completion</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={dashboardStats.profileCompletionPercent} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {Math.round(dashboardStats.profileCompletionPercent)}%
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={() => setSelectedTab('profile')}
          startIcon={<Business />}
        >
          Complete Profile
        </Button>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h4">{dashboardStats.totalServicesPosted}</Typography>
            <Typography variant="body2">Services Posted</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h4">{dashboardStats.totalApplicationsReceived}</Typography>
            <Typography variant="body2">Applications Received</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h4">{dashboardStats.averageRating.toFixed(1)}</Typography>
            <Typography variant="body2">Average Rating</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  sx={{ 
                    fontSize: 16, 
                    color: i < Math.floor(dashboardStats.averageRating) ? 'yellow' : 'rgba(255,255,255,0.3)' 
                  }} 
                />
              ))}
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h4">{dashboardStats.pendingApplications}</Typography>
            <Typography variant="body2">Pending Applications</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => handleQuickAction('post-service')}>
            <Add sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Post New Service
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and publish a new service or course
            </Typography>
          </QuickActionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => handleQuickAction('manage-services')}>
            <Assignment sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Manage Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and edit your posted services
            </Typography>
          </QuickActionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => handleQuickAction('applications')}>
            <People sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              View Applications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage applications
            </Typography>
          </QuickActionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard onClick={() => handleQuickAction('messages')}>
            <Message sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Messages
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardStats.unreadMessages > 0 && (
                <Chip 
                  label={dashboardStats.unreadMessages} 
                  color="error" 
                  size="small" 
                  sx={{ mb: 1 }}
                />
              )}
              Communicate with applicants
            </Typography>
          </QuickActionCard>
        </Grid>
      </Grid>

      {/* Service Status Overview */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Service Status Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Active Services</Typography>
              </Box>
              <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                {dashboardStats.activeServices}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently published and accepting applications
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Draft Services</Typography>
              </Box>
              <Typography variant="h3" color="warning.main" sx={{ mb: 1 }}>
                {dashboardStats.draftServices}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Services saved as drafts, not yet published
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

// Main Provider Dashboard Component
export default function ProviderDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, value: 'dashboard' },
    { text: 'My Profile', icon: <Person />, value: 'profile' },
    { text: 'Manage Services', icon: <Assignment />, value: 'manage-services' },
    { text: 'List New Service', icon: <Add />, value: 'new-service' },
    { text: 'View Applications', icon: <People />, value: 'applications' },
    { text: 'Messages', icon: <Message />, value: 'messages' }
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <DashboardHome setSelectedTab={setSelectedTab} />;
      case 'profile':
        return <ProviderProfile />;
      case 'manage-services':
        return <ManageServices />;
      case 'new-service':
        return <CreateService />;
      case 'applications':
        return <Applications />;
      case 'messages':
        return <Messages />;
      default:
        return <DashboardHome setSelectedTab={setSelectedTab} />;
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  setSelectedTab(item.value);
                  if (mobileOpen) setMobileOpen(false);
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
  );

  return (
    <Box sx={{ display: 'flex', pt: '70px' }}>
      {/* Mobile Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          mr: 2, 
          display: { sm: 'none' },
          position: 'fixed',
          top: '80px',
          left: '10px',
          zIndex: 1200,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          }
        }}
      >
        <MenuIcon />
      </IconButton>
      
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
          pl: { xs: 7, sm: 0 } // Add left padding on mobile for menu button
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
