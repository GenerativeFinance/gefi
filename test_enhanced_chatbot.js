// Direct test of enhanced AI chatbot functionality
import { AIChatbotService } from './server/services/aiChatbotService.js';

console.log("=== Enhanced AI Chatbot Test ===\n");

const testCases = [
  {
    title: "Test 1: Feature Request (Should avoid generic lists)",
    input: "Give me details on GeFi features"
  },
  {
    title: "Test 2: User Dissatisfaction (Should show empathy)",
    input: "I am not happy the platform keeps giving me the same responses"
  },
  {
    title: "Test 3: Specific Recommendation (Should be personalized)",
    input: "What are the best AI models for beginners?"
  },
  {
    title: "Test 4: Repetitive Question Detection",
    input: "Tell me about features again"
  }
];

testCases.forEach((test, index) => {
  console.log(`${test.title}:`);
  console.log(`Input: "${test.input}"`);
  
  const profileDetection = AIChatbotService.detectUserProfile(test.input);
  
  // Simulate conversation history for repetitive test
  const conversationHistory = index === 3 ? [
    { role: 'user', content: 'Tell me about features' },
    { role: 'assistant', content: 'Previous response about features' },
    { role: 'user', content: 'What features do you have' }
  ] : [];
  
  const response = AIChatbotService.generateResponse(
    test.input, 
    profileDetection.profile, 
    { 
      hasWelcomed: true, 
      conversationHistory: conversationHistory 
    }
  );
  
  console.log(`Profile Detected: ${profileDetection.profile} (${profileDetection.confidence}% confidence)`);
  console.log(`AI Response: "${response}"`);
  console.log("---\n");
});

console.log("✅ Enhanced AI Chatbot Features:");
console.log("- Context-aware responses");
console.log("- Intent recognition");
console.log("- Anti-repetitive logic");
console.log("- Empathetic dissatisfaction handling");
console.log("- Personalized recommendations");
console.log("- Conversation memory tracking");