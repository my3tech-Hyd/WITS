import { useEffect, useState } from 'react'
import { TextField, Grid, Card, CardContent, Typography, Button } from '@mui/material'
import api from '../api/client.js'

export default function JobsPage() {
  const [q, setQ] = useState('')
  const [jobs, setJobs] = useState([])

  const search = async () => {
    const res = await api.get('/jobs', { params: { q } })
    setJobs(Array.isArray(res.data) ? res.data : (res.data?.content || []))
  }

  useEffect(() => { search() }, [])

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={8}><TextField fullWidth label="Search jobs" value={q} onChange={e => setQ(e.target.value)} /></Grid>
        <Grid item xs={12} sm={4}><Button fullWidth variant="contained" onClick={search}>Search</Button></Grid>
      </Grid>
      <Grid container spacing={2}>
        {jobs.map((j, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card>
              <CardContent>
                <Typography variant="h6">{j.title}</Typography>
                <Typography variant="body2" color="text.secondary">{j.location}</Typography>
                <Typography sx={{ my: 1 }}>{j.description?.slice(0, 160)}...</Typography>
                <Button size="small" variant="outlined">Save</Button>
                <Button size="small" variant="contained" sx={{ ml: 1 }} onClick={async () => {
                  try { await api.post('/applications', { jobPostingId: j.id || j.jobId }); alert('Applied'); }
                  catch (e) { alert(e.response?.data?.message || e.message) }
                }}>Apply</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}


