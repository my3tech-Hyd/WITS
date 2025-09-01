import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI, documentAPI } from '../../api/apiService.js';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const organizationTypes = [
  'Training Institute',
  'Consultancy',
  'Service Provider',
  'Educational Institution',
  'Technology Company',
  'Healthcare Provider',
  'Financial Services',
  'Other'
];

const serviceCategories = [
  'IT Training',
  'HR Consulting',
  'Internship Programs',
  'Career Counseling',
  'Skills Development',
  'Professional Certification',
  'Workshop & Seminars',
  'Online Courses',
  'Technical Training',
  'Soft Skills Training',
  'Leadership Development',
  'Other'
];

const ProviderProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState({
    // Basic Information
    providerName: '',
    contactPersonName: '',
    email: '',
    phoneNumber: '',
    website: '',
    logoUrl: '',

    // Organization Details
    organizationType: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    about: '',
    servicesOffered: [],

    // Documents
    certificationDocumentIds: [],
    accreditationDocumentIds: [],

    // Notification preferences
    emailNotifications: true,
    smsNotifications: true,
    applicationAlerts: true,
    weeklyReports: false,

    // Privacy settings
    showContactInformation: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await providerAPI.getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.message.includes('not found') || error.response?.status === 404) {
        // Profile doesn't exist yet, use default values
        setMessage({ type: 'info', text: 'Please complete your profile information.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServicesOfferedChange = (event) => {
    const value = event.target.value;
    setProfile(prev => ({
      ...prev,
      servicesOffered: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleFileUpload = async (event, field) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await documentAPI.uploadDocument(file, 'PROVIDER', `Provider ${field}`);
      setProfile(prev => ({
        ...prev,
        [field]: data.documentId
      }));
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'Failed to upload file.' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let data;
      if (profile.id) {
        data = await providerAPI.updateProfile(profile);
      } else {
        data = await providerAPI.createProfile(profile);
      }
      
      setProfile(data);
      setMessage({ 
        type: 'success', 
        text: profile.id ? 'Profile updated successfully!' : 'Profile created successfully!' 
      });
      
      // Navigate to dashboard after successful creation
      if (!profile.id) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
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
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Provider Profile
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 1 }} />
              Basic Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Provider/Organization Name"
                  value={profile.providerName}
                  onChange={(e) => handleInputChange('providerName', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Person Name"
                  value={profile.contactPersonName}
                  onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website (Optional)"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WebsiteIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={profile.logoUrl}
                    sx={{ width: 80, height: 80 }}
                  >
                    <BusinessIcon />
                  </Avatar>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                  >
                    Upload Logo
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logoUrl')}
                    />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} />
              Organization Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Organization Type</InputLabel>
                  <Select
                    value={profile.organizationType}
                    label="Organization Type"
                    onChange={(e) => handleInputChange('organizationType', e.target.value)}
                  >
                    {organizationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={profile.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={profile.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={profile.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="About/Description"
                  multiline
                  rows={4}
                  value={profile.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Services Offered</InputLabel>
                  <Select
                    multiple
                    value={profile.servicesOffered}
                    onChange={handleServicesOfferedChange}
                    label="Services Offered"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {serviceCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <VerifiedIcon sx={{ mr: 1 }} />
              Documents
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<UploadIcon />}
                  sx={{ py: 2 }}
                >
                  Upload Certifications (PDF/Images)
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'certificationDocumentIds')}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<UploadIcon />}
                  sx={{ py: 2 }}
                >
                  Upload Accreditation/License
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'accreditationDocumentIds')}
                  />
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.emailNotifications}
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.smsNotifications}
                      onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                    />
                  }
                  label="SMS Notifications"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.applicationAlerts}
                      onChange={(e) => handleInputChange('applicationAlerts', e.target.checked)}
                    />
                  }
                  label="Application Alerts"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.weeklyReports}
                      onChange={(e) => handleInputChange('weeklyReports', e.target.checked)}
                    />
                  }
                  label="Weekly Reports"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={profile.showContactInformation}
                  onChange={(e) => handleInputChange('showContactInformation', e.target.checked)}
                />
              }
              label="Show Contact Information to Applicants"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/provider/dashboard')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Saving...' : (profile.id ? 'Update Profile' : 'Save Profile')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProviderProfile;
