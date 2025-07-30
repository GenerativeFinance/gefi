import type { 
  ChatbotConversation, 
  InsertChatbotConversation,
  ChatbotUserProfile,
  InsertChatbotUserProfile 
} from "@shared/schema";

// User Profile Definitions with Keywords and Tailored Questions
export const USER_PROFILES = {
  beginner_investor: {
    keywords: ["new", "beginner", "learn", "start", "first time", "never invested", "basics", "help me understand"],
    questions: [
      "What are you hoping to achieve with investing?",
      "Do you understand basic investment terms like stocks, bonds, and mutual funds?",
      "How much risk are you comfortable taking with your investments?",
      "What's your timeline for investing - short-term or long-term goals?",
      "Have you set aside an emergency fund before investing?"
    ],
    welcomeMessage: "Great! I'll help you get started with investing basics. Let's understand your goals and comfort level.",
    recommendations: [
      "Start with index funds for diversification",
      "Learn about dollar-cost averaging",
      "Understand risk tolerance before investing",
      "Consider robo-advisors for beginners"
    ]
  },
  experienced_investor: {
    keywords: ["portfolio", "stocks", "bonds", "risk", "market", "trading", "returns", "diversification", "analysis"],
    questions: [
      "What's your current investment portfolio allocation?",
      "How do you typically assess risk in your investments?",
      "What investment strategies have worked best for you?",
      "Are you looking to optimize your current portfolio or explore new opportunities?",
      "What's your experience with alternative investments like REITs or commodities?"
    ],
    welcomeMessage: "I see you have investment experience! Let's dive into optimizing your strategy and exploring advanced opportunities.",
    recommendations: [
      "Consider AI-powered portfolio optimization",
      "Explore alternative investment opportunities",
      "Advanced risk management strategies",
      "Tax-efficient investment strategies"
    ]
  },
  saver: {
    keywords: ["save", "saving", "budget", "emergency", "goal", "money", "financial goals", "cash"],
    questions: [
      "What are your main savings goals?",
      "How much do you typically save each month?",
      "Do you have an emergency fund established?",
      "Are you saving for any specific purchases or milestones?",
      "Would you be interested in high-yield savings options?"
    ],
    welcomeMessage: "Saving is a great foundation! Let's help you optimize your savings strategy and explore growth opportunities.",
    recommendations: [
      "High-yield savings accounts",
      "Automated savings plans",
      "Goal-based savings strategies",
      "Consider conservative investment options"
    ]
  },
  developer: {
    keywords: ["AI model", "algorithm", "code", "develop", "build", "program", "machine learning", "backtesting"],
    questions: [
      "What type of AI financial models are you interested in developing?",
      "Do you have experience with machine learning frameworks?",
      "Are you looking to monetize your models on our platform?",
      "What programming languages do you prefer for financial modeling?",
      "Would you like to collaborate with other developers or work independently?"
    ],
    welcomeMessage: "Welcome to the developer community! Let's explore how you can build and monetize AI financial models.",
    recommendations: [
      "Access to our backtesting environment",
      "Model marketplace opportunities",
      "Developer collaboration tools",
      "Revenue sharing programs"
    ]
  },
  data_provider: {
    keywords: ["data", "dataset", "provide", "sell", "share", "information", "analytics", "feed"],
    questions: [
      "What type of financial data do you have access to?",
      "Are you looking to monetize your datasets?",
      "Do you need help with data quality and compliance?",
      "What industries or markets does your data cover?",
      "Are you interested in real-time or historical data provision?"
    ],
    welcomeMessage: "Data is the foundation of great AI models! Let's help you share and monetize your valuable datasets.",
    recommendations: [
      "Data marketplace opportunities",
      "Quality assessment tools",
      "Compliance guidance",
      "Revenue optimization strategies"
    ]
  }
};

export class AIChatbotService {
  /**
   * Analyze user input to detect their profile type with improved intent recognition
   */
  static detectUserProfile(message: string): { profile: string; confidence: number } {
    const lowerMessage = message.toLowerCase();
    const profileScores: Record<string, number> = {};

    // Enhanced keyword matching with context awareness
    Object.entries(USER_PROFILES).forEach(([profileType, config]) => {
      let score = 0;
      let keywordMatches = 0;
      
      config.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          keywordMatches++;
          // Give higher weight to longer, more specific keywords
          score += keyword.length > 5 ? 2 : 1;
        }
      });
      
      // Context bonus for sentence structure
      if (profileType === 'beginner_investor' && 
          (lowerMessage.includes('new to') || lowerMessage.includes('just started'))) {
        score += 3;
      }
      
      if (profileType === 'experienced_investor' && 
          (lowerMessage.includes('years of') || lowerMessage.includes('experienced'))) {
        score += 3;
      }
      
      profileScores[profileType] = keywordMatches > 0 ? score / config.keywords.length : 0;
    });

    // Find the profile with the highest score
    const bestProfile = Object.entries(profileScores).reduce((best, [profile, score]) => 
      score > best.score ? { profile, score } : best, 
      { profile: 'unknown', score: 0 }
    );

    return {
      profile: bestProfile.profile,
      confidence: Math.min(bestProfile.score * 100, 95)
    };
  }

  /**
   * Detect user intent from message with context awareness
   */
  static detectIntent(message: string, conversationHistory: any[] = []): {
    intent: string;
    confidence: number;
    context: any;
  } {
    const lowerMessage = message.toLowerCase();
    const intents = {
      question_about_features: ['feature', 'what does', 'how does', 'explain', 'details'],
      seeking_help: ['help', 'assist', 'guide', 'support', 'need'],
      expressing_dissatisfaction: ['not happy', 'frustrated', 'problem', 'issue', 'wrong'],
      requesting_recommendation: ['recommend', 'suggest', 'best', 'should i', 'advice'],
      clarification: ['what', 'how', 'why', 'when', 'where'],
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      goodbye: ['bye', 'goodbye', 'see you', 'thanks', 'thank you']
    };

    let bestIntent = 'unknown';
    let bestScore = 0;
    let context: any = {};

    // Analyze current message
    Object.entries(intents).forEach(([intent, keywords]) => {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      const score = matches / keywords.length;
      
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });

    // Check for repetitive patterns in conversation history
    const recentMessages = conversationHistory.slice(-6).filter(m => m.role === 'user');
    const repeatCount = recentMessages.filter(m => 
      this.detectIntent(m.content).intent === bestIntent
    ).length;

    context = {
      isRepetitive: repeatCount > 2,
      repeatCount,
      previousIntent: recentMessages.length > 0 ? 
        this.detectIntent(recentMessages[recentMessages.length - 1]?.content || '').intent : null
    };

    return {
      intent: bestIntent,
      confidence: bestScore * 100,
      context
    };
  }

  /**
   * Get the next appropriate question based on user profile and conversation history
   */
  static getNextQuestion(
    profileType: string, 
    completedQuestions: string[] = [],
    currentIndex: number = 0
  ): string | null {
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    if (!profile) return null;

    const availableQuestions = profile.questions.filter(
      question => !completedQuestions.includes(question)
    );

    return availableQuestions[currentIndex] || null;
  }

  /**
   * Generate intelligent, context-aware AI response
   */
  static generateResponse(
    userMessage: string,
    profileType: string,
    conversationContext: any = {}
  ): string {
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    const conversationHistory = conversationContext.conversationHistory || [];
    
    // Detect intent with context
    const intentAnalysis = this.detectIntent(userMessage, conversationHistory);
    
    if (!profile) {
      if (intentAnalysis.intent === 'expressing_dissatisfaction') {
        return "I'm sorry you're having issues! What specifically is bothering you about the platform? I'd like to help resolve it.";
      }
      return "I'd like to understand more about your financial goals. Could you tell me what you're hoping to achieve?";
    }

    // Handle repetitive interactions
    if (intentAnalysis.context.isRepetitive) {
      return this.generateAntiRepetitiveResponse(intentAnalysis.intent, profileType, conversationContext);
    }

    // First interaction welcome
    if (!conversationContext.hasWelcomed) {
      return profile.welcomeMessage;
    }

    // Intent-based responses
    switch (intentAnalysis.intent) {
      case 'expressing_dissatisfaction':
        return this.generateDissatisfactionResponse(userMessage, profileType);
      
      case 'question_about_features':
        return this.generateFeatureResponse(userMessage, profileType, conversationHistory);
      
      case 'seeking_help':
        return this.generateHelpResponse(profileType, conversationContext);
      
      case 'requesting_recommendation':
        return this.generateRecommendationResponse(profileType, userMessage);
      
      case 'clarification':
        return this.generateClarificationResponse(userMessage, profileType, conversationHistory);
      
      default:
        return this.generateContextualResponse(userMessage, profileType, conversationContext);
    }
  }

  /**
   * Generate anti-repetitive responses when user asks similar questions
   */
  static generateAntiRepetitiveResponse(
    intent: string, 
    profileType: string, 
    context: any
  ): string {
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    
    const alternatives = {
      question_about_features: [
        "I've shared the main features already. Would you like me to dive deeper into one specific area?",
        "Instead of listing features again, how about I show you a practical example of how they work?",
        "You seem interested in our features! Want me to recommend which ones would be best for your goals?"
      ],
      seeking_help: [
        "I notice you're asking for help again. Let me try a different approach - what specific task are you trying to accomplish?",
        "Rather than general help, could you tell me what you're stuck on? I can give you step-by-step guidance.",
        "Let's be more specific this time - what exactly would you like me to walk you through?"
      ]
    };

    const responses = alternatives[intent as keyof typeof alternatives] || [
      "I see we're covering similar ground. Let me try to help differently - could you be more specific about what you need?",
      "To avoid repeating myself, could you tell me what part of my previous answer wasn't helpful?",
      "Let's try a new angle - what would be most useful for you right now?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Generate empathetic responses to dissatisfaction
   */
  static generateDissatisfactionResponse(message: string, profileType: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('repeat') || lowerMessage.includes('same')) {
      return "I apologize for being repetitive! I'm learning to be more helpful. Could you tell me specifically what you'd like to know, and I'll give you a direct answer?";
    }
    
    if (lowerMessage.includes('slow') || lowerMessage.includes('loading')) {
      return "Sorry about the slow performance! That's frustrating. Are you experiencing delays with specific features, or is the whole platform running slowly?";
    }
    
    return "I'm sorry something isn't working well for you. Could you tell me what specific issue you're facing? I want to help make this better.";
  }

  /**
   * Generate specific feature responses based on context
   */
  static generateFeatureResponse(
    message: string, 
    profileType: string, 
    history: any[]
  ): string {
    const lowerMessage = message.toLowerCase();
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    
    // Check if they've asked about features before
    const previousFeatureQuestions = history.filter(m => 
      m.role === 'user' && m.content.toLowerCase().includes('feature')
    ).length;

    if (previousFeatureQuestions > 0) {
      return "Since you're interested in our features, let me focus on the ones most relevant to you. Based on your profile, I'd especially recommend our backtesting tool and risk assessment models. Which would you like to explore first?";
    }

    // First time asking about features
    if (lowerMessage.includes('detail') || lowerMessage.includes('explain')) {
      return profileType === 'beginner_investor' 
        ? "Our main features include portfolio tracking (monitors your investments), backtesting (tests strategies with historical data), and risk assessment (helps you understand potential losses). Which one interests you most?"
        : "Key features: Advanced backtesting with custom parameters, AI-powered risk models, real-time portfolio optimization, and automated trading bots. Want specifics on any of these?";
    }

    return `GeFi offers ${profile?.recommendations.slice(0, 2).join(' and ')}. What specific aspect would you like to learn about?`;
  }

  /**
   * Generate helpful responses with follow-up questions
   */
  static generateHelpResponse(profileType: string, context: any): string {
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    
    return `I'm here to help! As a ${profileType.replace('_', ' ')}, you might benefit from ${profile?.recommendations[0]}. What specific challenge are you facing that I can assist with?`;
  }

  /**
   * Generate personalized recommendations
   */
  static generateRecommendationResponse(profileType: string, message: string): string {
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('model') || lowerMessage.includes('ai')) {
      return profileType === 'beginner_investor'
        ? "For beginners, I'd recommend starting with our Conservative Growth AI model - it focuses on steady returns with lower risk. Would you like to see how it performs?"
        : "Based on your experience, you might like our Advanced Options Strategy AI or the Volatility Arbitrage model. Both offer sophisticated approaches. Which type of strategy interests you more?";
    }
    
    return `Given your ${profileType.replace('_', ' ')} profile, I'd suggest: ${profile?.recommendations.slice(0, 2).join(' or ')}. Which aligns better with your current goals?`;
  }

  /**
   * Generate clarification responses
   */
  static generateClarificationResponse(
    message: string, 
    profileType: string, 
    history: any[]
  ): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.startsWith('what') && lowerMessage.includes('gefi')) {
      return "GeFi is an AI-powered financial platform that helps with investment decisions, risk management, and portfolio optimization. What specific aspect would you like to understand better?";
    }
    
    if (lowerMessage.startsWith('how') && lowerMessage.includes('work')) {
      return "Great question! Our AI models analyze market data to provide investment insights. Would you like me to walk you through a specific example of how this works in practice?";
    }
    
    return "I want to give you the most helpful answer. Could you be a bit more specific about what you'd like to know?";
  }

  /**
   * Generate contextual responses based on conversation flow
   */
  static generateContextualResponse(
    message: string,
    profileType: string,
    context: any
  ): string {
    const lowerMessage = message.toLowerCase();
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    
    // Analyze user's response for insights
    if (lowerMessage.includes('risk')) {
      return profileType === 'beginner_investor' 
        ? "Risk is important to understand! Generally, higher potential returns come with higher risk. Are you comfortable with some ups and downs in your investments, or do you prefer steadier growth?"
        : "Risk management is crucial for long-term success. Are you looking to assess your current risk exposure or explore new risk management strategies?";
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
      return "Understanding your goals helps me give better advice. Are you investing for retirement, a major purchase, or something else? And what's your timeline?";
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('when')) {
      return "Timing is key in investing! Are you thinking about when to start investing, when you'll need the money, or timing your market entry?";
    }

    // Default engaging response
    return `That's helpful to know! As a ${profileType.replace('_', ' ')}, you might find ${profile?.recommendations[0]} particularly useful. What would you like to explore next?`;
  }

  /**
   * Get personalized recommendations based on user profile and responses
   */
  static getPersonalizedRecommendations(
    profileType: string,
    userResponses: string[] = [],
    userGoals: string[] = []
  ): string[] {
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    if (!profile) return [];

    let recommendations = [...profile.recommendations];

    // Customize recommendations based on user responses
    const responseText = userResponses.join(' ').toLowerCase();
    
    if (responseText.includes('retirement')) {
      recommendations.unshift("Long-term retirement planning strategies");
    }
    
    if (responseText.includes('short term') || responseText.includes('emergency')) {
      recommendations.unshift("High-liquidity savings options");
    }

    if (responseText.includes('passive') || responseText.includes('hands off')) {
      recommendations.unshift("Automated investment solutions");
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Analyze conversation completion and suggest next steps
   */
  static analyzeConversationCompletion(conversation: ChatbotConversation): {
    isComplete: boolean;
    completionPercentage: number;
    suggestedActions: string[];
  } {
    const profileType = conversation.userProfile;
    if (!profileType) {
      return {
        isComplete: false,
        completionPercentage: 0,
        suggestedActions: ["Continue profile assessment"]
      };
    }

    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    const completedQuestions = conversation.completedQuestions || [];
    const totalQuestions = profile?.questions.length || 0;
    
    const completionPercentage = totalQuestions > 0 
      ? Math.round((completedQuestions.length / totalQuestions) * 100)
      : 0;

    const isComplete = completionPercentage >= 80; // Consider 80% completion as sufficient

    const suggestedActions = [];
    
    if (isComplete) {
      suggestedActions.push(
        "Explore recommended AI models",
        "Set up your personalized dashboard",
        "Connect with relevant community members"
      );
    } else {
      suggestedActions.push(
        "Continue answering profile questions",
        "Provide more details about your goals"
      );
    }

    return {
      isComplete,
      completionPercentage,
      suggestedActions
    };
  }

  /**
   * Generate conversation summary for user review
   */
  static generateConversationSummary(conversation: ChatbotConversation): string {
    const profileType = conversation.userProfile || 'Unknown';
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    const goals = conversation.userGoals || [];
    const completedQuestions = conversation.completedQuestions || [];

    let summary = `Profile: ${profileType.replace('_', ' ').toUpperCase()}\n`;
    summary += `Confidence: ${conversation.profileConfidence || 0}%\n\n`;
    
    if (goals.length > 0) {
      summary += `Your Goals:\n${goals.map(goal => `• ${goal}`).join('\n')}\n\n`;
    }

    if (profile) {
      summary += `Recommended for you:\n${profile.recommendations.map(rec => `• ${rec}`).join('\n')}\n\n`;
    }

    summary += `Progress: ${completedQuestions.length} questions completed`;

    return summary;
  }
}