import { useState } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Chip,
  IconButton,
  Alert
} from '@mui/material'
import { ArrowBack, Add, Close } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { jobAPI } from '../../api/apiService.js'

export default function CreateJobForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    jobType: 'FULL_TIME',
    location: '',
    minSalary: '',
    maxSalary: '',
    requiredSkills: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addSkill = () => {
    if (skillInput.trim() && !form.requiredSkills.includes(skillInput.trim())) {
      setForm({ ...form, requiredSkills: [...form.requiredSkills, skillInput.trim()] })
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setForm({ 
      ...form, 
      requiredSkills: form.requiredSkills.filter(skill => skill !== skillToRemove) 
    })
  }

  const clearForm = () => {
    setForm({
      title: '',
      description: '',
      jobType: 'FULL_TIME',
      location: '',
      minSalary: '',
      maxSalary: '',
      requiredSkills: []
    })
    setSkillInput('')
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await jobAPI.createJob(form)
      setSuccess('Job posted successfully!')
      clearForm()
      
      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/employer/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Post New Job
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Create a new job posting
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Job Title */}
              <TextField
                label="Job Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g., Senior Software Engineer"
              />

              {/* Job Description */}
              <TextField
                label="Job Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
              />

              {/* Job Type */}
              <FormControl fullWidth required>
                <InputLabel>Job Type</InputLabel>
                <Select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  label="Job Type"
                >
                  <MenuItem value="FULL_TIME">Full Time</MenuItem>
                  <MenuItem value="PART_TIME">Part Time</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                  <MenuItem value="INTERNSHIP">Internship</MenuItem>
                  <MenuItem value="TEMPORARY">Temporary</MenuItem>
                </Select>
              </FormControl>

              {/* Location */}
              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g., New York, NY or Remote"
              />

              {/* Salary Range */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Minimum Salary"
                  name="minSalary"
                  type="number"
                  value={form.minSalary}
                  onChange={handleChange}
                  fullWidth
                  placeholder="50000"
                />
                <TextField
                  label="Maximum Salary"
                  name="maxSalary"
                  type="number"
                  value={form.maxSalary}
                  onChange={handleChange}
                  fullWidth
                  placeholder="80000"
                />
              </Stack>

              {/* Required Skills */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Required Skills
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    label="Add Skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    size="small"
                    sx={{ flexGrow: 1 }}
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  <Button
                    variant="outlined"
                    onClick={addSkill}
                    startIcon={<Add />}
                    disabled={!skillInput.trim()}
                  >
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.requiredSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      deleteIcon={<Close />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              {/* Submit Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/employer/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !form.title || !form.description || !form.location}
                  sx={{ 
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
