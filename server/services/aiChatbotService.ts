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
   * Analyze user input to detect their profile type
   */
  static detectUserProfile(message: string): { profile: string; confidence: number } {
    const lowerMessage = message.toLowerCase();
    const profileScores: Record<string, number> = {};

    // Calculate scores for each profile based on keyword matches
    Object.entries(USER_PROFILES).forEach(([profileType, config]) => {
      const matchCount = config.keywords.filter(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      ).length;
      
      profileScores[profileType] = matchCount / config.keywords.length;
    });

    // Find the profile with the highest score
    const bestProfile = Object.entries(profileScores).reduce((best, [profile, score]) => 
      score > best.score ? { profile, score } : best, 
      { profile: 'unknown', score: 0 }
    );

    return {
      profile: bestProfile.profile,
      confidence: Math.min(bestProfile.score * 100, 95) // Cap at 95% confidence
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
   * Generate AI response based on user input and profile
   */
  static generateResponse(
    userMessage: string,
    profileType: string,
    conversationContext: any = {}
  ): string {
    const profile = USER_PROFILES[profileType as keyof typeof USER_PROFILES];
    
    if (!profile) {
      return "I'd like to understand more about your financial goals. Could you tell me what you're hoping to achieve?";
    }

    // If this is the first interaction, return welcome message
    if (!conversationContext.hasWelcomed) {
      return profile.welcomeMessage;
    }

    // Analyze the user's response for key insights
    const lowerMessage = userMessage.toLowerCase();
    
    // Generate contextual responses based on common patterns
    if (lowerMessage.includes('help') || lowerMessage.includes('guide')) {
      return `I'm here to help! Based on your ${profileType.replace('_', ' ')} profile, I'd recommend: ${profile.recommendations.slice(0, 2).join(', ')}. What specific area would you like to explore first?`;
    }

    if (lowerMessage.includes('risk')) {
      return profileType === 'beginner_investor' 
        ? "Understanding risk is crucial! Generally, higher returns come with higher risk. Would you prefer to start with low-risk investments and gradually learn about others?"
        : "Risk management is key to successful investing. Are you looking to optimize your current risk profile or explore new risk assessment strategies?";
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
      return "That's a great goal! Understanding your objectives helps me provide better recommendations. How important is it to achieve this goal, and what timeline are you working with?";
    }

    // Default contextual response
    return "That's interesting! Let me ask you another question to better understand your needs.";
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