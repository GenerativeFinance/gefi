import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bot, User, Mail, MapPin, Briefcase, ArrowRight, Check, X, Calendar, Clock, Video, ArrowLeft, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  message: string | React.ReactNode;
  timestamp: Date;
  isTyping?: boolean;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  role: string;
  company?: string;
  experience?: string;
  interests?: string[];
  // Enhanced profile fields
  experienceLevel?: string;
  areasOfFocus?: string[];
  linkedinProfile?: string;
  portfolioUrl?: string;
  preferredModelTypes?: string[];
  platformIntent?: string;
  subscriptionPreferences?: string[];
}

const ROLE_OPTIONS = [
  'Financial Professional',
  'Developer', 
  'Data Provider',
  'Regulator'
];

const FINANCIAL_PROFESSIONAL_ROLES = [
  'Investor',
  'Portfolio Manager',
  'Fund Manager', 
  'Wealth Manager / Financial Advisor',
  'Trader',
  'Analyst (Equity / Credit / Quant)',
  'Risk Manager',
  'Treasury Manager',
  'Institutional Allocator',
  'Venture Capitalist',
  'Private Equity Partner',
  'Angel Investor',
  'Family Office Representative',
  'Corporate Finance Executive'
];

const COUNTRY_OPTIONS = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
  'Japan', 'Australia', 'Singapore', 'Switzerland', 'Netherlands',
  'Sweden', 'Other'
];

const EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Expert'
];

const AREAS_OF_FOCUS = [
  'DeFi',
  'Crypto',
  'Stocks',
  'Bonds',
  'Risk Assessment',
  'Predictive Analytics',
  'Ethical AI Finance',
  'Portfolio Optimization',
  'Market Analysis',
  'Trading Algorithms'
];

const PREFERRED_MODEL_TYPES = [
  'Predictive Models',
  'Optimization Algorithms',
  'Risk Models',
  'Sentiment Analysis',
  'Trading Bots',
  'Portfolio Management',
  'Market Forecasting'
];

const PLATFORM_INTENTS = [
  'Buy Models',
  'Sell/Upload Models',
  'Both',
  'Browse/Learn'
];

const SUBSCRIPTION_PREFERENCES = [
  'Newsletter for Market Trends',
  'Beta Access to New Models',
  'Weekly AI Finance Updates',
  'Monthly Performance Reports'
];

export default function ChatbotSignup({ onComplete, onBack }: { onComplete: (userData: UserData) => void; onBack?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDemoBooking, setShowDemoBooking] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [emailVerificationStep, setEmailVerificationStep] = useState<'none' | 'sending' | 'sent' | 'verifying' | 'verified'>('none');
  const [verificationCode, setVerificationCode] = useState('');
  const [demoVerificationCode, setDemoVerificationCode] = useState(''); // For demo purposes
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<any[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [roleSearchOpen, setRoleSearchOpen] = useState(false);
  const [roleSearchValue, setRoleSearchValue] = useState('');

  const steps = [
    {
      question: "Hello! I'm GeFi AI, your personal assistant for setting up your account. What's your email address?",
      field: 'email',
      type: 'input',
      validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMessage: "Please enter a valid email address"
    },
    {
      question: "Great! What's your first name?",
      field: 'firstName',
      type: 'input',
      validation: (value: string) => {
        const trimmed = value.trim();
        if (trimmed.length < 2) return false;
        // Check if it's an email address
        if (trimmed.includes('@')) return false;
        // Basic validation for names (allow letters, spaces, hyphens, apostrophes)
        if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) return false;
        return true;
      },
      errorMessage: "Please enter a valid first name (no email addresses or special characters)"
    },
    {
      question: "And your last name?",
      field: 'lastName',
      type: 'input',
      validation: (value: string) => {
        const trimmed = value.trim();
        if (trimmed.length < 2) return false;
        // Check if it's an email address
        if (trimmed.includes('@')) return false;
        // Basic validation for names (allow letters, spaces, hyphens, apostrophes)
        if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) return false;
        return true;
      },
      errorMessage: "Please enter a valid last name (no email addresses or special characters)"
    },
    {
      question: "Which country are you based in?",
      field: 'country',
      type: 'select',
      options: COUNTRY_OPTIONS,
      validation: (value: string) => COUNTRY_OPTIONS.includes(value),
      errorMessage: "Please select a valid country"
    },
    {
      question: "What's your primary role in the financial ecosystem?",
      field: 'role',
      type: 'select',
      options: ROLE_OPTIONS,
      validation: (value: string) => {
        // Allow main roles or any of the financial professional sub-roles
        return ROLE_OPTIONS.includes(value) || FINANCIAL_PROFESSIONAL_ROLES.includes(value);
      },
      errorMessage: "Please select a valid role"
    },
    {
      question: "What's your experience level with AI and finance?",
      field: 'experienceLevel',
      type: 'select',
      options: EXPERIENCE_LEVELS,
      validation: (value: string) => EXPERIENCE_LEVELS.includes(value),
      errorMessage: "Please select your experience level"
    },
    {
      question: "What areas of finance interest you most? (Select multiple)",
      field: 'areasOfFocus',
      type: 'multiselect',
      options: AREAS_OF_FOCUS,
      validation: (value: string[]) => Array.isArray(value) && value.length > 0,
      errorMessage: "Please select at least one area of focus"
    },
    {
      question: "What's your primary intent on our platform?",
      field: 'platformIntent',
      type: 'select',
      options: PLATFORM_INTENTS,
      validation: (value: string) => PLATFORM_INTENTS.includes(value),
      errorMessage: "Please select your platform intent"
    },
    {
      question: "Perfect! Let me create your account now...",
      field: 'complete',
      type: 'complete'
    }
  ];

  useEffect(() => {
    // Start conversation
    addBotMessage("Welcome to GeFi! I'll help you create your account with just a few questions. 🤖");
    setTimeout(() => {
      addBotMessage(steps[0].question);
      setShowOptions(steps[0].type === 'select');
    }, 1000);
  }, []);

  const addBotMessage = (message: string | React.ReactNode, isTyping = false) => {
    const newMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      message,
      timestamp: new Date(),
      isTyping
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (value?: string) => {
    const inputValue = value || currentInput;
    if (!inputValue.trim()) return;

    const currentStepData = steps[currentStep];
    
    // Validate input
    if (currentStepData.validation && !currentStepData.validation(inputValue)) {
      addBotMessage(currentStepData.errorMessage || "Invalid input. Please try again.");
      return;
    }

    // Special handling for email field - check for duplicates
    if (currentStepData.field === 'email') {
      try {
        const response = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: inputValue }),
        });

        const data = await response.json();
        
        if (data.exists) {
          addBotMessage("Sorry, this email is already registered. Please use a different email address or sign in with your existing account.");
          return;
        }
      } catch (error) {
        console.error('Email check error:', error);
        addBotMessage("Unable to verify email availability. Please try again.");
        return;
      }
    }

    // Add user message
    addUserMessage(inputValue);
    setCurrentInput('');
    setShowOptions(false);

    // Update user data
    let newUserData;
    if (currentStepData.type === 'multiselect') {
      // Handle multi-select fields
      const currentValues = userData[currentStepData.field as keyof UserData] as string[] || [];
      if (currentValues.includes(inputValue)) {
        // Remove if already selected
        newUserData = { 
          ...userData, 
          [currentStepData.field]: currentValues.filter(v => v !== inputValue) 
        };
      } else {
        // Add if not selected
        newUserData = { 
          ...userData, 
          [currentStepData.field]: [...currentValues, inputValue] 
        };
      }
    } else {
      newUserData = { ...userData, [currentStepData.field]: inputValue };
    }
    setUserData(newUserData);

    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(async () => {
      setIsTyping(false);
      
      if (currentStep < steps.length - 1) {
        // Move to next step
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        if (nextStep < steps.length) {
          addBotMessage(steps[nextStep].question);
          setShowOptions(steps[nextStep].type === 'select');
        }
      } else {
        // Complete signup - but first verify email
        addBotMessage("Perfect! Before I create your account, I need to verify your email address for security.");
        setEmailVerificationStep('sending');
        
        try {
          const response = await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: newUserData.email,
              firstName: newUserData.firstName,
              lastName: newUserData.lastName
            }),
          });

          const data = await response.json();
          
          if (response.ok) {
            setEmailVerificationStep('sent');
            setDemoVerificationCode(data.verificationCode); // For demo purposes
            addBotMessage(`I've sent a 6-digit verification code to ${newUserData.email}. Please enter the code to continue.`);
            addBotMessage(`For demo purposes, your verification code is: ${data.verificationCode}`);
          } else {
            addBotMessage("Sorry, I couldn't send the verification email. Please try again.");
            setEmailVerificationStep('none');
          }
        } catch (error) {
          console.error('Verification send error:', error);
          addBotMessage("Sorry, there was an issue sending the verification email. Please try again.");
          setEmailVerificationStep('none');
        }
      }
    }, 1500);
  };

  const handleOptionSelect = (option: string) => {
    handleSubmit(option);
  };

  const handleDemoBooking = (wantsDemo: boolean) => {
    setShowDemoBooking(false);
    
    if (wantsDemo) {
      addBotMessage("Excellent! I'll set up your demo booking right now...");
      
      setTimeout(() => {
        addBotMessage(
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300">
              Click the link below to schedule your 30-minute demo session:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <a 
                href="https://calendly.com/generativefinance/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Personal Demo (30 min)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Opens in a new window • Free consultation
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We're excited to show you what GeFi can do for your financial goals!
            </p>
          </div>
        );
        
        setTimeout(() => {
          addBotMessage("You're all set! Feel free to explore your new GeFi account. Welcome aboard!");
          setTimeout(() => onComplete(userData as UserData), 3000);
        }, 2000);
      }, 1500);
    } else {
      addBotMessage("No problem! You can always book a demo later from your dashboard. Welcome to GeFi!");
      setTimeout(() => onComplete(userData as UserData), 2000);
    }
  };

  const handleVerificationCodeSubmit = async (code: string) => {
    if (!code || code.length !== 6) {
      addBotMessage("Please enter a valid 6-digit verification code.");
      return;
    }

    setEmailVerificationStep('verifying');
    addUserMessage(code);
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          code: code
        }),
      });

      if (response.ok) {
        setEmailVerificationStep('verified');
        addBotMessage("✅ Email verified successfully! Now creating your account...");
        
        // Create account
        setIsCreatingAccount(true);
        try {
          const signupResponse = await fetch('/api/chatbot/signup/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...userData,
              wantsDemo: false, // Will be handled separately
              sessionId: Date.now().toString() // Generate session ID
            }),
          });

          if (signupResponse.ok) {
            const result = await signupResponse.json();
            
            // Show comprehensive confirmation message with user details
            addBotMessage("🎉 Your account has been created successfully! Welcome to GeFi!");
            
            setTimeout(() => {
              let userSummary = `Your details: Email: ${userData.email}, Name: ${userData.firstName} ${userData.lastName}, Role: ${userData.role}, Country: ${userData.country}`;
              if (userData.experienceLevel) userSummary += `, Experience: ${userData.experienceLevel}`;
              if (userData.areasOfFocus?.length > 0) userSummary += `, Interests: ${userData.areasOfFocus.join(', ')}`;
              if (userData.platformIntent) userSummary += `, Intent: ${userData.platformIntent}`;
              
              addBotMessage(userSummary);
              
              setTimeout(() => {
                addBotMessage("Perfect! Now let's get you started with a personalized demo. Would you like to book a free demo session to explore GeFi's AI financial models?");
                
                // Show demo booking options
                setTimeout(() => {
                  addBotMessage("Click below to make your choice:");
                  setTimeout(() => {
                    setShowDemoBooking(true);
                  }, 500);
                }, 1000);
              }, 1500);
            }, 2000);
          } else {
            const errorData = await signupResponse.json();
            addBotMessage(`❌ Sorry, there was an error creating your account: ${errorData.message || errorData.error}`);
          }
        } catch (error) {
          console.error('Signup error:', error);
          addBotMessage("❌ Sorry, there was an error creating your account. Please try again.");
        }
        setIsCreatingAccount(false);
      } else {
        const errorData = await response.json();
        addBotMessage(`❌ ${errorData.message}`);
        setEmailVerificationStep('sent'); // Allow retry
      }
    } catch (error) {
      console.error('Verification error:', error);
      addBotMessage("❌ Sorry, there was an error verifying your email. Please try again.");
      setEmailVerificationStep('sent'); // Allow retry
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Back Navigation Button */}
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="fixed top-4 left-4 z-10 flex items-center gap-2"
          title="Back to authentication options"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      )}

      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GeFi Account Setup
          </CardTitle>
          <CardDescription className="text-lg">
            Let our AI assistant help you create your personalized account
          </CardDescription>
          <div className="flex justify-center space-x-2">
            {steps.slice(0, -1).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'bot' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-gray-600'
                    }`}>
                      {message.sender === 'bot' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.sender === 'bot'
                        ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      {message.isTyping && (
                        <div className="flex space-x-1 mt-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="px-4 py-2 bg-white dark:bg-gray-600 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          {currentStep < steps.length - 1 && emailVerificationStep === 'none' && (
            <div className="space-y-4">
              {showOptions ? (
                <div className="space-y-4">
                  {/* Role Selection with Special Handling for Investor */}
                  {steps[currentStep].field === 'role' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {ROLE_OPTIONS.map((role) => (
                        role === 'Financial Professional' ? (
                          <Popover key={role} open={roleSearchOpen} onOpenChange={setRoleSearchOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-auto p-4 flex-col items-start text-left hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors"
                              >
                                <div className="font-semibold">{role}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Investment & finance</div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="start">
                              <Command>
                                <CommandInput 
                                  placeholder="Search finance roles..." 
                                  value={roleSearchValue}
                                  onValueChange={setRoleSearchValue}
                                />
                                <CommandList>
                                  <CommandEmpty>No roles found.</CommandEmpty>
                                  <CommandGroup>
                                    {FINANCIAL_PROFESSIONAL_ROLES.map((financialRole) => (
                                      <CommandItem
                                        key={financialRole}
                                        value={financialRole}
                                        onSelect={() => {
                                          handleOptionSelect(financialRole);
                                          setRoleSearchOpen(false);
                                          setRoleSearchValue('');
                                        }}
                                      >
                                        {financialRole}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Button
                            key={role}
                            onClick={() => handleOptionSelect(role)}
                            variant="outline"
                            className="h-auto p-4 flex-col items-start text-left hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors"
                          >
                            <div className="font-semibold">{role}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {role === 'Developer' && 'Build AI models'}
                              {role === 'Data Provider' && 'Supply data sets'}
                              {role === 'Regulator' && 'Compliance oversight'}
                            </div>
                          </Button>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {steps[currentStep].options?.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => handleOptionSelect(option)}
                          className="text-left justify-start hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    type={steps[currentStep].field === 'email' ? 'email' : 'text'}
                    placeholder={`Enter your ${steps[currentStep].field}...`}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1"
                    autoFocus
                  />
                  <Button 
                    onClick={() => handleSubmit()} 
                    disabled={!currentInput.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Email Verification Input */}
          {emailVerificationStep === 'sent' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Enter the 6-digit verification code sent to your email
                </p>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && verificationCode.length === 6 && handleVerificationCodeSubmit(verificationCode)}
                  className="flex-1 text-center text-lg font-mono tracking-widest"
                  autoFocus
                  maxLength={6}
                />
                <Button 
                  onClick={() => handleVerificationCodeSubmit(verificationCode)} 
                  disabled={verificationCode.length !== 6 || emailVerificationStep === 'verifying'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {emailVerificationStep === 'verifying' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/auth/send-verification', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          email: userData.email,
                          firstName: userData.firstName,
                          lastName: userData.lastName
                        }),
                      });
                      const data = await response.json();
                      if (response.ok) {
                        setDemoVerificationCode(data.verificationCode);
                        addBotMessage(`New verification code sent! For demo: ${data.verificationCode}`);
                      }
                    } catch (error) {
                      addBotMessage("Sorry, couldn't resend the code. Please try again.");
                    }
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  Resend Code
                </Button>
              </div>
            </div>
          )}

          {/* Progress Summary */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200 mb-2">Your Information:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {userData.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">{userData.email}</span>
                  </div>
                )}
                {userData.firstName && (
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">{userData.firstName} {userData.lastName}</span>
                  </div>
                )}
                {userData.country && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">{userData.country}</span>
                  </div>
                )}
                {userData.role && (
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-3 h-3 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">{userData.role}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Demo Booking Options */}
          {showDemoBooking && !showTimeSlots && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Book Your Personal Demo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose the session that works best for you
                </p>
              </div>

              <div className="grid gap-3">
                {/* Platform Demo Option */}
                <Button
                  onClick={() => handleDemoBooking('platform-demo')}
                  disabled={isLoadingTimes}
                  className="h-auto p-4 flex-col items-start text-left bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <div className="flex items-center w-full justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        {isLoadingTimes && selectedEventType === 'platform-demo' ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Video className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">Platform Demo</div>
                        <div className="text-sm opacity-90">30 minutes</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <p className="text-sm opacity-90 mt-2">
                    Quick overview of GeFi's key features and capabilities
                  </p>
                </Button>

                {/* Onboarding Call Option */}
                <Button
                  onClick={() => handleDemoBooking('onboarding')}
                  disabled={isLoadingTimes}
                  variant="outline"
                  className="h-auto p-4 flex-col items-start text-left border-2 border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20"
                >
                  <div className="flex items-center w-full justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {isLoadingTimes && selectedEventType === 'onboarding' ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Calendar className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white">Personal Onboarding</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">45 minutes</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Personalized session to set up your account and create your first strategy
                  </p>
                </Button>

                {/* Skip Option */}
                <Button
                  onClick={handleSkipDemo}
                  disabled={isLoadingTimes}
                  variant="ghost"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Skip for now - I'll explore on my own
                </Button>
              </div>
            </motion.div>
          )}

          {/* Time Slot Selection */}
          {showTimeSlots && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Select Your Preferred Time
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedEventType === 'platform-demo' ? 'Platform Demo (30 min)' : 'Personal Onboarding (45 min)'}
                </p>
              </div>

              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {availableTimes.map((timeSlot, index) => (
                  <Button
                    key={index}
                    onClick={() => handleTimeSlotSelection(timeSlot)}
                    disabled={isBooking}
                    variant="outline"
                    className="p-3 justify-between text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {timeSlot.displayTime}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {timeSlot.timezone}
                        </div>
                      </div>
                    </div>
                    {isBooking && selectedTime?.datetime === timeSlot.datetime ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  onClick={() => {
                    setShowTimeSlots(false);
                    setAvailableTimes([]);
                    setSelectedEventType('');
                  }}
                  variant="ghost"
                  className="text-gray-600 dark:text-gray-300"
                  disabled={isBooking}
                >
                  ← Back to Options
                </Button>
                
                <Button
                  onClick={handleSkipDemo}
                  variant="ghost"
                  className="text-gray-600 dark:text-gray-300"
                  disabled={isBooking}
                >
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}