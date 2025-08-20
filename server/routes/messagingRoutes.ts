import type { Express } from "express";
import { isAuthenticated } from "../multiAuth";
import { storage } from "../storage";
import { nanoid } from "nanoid";
import WebSocket from "ws";

// Store WebSocket clients for real-time messaging
const messagingClients = new Map<string, WebSocket>();

export function registerMessagingRoutes(app: Express, wss?: WebSocket.Server) {
  
  // ===========================================
  // Message Conversations API
  // ===========================================

  // Get user conversations (threads)
  app.get('/api/messaging/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { type } = req.query; // 'direct', 'group', 'team', 'forum'
      
      // Mock data for now - replace with actual database calls once schema is synced
      const mockConversations = [
        {
          id: "conv_direct_1",
          name: "Guillaume Lauzier",
          type: "direct",
          lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
          lastMessage: "Great insights on the AI model performance!",
          unreadCount: 2,
          participants: [
            { id: userId, name: "You" },
            { id: "user_2", name: "Guillaume Lauzier", avatar: "https://avatars.githubusercontent.com/u/55703540?v=4" }
          ]
        },
        {
          id: "conv_team_1", 
          name: "AI Trading Pioneers",
          type: "team",
          lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
          lastMessage: "New model deployment is ready for review",
          unreadCount: 5,
          participants: [
            { id: userId, name: "You" },
            { id: "user_2", name: "Sarah Chen", avatar: null },
            { id: "user_3", name: "Mike Rodriguez", avatar: null }
          ]
        },
        {
          id: "conv_forum_1",
          name: "Best AI models for crypto trading in 2025?",
          type: "forum", 
          lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
          lastMessage: "I've been using the Quantum Risk Predictor with great results...",
          unreadCount: 0,
          participants: [
            { id: "user_4", name: "CryptoAnalyst", avatar: null },
            { id: "user_5", name: "Alex Thompson", avatar: null }
          ]
        }
      ];

      let filteredConversations = mockConversations;
      if (type && type !== 'all') {
        filteredConversations = mockConversations.filter(conv => conv.type === type);
      }

      res.json(filteredConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get conversation messages
  app.get('/api/messaging/conversations/:conversationId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;
      const { limit = 50, before } = req.query;

      // Mock messages data
      const mockMessages = [
        {
          id: "msg_1",
          conversationId,
          senderId: "user_2",
          senderName: "Guillaume Lauzier",
          senderAvatar: "https://avatars.githubusercontent.com/u/55703540?v=4",
          content: "Hey! I saw your analysis on the new portfolio optimization model. Really impressive work!",
          type: "text",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isOwn: false
        },
        {
          id: "msg_2", 
          conversationId,
          senderId: userId,
          senderName: "You",
          senderAvatar: req.user.profileImageUrl,
          content: "Thanks! I'm particularly excited about the risk assessment improvements. Have you had a chance to test it with your portfolio?",
          type: "text",
          createdAt: new Date(Date.now() - 3000000).toISOString(),
          isOwn: true
        },
        {
          id: "msg_3",
          conversationId,
          senderId: "user_2", 
          senderName: "Guillaume Lauzier",
          senderAvatar: "https://avatars.githubusercontent.com/u/55703540?v=4",
          content: "Not yet, but I'm planning to integrate it this week. The backtesting results look very promising. What's your experience been with the real-time alerts?",
          type: "text",
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          isOwn: false
        }
      ];

      res.json(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message
  app.post('/api/messaging/conversations/:conversationId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;
      const { content, type = 'text', metadata } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json({ message: "Message content is required" });
      }

      const newMessage = {
        id: nanoid(),
        conversationId,
        senderId: userId,
        senderName: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Anonymous',
        senderAvatar: req.user.profileImageUrl,
        content: content.trim(),
        type,
        metadata,
        createdAt: new Date().toISOString(),
        isOwn: true
      };

      // Broadcast to WebSocket clients if available
      if (wss) {
        const messageData = JSON.stringify({
          type: 'new_message',
          conversationId,
          message: newMessage
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(messageData);
          }
        });
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Create new conversation
  app.post('/api/messaging/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { name, type, participantIds = [] } = req.body;

      if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required" });
      }

      const newConversation = {
        id: nanoid(),
        name,
        type,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: null,
        lastMessageAt: null,
        unreadCount: 0,
        participants: [
          { id: userId, name: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() }
        ]
      };

      res.status(201).json(newConversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // ===========================================
  // Message Notifications API
  // ===========================================

  // Get unread notifications count
  app.get('/api/messaging/notifications/count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock notification count
      const mockCount = {
        total: 7,
        messages: 5,
        mentions: 2,
        threadReplies: 0
      };

      res.json(mockCount);
    } catch (error) {
      console.error("Error fetching notification count:", error);
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });

  // Get notifications
  app.get('/api/messaging/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { limit = 20, type } = req.query;

      const mockNotifications = [
        {
          id: "notif_1",
          type: "message",
          title: "New message from Guillaume Lauzier",
          message: "Hey! I saw your analysis on the new portfolio...",
          conversationId: "conv_direct_1",
          conversationName: "Guillaume Lauzier",
          senderId: "user_2",
          senderName: "Guillaume Lauzier",
          senderAvatar: "https://avatars.githubusercontent.com/u/55703540?v=4",
          isRead: false,
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: "notif_2",
          type: "mention",
          title: "You were mentioned in AI Trading Pioneers",
          message: "@you what do you think about this new model?",
          conversationId: "conv_team_1",
          conversationName: "AI Trading Pioneers",
          senderId: "user_3",
          senderName: "Mike Rodriguez", 
          senderAvatar: null,
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      let filteredNotifications = mockNotifications;
      if (type && type !== 'all') {
        filteredNotifications = mockNotifications.filter(notif => notif.type === type);
      }

      res.json(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.put('/api/messaging/notifications/:notificationId/read', isAuthenticated, async (req: any, res) => {
    try {
      const { notificationId } = req.params;
      
      res.json({ 
        message: "Notification marked as read",
        notificationId,
        readAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Mark all notifications as read
  app.put('/api/messaging/notifications/read-all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      res.json({
        message: "All notifications marked as read",
        readAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // ===========================================
  // Integration Settings API
  // ===========================================

  // Get integration settings
  app.get('/api/messaging/integrations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      const mockIntegrations = [
        {
          id: 1,
          provider: "slack",
          isEnabled: false,
          channelId: null,
          settings: {
            notifyOnMention: true,
            notifyOnDirectMessage: true,
            notifyOnTeamMessage: false
          },
          lastTestAt: null,
          testResult: null
        },
        {
          id: 2,
          provider: "teams",
          isEnabled: false,
          teamId: null,
          settings: {
            notifyOnMention: true,
            notifyOnDirectMessage: true,
            notifyOnTeamMessage: false
          },
          lastTestAt: null,
          testResult: null
        },
        {
          id: 3,
          provider: "discord",
          isEnabled: false,
          channelId: null,
          settings: {
            notifyOnMention: true,
            notifyOnDirectMessage: true,
            notifyOnTeamMessage: false
          },
          lastTestAt: null,
          testResult: null
        }
      ];

      res.json(mockIntegrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  // Update integration settings
  app.put('/api/messaging/integrations/:provider', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { provider } = req.params;
      const { isEnabled, webhookUrl, channelId, teamId, botToken, settings } = req.body;

      if (!['slack', 'teams', 'discord'].includes(provider)) {
        return res.status(400).json({ message: "Invalid provider" });
      }

      const updatedIntegration = {
        id: Date.now(),
        provider,
        isEnabled: isEnabled || false,
        webhookUrl,
        channelId,
        teamId,
        botToken: botToken ? "••••••••" : null, // Don't return actual token
        settings: settings || {},
        updatedAt: new Date().toISOString()
      };

      res.json(updatedIntegration);
    } catch (error) {
      console.error("Error updating integration:", error);
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  // Test integration
  app.post('/api/messaging/integrations/:provider/test', isAuthenticated, async (req: any, res) => {
    try {
      const { provider } = req.params;
      const { webhookUrl, botToken, channelId } = req.body;

      if (!['slack', 'teams', 'discord'].includes(provider)) {
        return res.status(400).json({ message: "Invalid provider" });
      }

      // Mock test - in real implementation, this would send actual test messages
      const testResult = {
        success: Math.random() > 0.3, // 70% success rate for demo
        message: Math.random() > 0.3 
          ? `Successfully sent test message to ${provider}` 
          : `Failed to connect to ${provider}. Please check your configuration.`,
        testedAt: new Date().toISOString()
      };

      res.json(testResult);
    } catch (error) {
      console.error("Error testing integration:", error);
      res.status(500).json({ message: "Failed to test integration" });
    }
  });

  console.log("💬 Messaging routes registered successfully!");
}