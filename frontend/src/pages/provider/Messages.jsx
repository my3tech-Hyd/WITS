import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { providerAPI } from '../../api/apiService.js';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  LinearProgress,
  Alert,
  Paper,
  Grid,
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Message as MessageIcon,
  AttachFile as AttachFileIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  wordWrap: 'break-word',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[100],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  marginLeft: isOwn ? 'auto' : 0,
  marginRight: isOwn ? 0 : 'auto',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  height: '60vh',
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const Messages = () => {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    fetchMessages();
    // Check if we have recipient info from navigation state
    if (location.state) {
      setSelectedRecipient({
        id: location.state.recipientId,
        name: location.state.recipientName,
        serviceId: location.state.serviceId,
        applicationId: location.state.applicationId
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const data = await providerAPI.getMessages();
      setMessages(data);
      
      // Extract unique recipients
      const uniqueRecipients = data.reduce((acc, msg) => {
        const recipientId = msg.senderId === 'current-user-id' ? msg.receiverId : msg.senderId;
        const recipientName = msg.senderId === 'current-user-id' ? msg.receiverName : msg.senderName;
        
        if (!acc.find(r => r.id === recipientId)) {
          acc.push({
            id: recipientId,
            name: recipientName,
            type: msg.senderId === 'current-user-id' ? msg.receiverType : msg.senderType,
            lastMessage: msg.content,
            lastMessageTime: msg.sentAt,
            unread: msg.senderId !== 'current-user-id' && !msg.isRead
          });
        }
        return acc;
      }, []);
      
      setRecipients(uniqueRecipients);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while loading messages.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRecipient) return;

    setSending(true);
    try {
      const messageData = {
        receiverId: selectedRecipient.id,
        subject: `Message from Provider`,
        content: newMessage,
        serviceId: selectedRecipient.serviceId,
        applicationId: selectedRecipient.applicationId
      };
      
      const sentMessage = await providerAPI.sendMessage(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      setMessage({ type: 'success', text: 'Message sent successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while sending the message.' });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationMessages = (recipientId) => {
    return messages.filter(msg => 
      msg.senderId === recipientId || msg.receiverId === recipientId
    ).sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Messages
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ height: 'calc(100% - 100px)' }}>
        {/* Recipients List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MessageIcon sx={{ mr: 1 }} />
                Conversations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {recipients.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No conversations yet. Messages will appear here once you start communicating.
                </Typography>
              ) : (
                <List sx={{ maxHeight: 'calc(100% - 80px)', overflow: 'auto' }}>
                  {recipients.map((recipient) => (
                    <ListItem
                      key={recipient.id}
                      button
                      selected={selectedRecipient?.id === recipient.id}
                      onClick={() => setSelectedRecipient(recipient)}
                      sx={{ mb: 1, borderRadius: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {recipient.type === 'PROVIDER' ? <BusinessIcon /> : <PersonIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {recipient.name}
                            </Typography>
                            {recipient.unread && (
                              <Chip label="New" size="small" color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {recipient.lastMessage}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(recipient.lastMessageTime)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Messages Area */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedRecipient ? (
              <>
                {/* Header */}
                <CardContent sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>
                      {selectedRecipient.type === 'PROVIDER' ? <BusinessIcon /> : <PersonIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {selectedRecipient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRecipient.type}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Messages */}
                <MessagesContainer>
                  {getConversationMessages(selectedRecipient.id).map((msg, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <MessageBubble isOwn={msg.senderId === 'current-user-id'}>
                        <Typography variant="body1">
                          {msg.content}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
                          {formatDate(msg.sentAt)}
                        </Typography>
                      </MessageBubble>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </MessagesContainer>

                {/* Message Input */}
                <CardContent sx={{ borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={sending}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <AttachFileIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      startIcon={<SendIcon />}
                      sx={{ minWidth: 100 }}
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </Button>
                  </Box>
                </CardContent>
              </>
            ) : (
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a recipient from the list to start messaging
                  </Typography>
                </Box>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Messages;
