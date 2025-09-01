import React, { useState } from 'react';
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
  LinearProgress,
  Alert,
  Divider,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import {
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Title as TitleIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  CloudDone as PublishIcon
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

const serviceCategories = [
  'IT',
  'Finance',
  'Management',
  'Technical',
  'Healthcare',
  'Education',
  'Consulting',
  'Marketing',
  'Sales',
  'Customer Service',
  'Other'
];

const serviceModes = [
  'Online',
  'Offline',
  'Hybrid'
];

const CreateService = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [service, setService] = useState({
    title: '',
    category: '',
    description: '',
    duration: '',
    mode: '',
    location: '',
    fees: '',
    eligibility: '',
    lastDateToApply: '',
    bannerUrl: '',
    tags: [],
    prerequisites: '',
    learningOutcomes: '',
    instructorName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleInputChange = (field, value) => {
    setService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (event) => {
    const value = event.target.value;
    setService(prev => ({
      ...prev,
      tags: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await documentAPI.uploadDocument(file, 'PROVIDER_SERVICE', 'Service Banner');
      setService(prev => ({
        ...prev,
        bannerUrl: data.documentId
      }));
      setMessage({ type: 'success', text: 'Banner uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'Failed to upload banner.' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const serviceData = {
        ...service,
        fees: service.fees ? parseFloat(service.fees) : null,
        tags: service.tags.filter(tag => tag.trim() !== '')
      };
      
      await providerAPI.createService(serviceData);
      setMessage({ type: 'success', text: 'Service created successfully!' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error creating service:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while creating the service.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // First create the service
      const serviceData = {
        ...service,
        fees: service.fees ? parseFloat(service.fees) : null,
        tags: service.tags.filter(tag => tag.trim() !== '')
      };
      
      const data = await providerAPI.createService(serviceData);
      
      // Then publish it
      await providerAPI.publishService(data.id);
      
      setMessage({ type: 'success', text: 'Service created and published successfully!' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error creating and publishing service:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while creating the service.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Create New Service/Course
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
              <TitleIcon sx={{ mr: 1 }} />
              Service Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Service/Course Title"
                  value={service.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={service.category}
                    label="Category"
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {serviceCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={6}
                  value={service.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Provide a detailed description of your service or course"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} />
              Service Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  placeholder="e.g., 6 weeks, 3 months"
                  value={service.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Mode</InputLabel>
                  <Select
                    value={service.mode}
                    label="Mode"
                    onChange={(e) => handleInputChange('mode', e.target.value)}
                  >
                    {serviceModes.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location (if offline)"
                  value={service.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Required for offline or hybrid modes"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fees (if applicable)"
                  type="number"
                  value={service.fees}
                  onChange={(e) => handleInputChange('fees', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Leave empty if free"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Date to Apply"
                  type="date"
                  value={service.lastDateToApply}
                  onChange={(e) => handleInputChange('lastDateToApply', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instructor Name"
                  value={service.instructorName}
                  onChange={(e) => handleInputChange('instructorName', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Requirements and Outcomes */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Requirements and Outcomes
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Eligibility/Requirements"
                  multiline
                  rows={3}
                  value={service.eligibility}
                  onChange={(e) => handleInputChange('eligibility', e.target.value)}
                  helperText="Specify any prerequisites or requirements for applicants"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prerequisites"
                  multiline
                  rows={3}
                  value={service.prerequisites}
                  onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                  helperText="Any specific skills or knowledge required"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Learning Outcomes"
                  multiline
                  rows={3}
                  value={service.learningOutcomes}
                  onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
                  helperText="What participants will learn from this service/course"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={service.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={service.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tags and Banner */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={service.tags}
                    onChange={handleTagsChange}
                    label="Tags"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Beginner', 'Advanced', 'Certification', 'Hands-on', 'Theory', 'Practical', 'Workshop', 'Seminar'].map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Add relevant tags to help applicants find your service</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    Upload Banner/Flyer
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  {service.bannerUrl && (
                    <Alert severity="success">
                      Banner uploaded successfully!
                    </Alert>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/provider/services')}
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
            {saving ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<PublishIcon />}
            onClick={handlePublish}
            disabled={saving}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateService;
