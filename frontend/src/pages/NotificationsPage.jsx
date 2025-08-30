import { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material'
import api from '../api/client.js'

export default function NotificationsPage() {
  const [items, setItems] = useState([])
  const load = async () => {
    const r = await api.get('/notifications')
    setItems(r.data || [])
  }
  const markRead = async (id) => {
    await api.post(`/notifications/${id}/read`)
    await load()
  }
  useEffect(() => { load() }, [])
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
      <List>
        {items.map((n, i) => (
          <ListItem key={i} secondaryAction={!n.read && <Button onClick={() => markRead(n.id)}>Mark read</Button>}>
            <ListItemText primary={`${n.type}: ${n.message}`} secondary={n.eventTime} />
          </ListItem>
        ))}
      </List>
    </>
  )
}


