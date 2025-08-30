import { useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography, List, ListItem, ListItemText } from '@mui/material'
import api from '../api/client.js'

export default function DocumentsPage() {
  const [docs, setDocs] = useState([])
  const [programType, setProgramType] = useState('SNAP_ENT')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)

  const load = async () => {
    const r = await api.get('/documents')
    setDocs(r.data || [])
  }

  const upload = async () => {
    const fd = new FormData()
    fd.append('programType', programType)
    fd.append('description', description)
    fd.append('file', file)
    await api.post('/documents/upload', fd)
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Program Documents</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}><TextField fullWidth label="Program Type" value={programType} onChange={e => setProgramType(e.target.value)} /></Grid>
        <Grid item xs={12} md={5}><TextField fullWidth label="Description" value={description} onChange={e => setDescription(e.target.value)} /></Grid>
        <Grid item xs={12} md={2}><Button variant="outlined" component="label">Choose File<input type="file" hidden onChange={e => setFile(e.target.files?.[0] || null)} /></Button></Grid>
        <Grid item xs={12} md={2}><Button variant="contained" onClick={upload} disabled={!file}>Upload</Button></Grid>
      </Grid>
      <List>
        {docs.map((d, i) => (
          <ListItem key={i}>
            <ListItemText primary={`${d.programType} — ${d.description}`} secondary={d.status} />
          </ListItem>
        ))}
      </List>
    </>
  )
}


