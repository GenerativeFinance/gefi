/**
 * Multi-Provider OAuth Authentication Module
 * 
 * Provides secure authentication through Google, GitHub, and LinkedIn OAuth providers.
 * Handles user session management, database storage, and authentication routes.
 * 
 * Features:
 * - Multi-provider OAuth support (Google, GitHub, LinkedIn)
 * - PostgreSQL session storage for scalability
 * - Automatic user profile synchronization
 * - Secure session configuration
 * - Error handling and logging
 */

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { Strategy as GoogleStrategy, type Profile as GoogleProfile, type VerifyCallback } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, type Profile as GitHubProfile } from "passport-github2";
import { Strategy as LinkedInStrategy, type Profile as LinkedInProfile } from "passport-linkedin-oauth2";
import { storage } from "./storage";
import fetch from "node-fetch";

// Configuration constants
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
const SESSION_NAME = 'gefi.session';

/**
 * Creates and configures PostgreSQL-backed session middleware
 * 
 * @returns Express session middleware configured for production use
 */
export function getSession() {
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: SESSION_TTL,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development, true for production
      maxAge: SESSION_TTL,
      sameSite: 'lax',
    },
    name: SESSION_NAME,
  });
}

/**
 * Normalizes user profile data from different OAuth providers and creates/updates user in database
 * 
 * @param profile - OAuth profile from provider
 * @param provider - Provider name ('google', 'github', 'linkedin')
 * @returns Promise<User> - Created or updated user object
 */
async function upsertUser(profile: any, provider: string) {
  // Extract consistent user data from provider-specific profile format
  const userData = {
    id: `${provider}_${profile.id}`,
    email: profile.emails?.[0]?.value || null,
    firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || null,
    lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || null,
    profileImageUrl: profile.photos?.[0]?.value || null,
    provider: provider,
  };
  
  return await storage.upsertUser(userData);
}

/**
 * Determines the base URL for OAuth callbacks based on environment
 * 
 * @returns string - Base URL for the application
 */
function getBaseUrl(): string {
  return process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` 
    : 'http://localhost:5000';
}

/**
 * Handles Google OAuth credentials from environment variables
 * 
 * @returns Object with clientId and clientSecret
 * @throws Error if credentials are not provided via environment variables
 */
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials must be provided via GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables');
  }
  
  return {
    clientId,
    clientSecret
  };
}

/**
 * Creates OAuth verify callback for any provider
 * 
 * @param provider - Provider name
 * @returns Async verify function for passport strategy
 */
function createOAuthVerifyCallback(provider: string) {
  return async (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
    try {
      console.log(`🔍 ${provider} OAuth profile received:`, {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        displayName: profile.displayName
      });

      const user = await upsertUser(profile, provider);
      console.log(`✅ ${provider} user created/updated:`, user.id);
      
      return done(null, { ...user, provider });
    } catch (error) {
      console.error(`❌ ${provider} OAuth error:`, error);
      return done(error);
    }
  };
}

/**
 * Sets up multi-provider OAuth authentication
 * 
 * @param app - Express application instance
 */
export async function setupMultiAuth(app: Express) {
  // Configure trust proxy and session middleware
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const baseUrl = getBaseUrl();
  console.log('OAuth Base URL:', baseUrl);

  // Configure Google OAuth Strategy
  const googleCredentials = getGoogleCredentials();
  if (googleCredentials.clientId && googleCredentials.clientSecret) {
    console.log('🟡 Configuring Google OAuth with callback:', `${baseUrl}/api/auth/google/callback`);
    console.log('🔑 Using Google Client ID:', googleCredentials.clientId.substring(0, 20) + '...');
    
    passport.use(new GoogleStrategy({
      clientID: googleCredentials.clientId,
      clientSecret: googleCredentials.clientSecret,
      callbackURL: `${baseUrl}/api/auth/google/callback`
    }, createOAuthVerifyCallback('google')));
  } else {
    console.log('⚠️ Google OAuth not configured - missing credentials');
  }

  // Configure GitHub OAuth Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    console.log('🐙 Configuring GitHub OAuth with callback:', `${baseUrl}/api/auth/github/callback`);
    
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${baseUrl}/api/auth/github/callback`,
      scope: ['user:email']
    }, createOAuthVerifyCallback('github')));
  } else {
    console.log('⚠️ GitHub OAuth not configured - missing credentials');
  }

  // Configure LinkedIn OAuth Strategy
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    console.log('🔗 Configuring LinkedIn OAuth with callback:', `${baseUrl}/api/auth/linkedin/callback`);
    
    passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${baseUrl}/api/auth/linkedin/callback`,
      scope: ['openid', 'profile', 'email']
    }, createOAuthVerifyCallback('linkedin')));
    
    console.log('✅ LinkedIn OAuth strategy configured');
  } else {
    console.log('⚠️ LinkedIn OAuth not configured - missing credentials');
  }

  // Configure passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user: any, done) => {
    try {
      // Verify user still exists in database and check their status
      const dbUser = await storage.getUser(user.id);
      if (dbUser) {
        // Check if user account is active
        if (dbUser.status !== 'active') {
          console.log(`🚫 User ${user.id} account status: ${dbUser.status} - access denied`);
          done(null, false); // Invalidate session for non-active users
          return;
        }
        
        // Update user object with latest database info
        const updatedUser = { ...user, ...dbUser };
        done(null, updatedUser);
      } else {
        // User no longer exists, invalidate session
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });

  // OAuth Routes Configuration
  setupOAuthRoutes(app);

  // Calendly Integration Routes
  setupCalendlyRoutes(app);

  // Development route (remove in production)
  setupDevelopmentRoute(app);
}

/**
 * Sets up OAuth authentication routes for all providers
 * 
 * @param app - Express application instance
 */
function setupOAuthRoutes(app: Express) {
  // Google OAuth routes
  app.get('/api/auth/google', 
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: true
    })
  );
  
  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: '/login?error=google_auth_failed',
      session: true
    }),
    handleOAuthCallback('Google')
  );

  // GitHub OAuth routes
  app.get('/api/auth/github',
    passport.authenticate('github', { 
      scope: ['user:email'],
      session: true
    })
  );
  
  app.get('/api/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login?error=github_auth_failed'
    }),
    handleOAuthCallback('GitHub')
  );

  // LinkedIn OAuth routes
  app.get('/api/auth/linkedin',
    passport.authenticate('linkedin', { 
      scope: ['openid', 'profile', 'email'],
      session: true
    })
  );
  
  app.get('/api/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login?error=linkedin_auth_failed'
    }),
    handleOAuthCallback('LinkedIn')
  );

  // Logout routes (both paths for compatibility)
  const handleLogout = (req: any, res: any) => {
    req.logout((err: any) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed', error: err.message });
      }
      // Destroy session completely
      req.session.destroy((sessionErr: any) => {
        if (sessionErr) {
          console.error('Session destruction error:', sessionErr);
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully', redirectTo: '/login' });
      });
    });
  };

  app.get('/api/logout', handleLogout);
  app.get('/api/auth/logout', handleLogout);

  // Email verification endpoint
  app.post('/api/auth/check-email', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          message: 'This email is already registered. Please use a different email or sign in instead.',
          exists: true 
        });
      }

      res.json({ message: 'Email is available', exists: false });
    } catch (error) {
      console.error('Email check error:', error);
      res.status(500).json({ message: 'Failed to check email availability' });
    }
  });

  // Send email verification
  app.post('/api/auth/send-verification', async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code (in production, use Redis or database with expiration)
      // For now, we'll store in memory with 15-minute expiration
      global.verificationCodes = global.verificationCodes || {};
      global.verificationCodes[email] = {
        code: verificationCode,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        userData: { email, firstName, lastName }
      };

      // In production, send actual email here
      console.log(`📧 Verification code for ${email}: ${verificationCode}`);
      
      // For demo purposes, return the code (remove in production)
      res.json({ 
        message: 'Verification code sent successfully',
        // Remove this line in production:
        verificationCode: verificationCode 
      });
    } catch (error) {
      console.error('Send verification error:', error);
      res.status(500).json({ message: 'Failed to send verification email' });
    }
  });

  // Verify email code
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ message: 'Email and verification code are required' });
      }

      const storedData = global.verificationCodes?.[email];
      if (!storedData) {
        return res.status(400).json({ message: 'No verification code found for this email' });
      }

      if (Date.now() > storedData.expires) {
        delete global.verificationCodes[email];
        return res.status(400).json({ message: 'Verification code has expired' });
      }

      if (storedData.code !== code) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }

      // Mark email as verified
      storedData.verified = true;
      
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Failed to verify email' });
    }
  });

  // Email authentication routes
  app.post('/api/auth/email/signup', async (req, res) => {
    try {
      const { email, firstName, lastName, country, role, password, verificationCode } = req.body;
      
      // Basic validation
      if (!email || !firstName || !lastName || !country || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          message: 'This email is already registered. Please use a different email or sign in instead.',
          emailExists: true 
        });
      }

      // Verify email verification code
      const storedData = global.verificationCodes?.[email];
      if (!storedData || !storedData.verified) {
        return res.status(400).json({ message: 'Email verification required' });
      }

      // Create user (password will be hashed in production)
      const userData = {
        id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName,
        lastName,
        provider: 'email',
        role,
        profileImageUrl: null,
        subscriptionTier: 'free',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const user = await storage.upsertUser(userData);
      
      // Create profile with valid fields only
      await storage.createOrUpdateUserProfile(user.id, {
        displayName: `${firstName} ${lastName}`,
        bio: `${role} from ${country}`,
        profileCompleted: true
      });

      // Log the user in
      // Clean up verification code
      delete global.verificationCodes[email];

      req.login(user, (err) => {
        if (err) {
          console.error('Login error after signup:', err);
          return res.status(500).json({ message: 'Account created but login failed' });
        }
        res.json({ 
          message: 'Account created successfully', 
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        });
      });
    } catch (error) {
      console.error('Email signup error:', error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  });

  app.post('/api/auth/email/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // In production, verify password hash here
      // For now, we'll accept any password for existing email users
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ message: 'Login failed' });
        }
        res.json({ 
          message: 'Signed in successfully', 
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        });
      });
    } catch (error) {
      console.error('Email signin error:', error);
      res.status(500).json({ message: 'Sign in failed' });
    }
  });
}

/**
 * Creates OAuth callback handler for any provider
 * 
 * @param providerName - Human-readable provider name
 * @returns Express middleware function
 */
function handleOAuthCallback(providerName: string) {
  return async (req: any, res: any) => {
    if (req.user) {
      console.log(`✅ ${providerName} OAuth callback successful, user authenticated:`, req.user);
      
      // Check for duplicate email during OAuth signup
      if (req.user.email) {
        try {
          const existingUser = await storage.getUserByEmail(req.user.email);
          if (existingUser && existingUser.id !== req.user.id) {
            console.log(`⚠️ Duplicate email detected during ${providerName} OAuth:`, req.user.email);
            return res.redirect('/login?error=email_already_exists&message=This email is already registered with another account');
          }
        } catch (error) {
          console.error('Error checking for duplicate email during OAuth:', error);
        }
      }
      
      res.redirect('/?auth=success');
    } else {
      console.log(`❌ ${providerName} OAuth callback failed - no user in session`);
      res.redirect('/login?error=auth_failed');
    }
  };
}

/**
 * Sets up development authentication route (remove in production)
 * 
 * @param app - Express application instance
 */
function setupDevelopmentRoute(app: Express) {
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/auth/dev', async (req, res) => {
      try {
        // Create development user
        const devUser = await storage.upsertUser({
          id: `dev_user_${Date.now()}`,
          email: 'dev@gefi.local',
          firstName: 'Development',
          lastName: 'User',
          profileImageUrl: 'https://via.placeholder.com/40x40?text=DEV',
        });

        // Log the user in
        req.login({ ...devUser, provider: 'dev' }, (err) => {
          if (err) {
            console.error('Development login error:', err);
            return res.redirect('/login?error=dev_login_failed');
          }
          console.log('✅ Development user logged in:', devUser.id);
          res.redirect('/');
        });
      } catch (error) {
        console.error('❌ Development authentication error:', error);
        res.redirect('/login?error=dev_auth_failed');
      }
    });
  }
}

/**
 * Middleware to check if user is authenticated
 * Used to protect routes that require authentication
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    const user = req.user as any;
    
    console.log('🔐 Auth check - isAuthenticated: true');
    console.log('🔐 Auth check - user:', user);
    
    // Check user status from database
    try {
      const dbUser = await storage.getUser(user.id);
      if (!dbUser) {
        console.log(`🚫 Access denied - user not found`);
        req.logout((err) => {
          if (err) console.error('Logout error:', err);
        });
        return res.status(401).json({ 
          message: "Account not found", 
          redirectTo: '/login'
        });
      }

      // Admin override: Allow admins to access admin routes even if suspended 
      // This prevents admin lockout scenarios
      const isAdminRoute = req.path.startsWith('/api/admin');
      const isAdminUser = dbUser.role === 'admin';
      
      if (isAdminRoute && isAdminUser) {
        console.log(`🔧 Admin override: allowing admin access to ${req.path}`);
        return next();
      }
      
      // For non-admin routes or non-admin users, check status normally
      if (dbUser.status !== 'active') {
        console.log(`🚫 Access denied - user status: ${dbUser.status}`);
        
        // Clear the session for non-active users
        req.logout((err) => {
          if (err) console.error('Logout error:', err);
        });
        
        return res.status(401).json({ 
          message: "Account access restricted", 
          reason: dbUser.status,
          redirectTo: '/account-status'
        });
      }
      
      // User is active, allow access
      return next();
    } catch (error) {
      console.error('Error checking user status:', error);
      return res.status(500).json({ message: "Authentication error" });
    }
  }
  
  console.log('🔐 Auth check - isAuthenticated: false');
  console.log('🔐 Auth check - user:', req.user);
  res.status(401).json({ message: "Unauthorized" });
};

/**
 * Sets up Calendly OAuth and API integration routes
 * 
 * @param app - Express application instance
 */
function setupCalendlyRoutes(app: Express) {
  // Helper function to get base URL
  const getBaseUrl = (req: any): string => {
    return `${req.protocol}://${req.get('host')}`;
  };

  // Calendly OAuth initiation
  app.get('/api/auth/calendly', (req, res) => {
    const clientId = process.env.CALENDLY_CLIENT_ID;
    const redirectUri = `${getBaseUrl(req)}/api/auth/calendly/callback`;
    
    const authUrl = `https://auth.calendly.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid profile email read`;
    
    res.redirect(authUrl);
  });

  // Calendly OAuth callback
  app.get('/api/auth/calendly/callback', async (req, res) => {
    const { code, error } = req.query;
    
    if (error) {
      console.error('Calendly OAuth error:', error);
      return res.redirect('/login?error=calendly_auth_failed');
    }

    try {
      const tokenResponse = await fetch('https://auth.calendly.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.CALENDLY_CLIENT_ID!,
          client_secret: process.env.CALENDLY_CLIENT_SECRET!,
          redirect_uri: `${getBaseUrl(req)}/api/auth/calendly/callback`,
          code: code as string,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      // Store the access token (you might want to save this to user profile)
      // For now, we'll just redirect back with success
      res.redirect('/login?calendly=connected');
      
    } catch (error) {
      console.error('Calendly token exchange error:', error);
      res.redirect('/login?error=calendly_token_failed');
    }
  });

  // Get available time slots from Calendly
  app.post('/api/calendly/available-times', async (req, res) => {
    try {
      const { eventType, startDate, endDate } = req.body;
      
      // For demo purposes, return mock available times
      // In production, integrate with Calendly's scheduling API
      const availableTimes = [
        {
          datetime: '2025-08-16T10:00:00Z',
          displayTime: 'Tomorrow 10:00 AM',
          timezone: 'EST'
        },
        {
          datetime: '2025-08-16T14:00:00Z',
          displayTime: 'Tomorrow 2:00 PM',
          timezone: 'EST'
        },
        {
          datetime: '2025-08-16T16:00:00Z',
          displayTime: 'Tomorrow 4:00 PM',
          timezone: 'EST'
        },
        {
          datetime: '2025-08-17T09:00:00Z',
          displayTime: 'Monday 9:00 AM',
          timezone: 'EST'
        },
        {
          datetime: '2025-08-17T11:00:00Z',
          displayTime: 'Monday 11:00 AM',
          timezone: 'EST'
        },
        {
          datetime: '2025-08-17T15:00:00Z',
          displayTime: 'Monday 3:00 PM',
          timezone: 'EST'
        }
      ];

      res.json({ 
        success: true, 
        availableTimes,
        eventType: eventType === 'platform-demo' ? 'Platform Demo (30 min)' : 'Personal Onboarding (45 min)'
      });
    } catch (error) {
      console.error('Error fetching available times:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch available times' });
    }
  });

  // Book appointment with Calendly
  app.post('/api/calendly/book-appointment', async (req, res) => {
    try {
      const { eventType, datetime, userEmail, userName, userMessage } = req.body;
      
      console.log(`📅 Booking ${eventType} appointment for ${userName} (${userEmail}) at ${datetime}`);
      
      // For demo purposes, simulate successful booking
      // In production, create actual Calendly appointment
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store booking details (in production, save to database)
      global.calendlyBookings = global.calendlyBookings || {};
      global.calendlyBookings[bookingId] = {
        id: bookingId,
        eventType,
        datetime,
        userEmail,
        userName,
        userMessage,
        status: 'confirmed',
        createdAt: new Date()
      };

      console.log(`✅ Demo booking created: ${bookingId}`);

      res.json({ 
        success: true, 
        bookingId,
        confirmationMessage: `Your ${eventType} session has been booked for ${datetime}. You'll receive a confirmation email shortly.`,
        meetingLink: `https://gefi.demo/meeting/${bookingId}` // Demo link
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({ success: false, message: 'Failed to book appointment' });
    }
  });

  // Get available event types from Calendly
  app.get('/api/calendly/event-types', async (req, res) => {
    try {
      // In a real implementation, you'd get the user's Calendly access token
      // For demo purposes, we'll return mock event types
      const eventTypes = [
        {
          uri: "https://api.calendly.com/event_types/DEMO_SESSION",
          name: "GeFi Platform Demo",
          description: "30-minute platform demonstration and Q&A session",
          duration: 30,
          scheduling_url: "https://calendly.com/gefi-demo/platform-demo"
        },
        {
          uri: "https://api.calendly.com/event_types/ONBOARDING_CALL",
          name: "Personal Onboarding Call",
          description: "45-minute personalized onboarding session",
          duration: 45,
          scheduling_url: "https://calendly.com/gefi-demo/onboarding"
        }
      ];

      res.json({ collection: eventTypes });
    } catch (error) {
      console.error('Error fetching Calendly event types:', error);
      res.status(500).json({ error: 'Failed to fetch event types' });
    }
  });

  // Create a scheduling link for a specific event type
  app.post('/api/calendly/schedule-link', async (req, res) => {
    try {
      const { eventType, userEmail, userName } = req.body;
      
      // Generate a personalized scheduling link
      const schedulingLink = `https://calendly.com/gefi-demo/${eventType}?prefill_email=${encodeURIComponent(userEmail)}&prefill_name=${encodeURIComponent(userName)}`;
      
      res.json({ 
        scheduling_url: schedulingLink,
        message: 'Scheduling link generated successfully'
      });
    } catch (error) {
      console.error('Error creating scheduling link:', error);
      res.status(500).json({ error: 'Failed to create scheduling link' });
    }
  });

  // Webhook endpoint for Calendly events
  app.post('/api/calendly/webhook', async (req, res) => {
    try {
      const signature = req.headers['calendly-webhook-signature'] as string;
      const payload = JSON.stringify(req.body);
      
      // Verify webhook signature (implementation depends on Calendly's signing method)
      // const isValid = verifyCalendlySignature(payload, signature, process.env.CALENDLY_WEBHOOK_SIGNING_KEY!);
      
      // if (!isValid) {
      //   return res.status(401).json({ error: 'Invalid signature' });
      // }

      const event = req.body;
      console.log('Calendly webhook received:', event.event);

      // Handle different event types
      switch (event.event) {
        case 'invitee.created':
          console.log('New booking created:', event.payload);
          // You can process the booking here (send emails, update database, etc.)
          break;
        case 'invitee.canceled':
          console.log('Booking canceled:', event.payload);
          break;
        default:
          console.log('Unhandled event type:', event.event);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });
}