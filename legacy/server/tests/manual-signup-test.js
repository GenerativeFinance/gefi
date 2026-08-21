/**
 * Manual test to verify chatbot signup endpoint is working
 */
import fetch from 'node-fetch';

const TEST_USER = {
  email: `test.${Date.now()}@example.com`,
  firstName: "Test",
  lastName: "User",
  country: "United States",
  role: "Financial Professional", 
  company: "Test Company",
  experienceLevel: "Beginner",
  areasOfFocus: ["Investment Banking", "Portfolio Management"],
  platformIntent: "Buy Models",
  preferredModelTypes: ["Predictive Models"],
  subscriptionPreferences: ["Newsletter for Market Trends"],
  wantsDemo: true,
  sessionId: `test_session_${Date.now()}`,
  recaptchaToken: "",
  honeypot: ""
};

const testSignup = async () => {
  try {
    console.log('🧪 Testing chatbot signup endpoint...');
    console.log('📧 Test user email:', TEST_USER.email);
    
    const response = await fetch('http://localhost:5000/api/auth/complete-chatbot-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Chatbot signup completed!');
      console.log('👤 Created user:', {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        status: result.user.status
      });
      
      if (result.user.status === 'pending') {
        console.log('✅ User status is correctly set to "pending"');
      } else {
        console.log('❌ ERROR: User status should be "pending" but got:', result.user.status);
      }
      
    } else {
      console.log('❌ FAILED: Signup request failed');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
    
  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
};

// Run the test
testSignup();