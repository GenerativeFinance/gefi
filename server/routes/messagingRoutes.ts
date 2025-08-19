import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../middleware/auth';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const router = Router();

// Validation schemas
const createConversationSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['group', 'direct']),
  members: z.array(z.string()).optional()
});

const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1).max(5000),
  type: z.enum(['text', 'file', 'system']).default('text')
});

// Get user conversations
router.get('/conversations', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const conversations = await storage.getUserConversations(userId);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get conversation messages
router.get('/conversations/:conversationId/messages', isAuthenticated, async (req: any, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    // Check if user has access to this conversation
    const hasAccess = await storage.checkConversationAccess(userId, conversationId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    const messages = await storage.getConversationMessages(conversationId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create new conversation
router.post('/conversations', isAuthenticated, async (req: any, res) => {
  try {
    const validation = createConversationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid conversation data', details: validation.error });
    }

    const userId = req.user.id;
    const { name, type, members = [] } = validation.data;
    
    const conversationId = nanoid();
    const conversation = await storage.createConversation({
      id: conversationId,
      name,
      type,
      createdBy: userId,
      members: [...members, userId]
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send message
router.post('/messages', isAuthenticated, async (req: any, res) => {
  try {
    const validation = sendMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid message data', details: validation.error });
    }

    const userId = req.user.id;
    const { conversationId, content, type } = validation.data;
    
    // Check if user has access to this conversation
    const hasAccess = await storage.checkConversationAccess(userId, conversationId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    const messageId = nanoid();
    const message = await storage.createMessage({
      id: messageId,
      conversationId,
      senderId: userId,
      content,
      type: type || 'text'
    });

    // Emit real-time message via WebSocket (handled by WebSocket server)
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Join conversation
router.post('/conversations/:conversationId/join', isAuthenticated, async (req: any, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    await storage.addConversationMember(conversationId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error joining conversation:', error);
    res.status(500).json({ error: 'Failed to join conversation' });
  }
});

// Leave conversation
router.post('/conversations/:conversationId/leave', isAuthenticated, async (req: any, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    await storage.removeConversationMember(conversationId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving conversation:', error);
    res.status(500).json({ error: 'Failed to leave conversation' });
  }
});

export default router;