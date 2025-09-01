import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI } from '../../api/apiService.js';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Grid,
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Message as MessageIcon
} from '@mui/icons-material';

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [statusDialog, setStatusDialog] = useState({ 
    open: false, 
    application: null, 
    status: '', 
    notes: '' 
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await providerAPI.getServiceApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while loading applications.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const statusData = {
        status: statusDialog.status,
        statusNotes: statusDialog.notes,
        isContacted: true,
        contactMethod: 'Email',
        contactNotes: `Status updated to ${statusDialog.status}`
      };
      
      await providerAPI.updateApplicationStatus(statusDialog.application.id, statusData);
      setMessage({ type: 'success', text: 'Application status updated successfully!' });
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating application status:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while updating the status.' });
    } finally {
      setStatusDialog({ open: false, application: null, status: '', notes: '' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      case 'WITHDRAWN':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleSendMessage = (application) => {
    navigate('/provider/messages', { 
      state: { 
        recipientId: application.applicantId,
        recipientName: application.applicantName,
        serviceId: application.serviceId,
        applicationId: application.id
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Service Applications
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Applicant</strong></TableCell>
                  <TableCell><strong>Service</strong></TableCell>
                  <TableCell><strong>Applied Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Contact Info</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No applications received yet. Applications will appear here once applicants apply to your services.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application) => (
                    <TableRow key={application.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {application.applicantName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {application.applicantType}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {application.serviceTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {application.serviceId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(application.appliedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.status}
                          color={getStatusColor(application.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" />
                            {application.applicantEmail}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon fontSize="small" />
                            {application.applicantPhone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => setStatusDialog({
                              open: true,
                              application: application,
                              status: application.status,
                              notes: application.statusNotes || ''
                            })}
                            title="Update Status"
                          >
                            <AssignmentIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleSendMessage(application)}
                            title="Send Message"
                            color="primary"
                          >
                            <MessageIcon />
                          </IconButton>
                          {application.status === 'PENDING' && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => setStatusDialog({
                                  open: true,
                                  application: application,
                                  status: 'ACCEPTED',
                                  notes: ''
                                })}
                                title="Accept Application"
                                color="success"
                              >
                                <AcceptIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => setStatusDialog({
                                  open: true,
                                  application: application,
                                  status: 'REJECTED',
                                  notes: ''
                                })}
                                title="Reject Application"
                                color="error"
                              >
                                <RejectIcon />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialog.open} 
        onClose={() => setStatusDialog({ open: false, application: null, status: '', notes: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Application Status
          {statusDialog.application && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {statusDialog.application.applicantName} - {statusDialog.application.serviceTitle}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusDialog.status}
                  label="Status"
                  onChange={(e) => setStatusDialog(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="ACCEPTED">Accepted</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                  <MenuItem value="WITHDRAWN">Withdrawn</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status Notes"
                multiline
                rows={3}
                value={statusDialog.notes}
                onChange={(e) => setStatusDialog(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this status update..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, application: null, status: '', notes: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            disabled={!statusDialog.status}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Applications;
