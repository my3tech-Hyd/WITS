import { useEffect, useState } from 'react'
import { Grid, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material'
import api from '../api/client.js'

export default function AppointmentsPage() {
  const [type, setType] = useState('CAREER_COUNSELING')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [my, setMy] = useState([])

  const load = async () => {
    const r = await api.get('/appointments')
    setMy(r.data || [])
  }

  const findSlots = async () => {
    const r = await api.get('/appointments/slots', { params: { type, date } })
    setSlots(r.data || [])
  }

  const schedule = async (slot) => {
    await api.post('/appointments/schedule', { appointmentType: type, slotId: slot.id, notes: '' })
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Appointments</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}><TextField label="Type" fullWidth value={type} onChange={e => setType(e.target.value)} /></Grid>
        <Grid item xs={12} md={4}><TextField type="date" label="Date" fullWidth value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
        <Grid item xs={12} md={4}><Button variant="contained" fullWidth onClick={findSlots}>Find Slots</Button></Grid>
      </Grid>
      <Typography variant="subtitle1">Available Slots</Typography>
      <List>
        {slots.map((s, i) => (
          <ListItem key={i} secondaryAction={<Button onClick={() => schedule(s)}>Book</Button>}>
            <ListItemText primary={`${s.start} - ${s.end}`} />
          </ListItem>
        ))}
      </List>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>My Appointments</Typography>
      <List>
        {my.map((a, i) => (
          <ListItem key={i}>
            <ListItemText primary={`${a.type} — ${a.slotStart}`} />
          </ListItem>
        ))}
      </List>
    </>
  )
}


