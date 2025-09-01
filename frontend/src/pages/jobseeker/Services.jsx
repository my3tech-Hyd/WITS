import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { jobSeekerServicesAPI } from "../../api/apiService";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [applicationDialog, setApplicationDialog] = useState({
    open: false,
    service: null,
    action: "",
  });
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    additionalNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await jobSeekerServicesAPI.getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to load services.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (service, action) => {
    setApplicationDialog({
      open: true,
      service,
      action,
    });
    setApplicationData({
      coverLetter: "",
      additionalNotes: "",
    });
  };

  const handleSubmitApplication = async () => {
    if (!applicationDialog.service) return;

    setSubmitting(true);
    try {
      const requestData = {
        status: applicationDialog.action === "join" ? "JOIN" : "NOT_INTERESTED",
        coverLetter: applicationData.coverLetter,
        additionalNotes: applicationData.additionalNotes,
      };

      if (applicationDialog.service.hasApplied) {
        await jobSeekerServicesAPI.updateServiceApplication(
          applicationDialog.service.id,
          requestData
        );
      } else {
        await jobSeekerServicesAPI.applyForService(
          applicationDialog.service.id,
          requestData
        );
      }

      setMessage({
        type: "success",
        text: `Successfully ${
          applicationDialog.action === "join"
            ? "applied for"
            : "marked as not interested in"
        } the service!`,
      });

      setApplicationDialog({ open: false, service: null, action: "" });
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to submit application.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (service) => {
    if (!service.hasApplied) {
      return null;
    }

    const status = service.myApplicationStatus;
    if (status === "JOIN") {
      return <Chip label="Applied" color="success" size="small" />;
    } else if (status === "NOT_INTERESTED") {
      return <Chip label="Not Interested" color="default" size="small" />;
    } else if (status === "ACCEPTED") {
      return <Chip label="Accepted" color="success" size="small" />;
    } else if (status === "REJECTED") {
      return <Chip label="Rejected" color="error" size="small" />;
    } else if (status === "WITHDRAWN") {
      return <Chip label="Withdrawn" color="default" size="small" />;
    } else if (status === "PENDING") {
      return <Chip label="Pending Review" color="warning" size="small" />;
    }
    return <Chip label={status} color="primary" size="small" />;
  };

  const getActionButtons = (service) => {
    if (service.hasApplied) {
      const status = service.myApplicationStatus;

      // Hide buttons for accepted, rejected, withdrawn, and pending statuses
      if (
        status === "ACCEPTED" ||
        status === "REJECTED" ||
        status === "WITHDRAWN" ||
        status === "PENDING"
      ) {
        return null; // No buttons shown for these statuses
      }

      if (status === "JOIN") {
        return (
          <Button
            variant="outlined"
            color="default"
            onClick={() => handleActionClick(service, "not_interested")}
            startIcon={<CancelIcon />}
            fullWidth
          >
            Mark as Not Interested
          </Button>
        );
      } else if (status === "NOT_INTERESTED") {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleActionClick(service, "join")}
            startIcon={<CheckCircleIcon />}
            fullWidth
          >
            Apply Now
          </Button>
        );
      }
    }

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleActionClick(service, "join")}
          startIcon={<CheckCircleIcon />}
          sx={{ flex: 1 }}
        >
          Join
        </Button>
        <Button
          variant="outlined"
          color="default"
          onClick={() => handleActionClick(service, "not_interested")}
          startIcon={<CancelIcon />}
          sx={{ flex: 1 }}
        >
          Not Interested
        </Button>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Services & Courses
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Discover training programs, courses, and services offered by our
        providers
      </Typography>

      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} md={6} lg={4} key={service.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {service.bannerUrl && (
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${service.bannerUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                />
              )}
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
                    {service.title}
                  </Typography>
                  {getStatusChip(service)}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {service.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <SchoolIcon
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {service.providerName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationIcon
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {service.mode}{" "}
                      {service.location && `• ${service.location}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <TimeIcon
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {service.duration}
                    </Typography>
                  </Box>
                  {service.fees && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <MoneyIcon
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ${service.fees}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {service.tags && service.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {service.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}

                <Box sx={{ mt: "auto" }}>{getActionButtons(service)}</Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {services.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No services available at the moment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new training programs and courses
          </Typography>
        </Box>
      )}

      {/* Application Dialog */}
      <Dialog
        open={applicationDialog.open}
        onClose={() =>
          setApplicationDialog({ open: false, service: null, action: "" })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {applicationDialog.action === "join"
            ? "Apply for Service"
            : "Mark as Not Interested"}
        </DialogTitle>
        <DialogContent>
          {applicationDialog.service && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">
                {applicationDialog.service.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {applicationDialog.service.providerName}
              </Typography>
            </Box>
          )}

          {applicationDialog.action === "join" && (
            <>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Cover Letter (Optional)"
                value={applicationData.coverLetter}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    coverLetter: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Notes (Optional)"
                value={applicationData.additionalNotes}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    additionalNotes: e.target.value,
                  })
                }
              />
            </>
          )}

          {applicationDialog.action === "not_interested" && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason (Optional)"
              value={applicationData.additionalNotes}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  additionalNotes: e.target.value,
                })
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setApplicationDialog({ open: false, service: null, action: "" })
            }
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitApplication}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
