import { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import api from '../api/client.js'

export default function ApplicationsPage() {
  const [apps, setApps] = useState([])
  useEffect(() => {
    api.get('/applications', { params: { userId: 'me' } }).then(r => setApps(r.data?.applications || r.data || []))
  }, [])
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>My Applications</Typography>
      <List>
        {apps.map((a, idx) => (
          <ListItem key={idx} divider>
            <ListItemText primary={`${a.jobTitle} — ${a.status}`} secondary={a.applicationDate} />
          </ListItem>
        ))}
      </List>
    </>
  )
}


