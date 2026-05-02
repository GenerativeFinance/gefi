import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: any;
}

interface ConnectedClient {
  ws: WebSocket;
  userId?: string;
}

export class MessagingWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      verifyClient: (info) => {
        // Basic verification - in production, verify JWT or session
        return true;
      }
    });

    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      console.log('New WebSocket connection established');
      
      const clientId = this.generateClientId();
      this.clients.set(clientId, { ws });

      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(clientId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(clientId);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection_established',
        data: { clientId }
      });
    });
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private handleMessage(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'authenticate':
        // Handle user authentication
        client.userId = message.data?.userId;
        console.log(`Client ${clientId} authenticated as user ${client.userId}`);
        break;

      case 'send_message':
        // Broadcast message to conversation members
        if (message.message) {
          this.broadcastMessage(message.message);
        }
        break;

      case 'join_conversation':
        // Handle joining a conversation
        console.log(`Client ${clientId} joined conversation ${message.data?.conversationId}`);
        break;

      case 'leave_conversation':
        // Handle leaving a conversation
        console.log(`Client ${clientId} left conversation ${message.data?.conversationId}`);
        break;

      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private sendToClient(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private broadcastMessage(message: any) {
    const messagePayload = {
      type: 'new_message',
      message
    };

    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(messagePayload));
      }
    });
  }

  public broadcastToConversation(conversationId: string, message: any) {
    // In a production app, you'd track which users are in which conversations
    // For now, broadcast to all connected clients
    this.broadcastMessage(message);
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}