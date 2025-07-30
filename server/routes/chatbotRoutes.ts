import type { Express } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { chatbotConversations, chatbotUserProfiles, chatbotFeedback } from "@shared/schema";
import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { AIChatbotService, USER_PROFILES } from "../services/aiChatbotService";

export function registerChatbotRoutes(app: Express) {
  // Start new conversation
  app.post("/api/chatbot/conversation", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const sessionId = nanoid();
      
      // Detect user profile from initial message
      const profileDetection = AIChatbotService.detectUserProfile(message);
      
      // Generate initial response
      const aiResponse = AIChatbotService.generateResponse(
        message, 
        profileDetection.profile,
        { hasWelcomed: false }
      );

      // Get first tailored question
      const nextQuestion = AIChatbotService.getNextQuestion(profileDetection.profile);

      // Create conversation record
      const [conversation] = await db
        .insert(chatbotConversations)
        .values({
          userId: userId || null,
          sessionId,
          userProfile: profileDetection.profile !== 'unknown' ? profileDetection.profile : null,
          messages: [
            {
              role: 'user',
              content: message,
              timestamp: new Date().toISOString()
            },
            {
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date().toISOString()
            }
          ],
          profileConfidence: profileDetection.confidence.toString(),
          currentQuestionIndex: 0,
          completedQuestions: [],
          userGoals: [],
          preferences: {},
        })
        .returning();

      // Save user profile if detected
      if (profileDetection.profile !== 'unknown' && userId) {
        await db
          .insert(chatbotUserProfiles)
          .values({
            userId,
            profileType: profileDetection.profile,
            confidence: profileDetection.confidence.toString(),
            keywords: USER_PROFILES[profileDetection.profile as keyof typeof USER_PROFILES]?.keywords || [],
            responses: [message]
          })
          .onConflictDoUpdate({
            target: [chatbotUserProfiles.userId, chatbotUserProfiles.profileType],
            set: {
              confidence: profileDetection.confidence.toString(),
              responses: [message],
              lastUpdated: new Date()
            }
          });
      }

      res.json({
        conversationId: conversation.id,
        sessionId: conversation.sessionId,
        response: aiResponse,
        nextQuestion,
        profileDetected: profileDetection.profile,
        confidence: profileDetection.confidence,
        recommendations: AIChatbotService.getPersonalizedRecommendations(profileDetection.profile)
      });

    } catch (error) {
      console.error("Error starting chatbot conversation:", error);
      res.status(500).json({ error: "Failed to start conversation" });
    }
  });

  // Continue existing conversation
  app.post("/api/chatbot/conversation/:sessionId/message", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { message, userId } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get existing conversation
      const [conversation] = await db
        .select()
        .from(chatbotConversations)
        .where(eq(chatbotConversations.sessionId, sessionId))
        .limit(1);

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const currentMessages = conversation.messages || [];
      const profileType = conversation.userProfile || 'unknown';

      // Generate AI response
      const aiResponse = AIChatbotService.generateResponse(
        message,
        profileType,
        { hasWelcomed: true, conversationHistory: currentMessages }
      );

      // Get next question
      const completedQuestions = conversation.completedQuestions || [];
      const nextQuestionIndex = (conversation.currentQuestionIndex || 0) + 1;
      const nextQuestion = AIChatbotService.getNextQuestion(
        profileType,
        completedQuestions,
        nextQuestionIndex
      );

      // Update conversation
      const updatedMessages = [
        ...currentMessages,
        {
          role: 'user' as const,
          content: message,
          timestamp: new Date().toISOString()
        },
        {
          role: 'assistant' as const,
          content: aiResponse,
          timestamp: new Date().toISOString()
        }
      ];

      await db
        .update(chatbotConversations)
        .set({
          messages: updatedMessages,
          currentQuestionIndex: nextQuestionIndex,
          completedQuestions: nextQuestion ? completedQuestions : [...completedQuestions, message],
          updatedAt: new Date()
        })
        .where(eq(chatbotConversations.sessionId, sessionId));

      // Analyze conversation completion
      const completionAnalysis = AIChatbotService.analyzeConversationCompletion({
        ...conversation,
        messages: updatedMessages,
        completedQuestions: nextQuestion ? completedQuestions : [...completedQuestions, message]
      });

      res.json({
        response: aiResponse,
        nextQuestion,
        profileType,
        confidence: conversation.profileConfidence,
        completionAnalysis,
        recommendations: AIChatbotService.getPersonalizedRecommendations(
          profileType,
          updatedMessages.filter(m => m.role === 'user').map(m => m.content)
        )
      });

    } catch (error) {
      console.error("Error continuing chatbot conversation:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Get conversation history
  app.get("/api/chatbot/conversation/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;

      const [conversation] = await db
        .select()
        .from(chatbotConversations)
        .where(eq(chatbotConversations.sessionId, sessionId))
        .limit(1);

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Generate conversation summary
      const summary = AIChatbotService.generateConversationSummary(conversation);
      
      // Analyze completion status
      const completionAnalysis = AIChatbotService.analyzeConversationCompletion(conversation);

      res.json({
        conversation,
        summary,
        completionAnalysis,
        recommendations: AIChatbotService.getPersonalizedRecommendations(
          conversation.userProfile || 'unknown',
          conversation.messages?.filter(m => m.role === 'user').map(m => m.content) || []
        )
      });

    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Get user's conversation history
  app.get("/api/chatbot/conversations", async (req, res) => {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const conversations = await db
        .select()
        .from(chatbotConversations)
        .where(eq(chatbotConversations.userId, userId as string))
        .orderBy(desc(chatbotConversations.createdAt))
        .limit(20);

      const conversationsWithAnalysis = conversations.map(conversation => ({
        ...conversation,
        completionAnalysis: AIChatbotService.analyzeConversationCompletion(conversation),
        messageCount: conversation.messages?.length || 0
      }));

      res.json({ conversations: conversationsWithAnalysis });

    } catch (error) {
      console.error("Error fetching user conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Submit feedback
  app.post("/api/chatbot/feedback", async (req, res) => {
    try {
      const { conversationId, userId, rating, feedbackText, improvementSuggestions, wasHelpful, recommendedFeatures } = req.body;

      const feedbackSchema = z.object({
        conversationId: z.number(),
        userId: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        feedbackText: z.string().optional(),
        improvementSuggestions: z.array(z.string()).optional(),
        wasHelpful: z.boolean().optional(),
        recommendedFeatures: z.array(z.string()).optional()
      });

      const validatedData = feedbackSchema.parse({
        conversationId,
        userId,
        rating,
        feedbackText,
        improvementSuggestions,
        wasHelpful,
        recommendedFeatures
      });

      await db
        .insert(chatbotFeedback)
        .values(validatedData);

      // Mark conversation as feedback provided
      await db
        .update(chatbotConversations)
        .set({ feedbackProvided: true })
        .where(eq(chatbotConversations.id, conversationId));

      res.json({ success: true, message: "Feedback submitted successfully" });

    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Get chatbot analytics (for admin)
  app.get("/api/chatbot/analytics", async (req, res) => {
    try {
      // Total conversations
      const totalConversations = await db
        .select({ count: chatbotConversations.id })
        .from(chatbotConversations);

      // Profile distribution
      const profileDistribution = await db
        .select()
        .from(chatbotUserProfiles);

      // Recent feedback
      const recentFeedback = await db
        .select()
        .from(chatbotFeedback)
        .orderBy(desc(chatbotFeedback.createdAt))
        .limit(10);

      res.json({
        totalConversations: totalConversations.length,
        profileDistribution: profileDistribution.reduce((acc, profile) => {
          acc[profile.profileType] = (acc[profile.profileType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentFeedback,
        availableProfiles: Object.keys(USER_PROFILES)
      });

    } catch (error) {
      console.error("Error fetching chatbot analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
}