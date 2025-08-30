import { styled } from '@mui/material/styles';
import { Box, Card, Button, Paper, Container, Typography, Chip } from '@mui/material';
import { keyframes } from '@emotion/react';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Styled Components
export const AnimatedBox = styled(Box)(({ theme, animation = 'fadeInUp', delay = 0 }) => ({
  animation: `${animation === 'fadeInUp' ? fadeInUp : slideInLeft} 0.6s ease-out ${delay}s both`,
  '&:hover': {
    transform: 'translateY(-2px)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

export const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
}));

export const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(25, 118, 210, 0.15)',
    borderColor: 'rgba(25, 118, 210, 0.2)',
  },
  '& .MuiCardContent-root': {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

export const JobCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(180deg, #1976d2 0%, #42a5f5 100%)',
    transform: 'scaleY(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    '&::before': {
      transform: 'scaleY(1)',
    },
  },
}));

export const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
  },
}));

export const ActionButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: '24px',
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.875rem',
  letterSpacing: '0.025em',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s, height 0.6s',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    '&::before': {
      width: '300px',
      height: '300px',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

export const PrimaryButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
  },
}));

export const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  background: 'transparent',
  color: theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  '&:hover': {
    background: theme.palette.primary.main,
    color: 'white',
  },
}));

export const SuccessButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #1b5e20 0%, #0d4f14 100%)',
  },
}));

export const WarningButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
  },
}));

export const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'success':
        return {
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
        };
      case 'pending':
      case 'waiting':
        return {
          background: 'linear-gradient(135deg, #ff9800 0%, #ed6c02 100%)',
          color: 'white',
        };
      case 'rejected':
      case 'cancelled':
      case 'error':
        return {
          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
          color: 'white',
        };
      case 'draft':
      case 'inactive':
        return {
          background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
          color: 'white',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
        };
    }
  };

  return {
    borderRadius: '16px',
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 1.5),
    ...getStatusColor(status),
    '& .MuiChip-label': {
      padding: theme.spacing(0.5, 1),
    },
  };
});

export const LoadingShimmer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: theme.spacing(1),
}));

export const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 0),
  },
}));

export const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  minHeight: 'calc(100vh - 64px)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 0),
  },
}));

export const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '600px',
  margin: '0 auto',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: theme.spacing(0, 2),
  },
}));

export const DashboardCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
  },
}));

export const NotificationCard = styled(Paper)(({ theme, read }) => ({
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(2),
  border: `1px solid ${read ? 'rgba(0, 0, 0, 0.08)' : theme.palette.primary.main}`,
  background: read ? '#ffffff' : 'rgba(25, 118, 210, 0.02)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: read ? 'transparent' : theme.palette.primary.main,
    transition: 'background 0.3s ease',
  },
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

export const AnimatedTypography = styled(Typography)(({ theme, animation = 'fadeInUp', delay = 0 }) => ({
  animation: `${animation === 'fadeInUp' ? fadeInUp : slideInLeft} 0.6s ease-out ${delay}s both`,
}));

export const PulseIcon = styled(Box)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
