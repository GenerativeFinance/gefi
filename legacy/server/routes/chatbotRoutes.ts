import type { Express } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { chatbotConversations, chatbotUserProfiles, chatbotFeedback, users } from "@shared/schema";
import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { AIChatbotService, USER_PROFILES } from "../services/aiChatbotService";
import { storage } from "../storage";
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';

// Security utilities for AI Assistant Signup
class SecurityService {
  // Anti-prompt injection patterns
  private static suspiciousPatterns = [
    /ignore\s+instructions?/i,
    /system\s+prompt/i,
    /forget\s+(all|everything|previous)/i,
    /<script[^>]*>/i,
    /\{.*\}/,
    /\[.*\]/,
    /delete\s+(database|table|user)/i,
    /admin\s+(access|rights|privileges)/i,
    /sql\s+(drop|delete|insert|update)/i,
    /javascript:/i,
    /eval\s*\(/i,
    /exec\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i
  ];

  static sanitizeInput(input: string): { clean: string; isSuspicious: boolean } {
    if (!input || typeof input !== 'string') {
      return { clean: '', isSuspicious: false };
    }

    const isSuspicious = this.suspiciousPatterns.some(pattern => pattern.test(input));
    
    // Clean input by removing suspicious patterns
    let clean = input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/[\{\}\[\]]/g, '') // Remove brackets
      .trim();

    // Limit length
    if (clean.length > 500) {
      clean = clean.substring(0, 500);
    }

    return { clean, isSuspicious };
  }

  static async verifyRecaptcha(token: string): Promise<boolean> {
    if (!process.env.GOOGLE_RECAPTCHA_SECRET) {
      console.warn('reCAPTCHA secret not configured');
      return true; // Allow in development
    }

    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${token}`
      });

      const data = await response.json() as any;
      return data.success && data.score >= 0.5;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }

  static async logSecurityEvent(type: string, details: any, ip?: string) {
    try {
      await db.insert(chatbotConversations).values({
        userId: null,
        sessionId: `security_${nanoid()}`,
        userProfile: 'security_log',
        messages: [{
          role: 'system',
          content: `Security Event: ${type}`,
          timestamp: new Date().toISOString()
        }],
        profileConfidence: '0',
        currentQuestionIndex: -1,
        completedQuestions: [],
        userGoals: [],
        preferences: {
          type,
          details,
          ip,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}

// Enhanced signup completion schema
const signupCompletionSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  country: z.string().min(1),
  role: z.string().min(1),
  company: z.string().optional(),
  experienceLevel: z.string().optional(),
  areasOfFocus: z.array(z.string()).optional(),
  linkedinProfile: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  preferredModelTypes: z.array(z.string()).optional(),
  platformIntent: z.string().optional(),
  subscriptionPreferences: z.array(z.string()).optional(),
  wantsDemo: z.boolean().default(false),
  sessionId: z.string()
});

// Helper function to map experience level and platform intent to role
function mapExperienceLevelToRole(experienceLevel: string, platformIntent: string): string {
  // Map based on experience level and intent
  if (platformIntent.includes('Sell') || platformIntent.includes('Upload')) {
    return 'developer';
  }
  
  switch (experienceLevel.toLowerCase()) {
    case 'expert':
      return 'analyst';
    case 'intermediate':
      return 'trader';
    case 'beginner':
    default:
      return 'investor';
  }
}

// Rate limiting for signup endpoints
const signupLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many signup attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export function registerChatbotRoutes(app: Express) {
  
  // Security middleware for signup routes
  const securityMiddleware = async (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Check honeypot field
    if (req.body.honeypot && req.body.honeypot.trim() !== '') {
      await SecurityService.logSecurityEvent('honeypot_triggered', { body: req.body }, ip);
      return res.status(400).json({ error: 'Bot detected. Please try again.' });
    }

    // Verify reCAPTCHA if provided
    if (req.body.recaptchaToken) {
      const isValidRecaptcha = await SecurityService.verifyRecaptcha(req.body.recaptchaToken);
      if (!isValidRecaptcha) {
        await SecurityService.logSecurityEvent('recaptcha_failed', { token: req.body.recaptchaToken }, ip);
        return res.status(400).json({ error: 'Bot detected. Please try again.' });
      }
    }

    next();
  };

  // Enhanced signup completion endpoint with security
  app.post("/api/chatbot/signup/complete", signupLimiter, securityMiddleware, async (req, res) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      
      // Sanitize all input fields
      const sanitizedBody = { ...req.body };
      let hasSuspiciousInput = false;
      
      for (const [key, value] of Object.entries(sanitizedBody)) {
        if (typeof value === 'string') {
          const { clean, isSuspicious } = SecurityService.sanitizeInput(value);
          sanitizedBody[key] = clean;
          if (isSuspicious) {
            hasSuspiciousInput = true;
            await SecurityService.logSecurityEvent('suspicious_input', { 
              field: key, 
              original: value, 
              cleaned: clean 
            }, ip);
          }
        }
      }
      
      // Block if suspicious input detected
      if (hasSuspiciousInput) {
        return res.status(400).json({ 
          error: 'Invalid input detected. Please try again.',
          code: 'SUSPICIOUS_INPUT'
        });
      }
      
      const validatedData = signupCompletionSchema.parse(sanitizedBody);
      
      // Generate unique user ID
      const userId = `signup_${nanoid(10)}`;
      
      // Prepare user data for database
      const userData = {
        id: userId,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role.toLowerCase().replace(/\s+/g, '_'),
        status: 'pending' as const,
        provider: 'email',
        profileImageUrl: null,
        subscriptionTier: 'free',
        // Enhanced profile fields
        company: validatedData.company || null,
        country: validatedData.country,
        experienceLevel: validatedData.experienceLevel || null,
        areasOfFocus: validatedData.areasOfFocus || [],
        linkedinProfile: validatedData.linkedinProfile || null,
        portfolioUrl: validatedData.portfolioUrl || null,
        preferredModelTypes: validatedData.preferredModelTypes || [],
        platformIntent: validatedData.platformIntent || null,
        subscriptionPreferences: validatedData.subscriptionPreferences || [],
      };
      
      // Save user to database
      const [newUser] = await db.insert(users).values(userData).returning();
      
      // Handle Calendly booking if requested
      let calendlyBookingUrl = null;
      if (validatedData.wantsDemo) {
        try {
          calendlyBookingUrl = await createCalendlySchedulingLink(
            validatedData.email,
            `${validatedData.firstName} ${validatedData.lastName}`,
            validatedData.role
          );
        } catch (calendlyError) {
          console.error('Calendly booking error:', calendlyError);
          // Continue without blocking signup if Calendly fails
        }
      }
      
      // Save chatbot conversation record (with correct column names)
      try {
        await db.insert(chatbotConversations).values({
          userId: userId,
          sessionId: validatedData.sessionId,
          userProfile: validatedData.role,
          messages: [
            {
              role: 'assistant',
              content: 'Signup completed successfully',
              timestamp: new Date().toISOString()
            }
          ],
          currentQuestionIndex: 999, // Completed
          completedQuestions: ['email', 'firstName', 'lastName', 'country', 'role'],
          userGoals: validatedData.areasOfFocus || [],
          preferences: {
            experienceLevel: validatedData.experienceLevel,
            platformIntent: validatedData.platformIntent,
            preferredModelTypes: validatedData.preferredModelTypes
          },
        });
      } catch (conversationError) {
        console.error('Failed to save conversation, but user created:', conversationError);
        // Don't fail the signup if conversation save fails
      }
      
      // Return success response
      res.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
        },
        calendlyBookingUrl,
        confirmationMessage: calendlyBookingUrl 
          ? `Your demo session booking link: ${calendlyBookingUrl}`
          : 'Account created successfully! You can book a demo anytime from your dashboard.'
      });
      
    } catch (error) {
      console.error('Signup completion error:', error);
      res.status(400).json({ 
        error: 'Failed to complete signup',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Calendly scheduling link creation
  async function createCalendlySchedulingLink(email: string, name: string, role: string): Promise<string> {
    if (!process.env.CALENDLY_CLIENT_ID || !process.env.CALENDLY_CLIENT_SECRET) {
      throw new Error('Calendly credentials not configured');
    }
    
    try {
      // Create scheduling link using Calendly API
      const response = await fetch('https://api.calendly.com/scheduling_links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CALENDLY_CLIENT_SECRET}`, // Using client secret as API key
        },
        body: JSON.stringify({
          max_event_count: 1,
          owner: `https://api.calendly.com/users/${process.env.CALENDLY_CLIENT_ID}`, // Owner URI
          owner_type: 'User'
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Calendly API error:', response.status, errorText);
        // Return direct Calendly link as fallback
        return 'https://calendly.com/generativefinance/30min';
      }
      
      const data = await response.json() as any;
      return data.resource?.booking_url || 'https://calendly.com/generativefinance/30min';
      
    } catch (error) {
      console.error('Calendly integration error:', error);
      // Return direct Calendly link as fallback
      return 'https://calendly.com/generativefinance/30min';
    }
  }

  // Security test question endpoint
  app.post("/api/chatbot/security-check", signupLimiter, async (req, res) => {
    try {
      const { answer } = req.body;
      const { clean, isSuspicious } = SecurityService.sanitizeInput(answer);
      
      if (isSuspicious) {
        const ip = req.ip || req.connection.remoteAddress;
        await SecurityService.logSecurityEvent('security_check_suspicious', { answer }, ip);
        return res.status(400).json({ error: 'Invalid input detected.' });
      }
      
      // Simple math check: "What is 2 + 2?"
      const correctAnswers = ['4', 'four', 'Four', 'FOUR'];
      const isCorrect = correctAnswers.includes(clean.trim());
      
      if (!isCorrect) {
        const ip = req.ip || req.connection.remoteAddress;
        await SecurityService.logSecurityEvent('security_check_failed', { answer: clean }, ip);
      }
      
      res.json({ success: isCorrect });
    } catch (error) {
      console.error('Security check error:', error);
      res.status(500).json({ error: 'Security check failed' });
    }
  });

  // Email verification endpoints with security
  app.post("/api/auth/check-email", signupLimiter, securityMiddleware, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      res.json({ exists: existingUser.length > 0 });
    } catch (error) {
      console.error('Email check error:', error);
      res.status(500).json({ error: 'Failed to check email' });
    }
  });

  app.post("/api/auth/send-verification", signupLimiter, securityMiddleware, async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // In a real app, you would send this via email service
      console.log(`Verification code for ${email}: ${verificationCode}`);
      
      // For demo purposes, return the code
      res.json({ 
        success: true, 
        message: 'Verification code sent',
        verificationCode // Remove this in production
      });
    } catch (error) {
      console.error('Send verification error:', error);
      res.status(500).json({ error: 'Failed to send verification code' });
    }
  });

  app.post("/api/auth/verify-email", signupLimiter, securityMiddleware, async (req, res) => {
    try {
      const { email, code } = req.body;
      
      // In a real app, you would verify against stored codes
      // For demo purposes, accept any 6-digit code
      if (code && code.length === 6) {
        res.json({ success: true, message: 'Email verified successfully' });
      } else {
        res.status(400).json({ error: 'Invalid verification code' });
      }
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Failed to verify email' });
    }
  });

  // Complete chatbot signup and create account
  app.post("/api/auth/complete-chatbot-signup", signupLimiter, securityMiddleware, async (req, res) => {
    try {
      const {
        email,
        firstName,
        lastName,
        country,
        role,
        company,
        experienceLevel,
        areasOfFocus,
        linkedinProfile,
        portfolioUrl,
        preferredModelTypes,
        platformIntent,
        subscriptionPreferences,
        wantsDemo,
        sessionId
      } = req.body;

      // Validate required fields
      if (!email || !firstName || !lastName || !experienceLevel || !platformIntent) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['email', 'firstName', 'lastName', 'experienceLevel', 'platformIntent']
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: 'An account with this email already exists',
          suggestion: 'Try signing in instead'
        });
      }

      // Generate unique user ID
      const userId = `signup_${nanoid()}`;
      
      // Map experience level to role
      const userRole = mapExperienceLevelToRole(experienceLevel, platformIntent);
      
      // Create user data object
      const userData = {
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: userRole,
        status: 'pending' as const, // All chatbot signups start as pending
        provider: 'chatbot_signup',
        company: company || null,
        country: country || null,
        experienceLevel: experienceLevel,
        platformIntent: platformIntent,
        profileImageUrl: null,
        subscriptionTier: 'free' as const,
        riskScore: 0,
        totalTrades: 0,
        areasOfFocus: areasOfFocus || [],
        preferredModelTypes: preferredModelTypes || [],
        subscriptionPreferences: subscriptionPreferences || [],
        linkedinProfile: linkedinProfile || null,
        portfolioUrl: portfolioUrl || null,
        wantsDemo: wantsDemo || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create user in database
      const newUser = await storage.upsertUser(userData);
      
      // Create user profile
      try {
        await storage.createOrUpdateUserProfile(userId, {
          displayName: `${firstName} ${lastName}`,
          bio: `${experienceLevel} level ${userRole}${company ? ` at ${company}` : ''}${country ? ` from ${country}` : ''}`,
          profileCompleted: true,
          linkedinProfile: linkedinProfile || null,
          portfolioUrl: portfolioUrl || null,
          areasOfFocus: areasOfFocus || [],
          preferredModelTypes: preferredModelTypes || []
        });
      } catch (profileError) {
        console.error('Failed to create profile for new user:', profileError);
        // Don't fail the user creation if profile creation fails
      }

      // Update the conversation record with completion status
      if (sessionId) {
        try {
          await db
            .update(chatbotConversations)
            .set({ 
              accountCreated: true,
              userId: userId,
              completedAt: new Date()
            })
            .where(eq(chatbotConversations.sessionId, sessionId));
        } catch (conversationError) {
          console.error('Failed to update conversation:', conversationError);
        }
      }

      console.log(`✅ Chatbot signup completed: ${userId} (${email})`);
      
      res.status(201).json({
        success: true,
        message: 'Account created successfully! Please check your email for verification.',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          status: newUser.status,
          experienceLevel: newUser.experienceLevel,
          platformIntent: newUser.platformIntent
        },
        nextSteps: [
          'Check your email for account verification',
          'Complete your profile setup',
          wantsDemo ? 'Schedule your demo call' : 'Explore the platform'
        ]
      });
      
    } catch (error) {
      console.error('Error completing chatbot signup:', error);
      res.status(500).json({ 
        error: 'Failed to create account',
        message: 'Please try again or contact support if the problem persists'
      });
    }
  });
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

      // Generate AI response with full context
      const aiResponse = AIChatbotService.generateResponse(
        message,
        profileType,
        { 
          hasWelcomed: true, 
          conversationHistory: currentMessages,
          userId: userId,
          sessionId: sessionId
        }
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

  // Complete chatbot signup - Create actual user account
  app.post("/api/chatbot/signup/complete", async (req, res) => {
    try {
      const { 
        email, 
        firstName, 
        lastName, 
        country, 
        role, 
        phone, 
        experience, 
        goals,
        sessionId 
      } = req.body;

      // Validate required fields
      if (!email || !firstName || !lastName) {
        return res.status(400).json({ 
          error: "Email, first name, and last name are required" 
        });
      }

      // Import storage to create user
      const { storage } = await import('../storage');

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          error: "User with this email already exists" 
        });
      }

      // Create new user account
      const userData = {
        email,
        firstName,
        lastName,
        role: role || 'user',
        status: 'active' as const,
        provider: 'chatbot',
        riskScore: 0,
        totalTrades: 0,
        subscriptionTier: 'free' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };

      const newUser = await storage.createUser(userData);

      // Create user profile with chatbot data
      if (newUser) {
        const profileData = {
          userId: newUser.id,
          displayName: `${firstName} ${lastName}`,
          bio: `Registered via AI Assistant as ${role}`,
          location: country,
          phone,
          experience,
          goals: goals ? [goals] : [],
          preferences: {
            role,
            registrationSource: 'chatbot',
            country,
            experience
          }
        };

        await storage.createOrUpdateUserProfile(newUser.id, profileData);

        // Update the chatbot conversation with user ID
        if (sessionId) {
          await db
            .update(chatbotConversations)
            .set({ 
              userId: newUser.id,
              isCompleted: true,
              updatedAt: new Date()
            })
            .where(eq(chatbotConversations.sessionId, sessionId));
        }

        console.log(`✅ New user created via chatbot: ${email} (${firstName} ${lastName})`);

        res.json({ 
          success: true, 
          message: "Account created successfully",
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
          }
        });
      }

    } catch (error) {
      console.error("Error completing chatbot signup:", error);
      res.status(500).json({ 
        error: "Failed to create account",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}