import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { providerAPI } from "../../api/apiService.js";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CloudDone as PublishIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const ManageServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    serviceId: null,
    serviceTitle: "",
  });
  const [publishDialog, setPublishDialog] = useState({
    open: false,
    serviceId: null,
    serviceTitle: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await providerAPI.getMyServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setMessage({
        type: "error",
        text: error.message || "An error occurred while loading services.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await providerAPI.deleteService(deleteDialog.serviceId);
      setMessage({ type: "success", text: "Service deleted successfully!" });
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error("Error deleting service:", error);
      setMessage({
        type: "error",
        text: error.message || "An error occurred while deleting the service.",
      });
    } finally {
      setDeleteDialog({ open: false, serviceId: null, serviceTitle: "" });
    }
  };

  const handlePublish = async () => {
    try {
      await providerAPI.publishService(publishDialog.serviceId);
      setMessage({ type: "success", text: "Service published successfully!" });
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error("Error publishing service:", error);
      setMessage({
        type: "error",
        text:
          error.message || "An error occurred while publishing the service.",
      });
    } finally {
      setPublishDialog({ open: false, serviceId: null, serviceTitle: "" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "DRAFT":
        return "warning";
      case "INACTIVE":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Manage Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/provider/services/new")}
        >
          Create New Service
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Mode</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Applications</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No services found. Create your first service to get
                        started!
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/provider/services/new")}
                        sx={{ mt: 2 }}
                      >
                        Create Service
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id} hover>
                      <TableCell>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {service.title}
                          </Typography>
                          {service.tags && service.tags.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              {service.tags.slice(0, 2).map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                              {service.tags.length > 2 && (
                                <Chip
                                  label={`+${service.tags.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={service.category} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={service.mode}
                          size="small"
                          variant="outlined"
                          color={
                            service.mode === "Online" ? "primary" : "secondary"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={service.status}
                          color={getStatusColor(service.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="body2">
                            Total: {service.totalApplications || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Pending: {service.pendingApplications || 0}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(service.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/provider/services/${service.id}`)
                            }
                            title="View Details"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/provider/services/${service.id}/edit`)
                            }
                            title="Edit Service"
                          >
                            <EditIcon />
                          </IconButton>
                          {service.status === "DRAFT" && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                setPublishDialog({
                                  open: true,
                                  serviceId: service.id,
                                  serviceTitle: service.title,
                                })
                              }
                              title="Publish Service"
                              color="success"
                            >
                              <PublishIcon />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                serviceId: service.id,
                                serviceTitle: service.title,
                              })
                            }
                            title="Delete Service"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({ open: false, serviceId: null, serviceTitle: "" })
        }
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.serviceTitle}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({
                open: false,
                serviceId: null,
                serviceTitle: "",
              })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog
        open={publishDialog.open}
        onClose={() =>
          setPublishDialog({ open: false, serviceId: null, serviceTitle: "" })
        }
      >
        <DialogTitle>Confirm Publish</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to publish "{publishDialog.serviceTitle}"?
            This will make it visible to applicants.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setPublishDialog({
                open: false,
                serviceId: null,
                serviceTitle: "",
              })
            }
          >
            Cancel
          </Button>
          <Button onClick={handlePublish} color="success" variant="contained">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageServices;
