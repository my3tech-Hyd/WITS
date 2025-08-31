import { useEffect, useState } from 'react'
import { 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Alert,
  CircularProgress,
  Stack
} from '@mui/material'
import { Search, Work, LocationOn, Business } from '@mui/icons-material'
import { jobAPI, applicationAPI } from '../api/apiService.js'

export default function JobsPage() {
  const [q, setQ] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })

  const search = async () => {
    setLoading(true)
    try {
      const response = await jobAPI.searchJobs(q)
      setJobs(response || [])
    } catch (error) {
      console.error('Failed to search jobs:', error)
      setMessage({ type: 'error', text: 'Failed to search jobs' })
    } finally {
      setLoading(false)
    }
  }

  const loadAllJobs = async () => {
    setLoading(true)
    try {
      const response = await jobAPI.getAllJobs()
      setJobs(response || [])
    } catch (error) {
      console.error('Failed to load jobs:', error)
      setMessage({ type: 'error', text: 'Failed to load jobs' })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId) => {
    setApplying(prev => ({ ...prev, [jobId]: true }))
    try {
      await applicationAPI.applyForJob({ jobPostingId: jobId })
      setMessage({ type: 'success', text: 'Application submitted successfully!' })
      // Remove the job from the list or mark it as applied
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, applied: true } : job
      ))
    } catch (error) {
      console.error('Failed to apply for job:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to apply for job' })
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }))
    }
  }

  useEffect(() => { 
    loadAllJobs() 
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'INACTIVE': return 'error'
      case 'HOLD': return 'warning'
      default: return 'default'
    }
  }

  const formatSalary = (minSalary, maxSalary) => {
    if (!minSalary && !maxSalary) return 'Not specified'
    if (minSalary && maxSalary) return `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`
    if (minSalary) return `From $${minSalary.toLocaleString()}`
    if (maxSalary) return `Up to $${maxSalary.toLocaleString()}`
    return 'Not specified'
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Find Your Next Job
      </Typography>

      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={8}>
          <TextField 
            fullWidth 
            label="Search jobs" 
            value={q} 
            onChange={e => setQ(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && search()}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: 'text.secondary' }} />
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={search}
            disabled={loading}
            sx={{ height: 56 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job, i) => (
            <Grid item xs={12} md={6} lg={4} key={job.id || i}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {job.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Business fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {job.companyName || 'Company not specified'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {job.location || 'Location not specified'}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={job.jobType?.replace('_', ' ') || 'Full Time'} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip 
                      label={job.status} 
                      size="small" 
                      color={getStatusColor(job.status)}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {job.description?.slice(0, 120)}...
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Salary:</strong> {formatSalary(job.minSalary, job.maxSalary)}
                  </Typography>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Skills:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {job.requiredSkills.slice(0, 3).map((skill, index) => (
                          <Chip key={index} label={skill} size="small" variant="outlined" />
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <Chip label={`+${job.requiredSkills.length - 3} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                  )}

                  <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      fullWidth
                      disabled={job.applied}
                    >
                      {job.applied ? 'Applied' : 'Save'}
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleApply(job.id)}
                      disabled={applying[job.id] || job.applied}
                    >
                      {applying[job.id] ? (
                        <CircularProgress size={16} />
                      ) : job.applied ? (
                        'Applied'
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}

      {!loading && jobs.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Box>
  )
}


