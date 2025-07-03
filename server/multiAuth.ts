import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
    name: 'gefi.session',
  });
}

async function upsertUser(profile: any, provider: string) {
  const userData = {
    id: `${provider}_${profile.id}`,
    email: profile.emails?.[0]?.value || null,
    firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || null,
    lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || null,
    profileImageUrl: profile.photos?.[0]?.value || null,
  };
  
  return await storage.upsertUser(userData);
}

export async function setupMultiAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Get the base URL from REPLIT_DOMAINS
  const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'http://localhost:5000';

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${baseUrl}/api/auth/google/callback`
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await upsertUser(profile, 'google');
        return done(null, { ...user, provider: 'google' });
      } catch (error) {
        return done(error, null);
      }
    }));
  }

  // GitHub OAuth Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${baseUrl}/api/auth/github/callback`
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await upsertUser(profile, 'github');
        return done(null, { ...user, provider: 'github' });
      } catch (error) {
        return done(error, null);
      }
    }));
  }



  // LinkedIn OAuth Strategy
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${baseUrl}/api/auth/linkedin/callback`,
      scope: ['r_emailaddress', 'r_liteprofile', 'openid', 'profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await upsertUser(profile, 'linkedin');
        return done(null, { ...user, provider: 'linkedin' });
      } catch (error) {
        return done(error, null);
      }
    }));
  }

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // OAuth Routes

  // Google
  app.get('/api/auth/google', 
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: true
    })
  );
  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: '/login-failed?provider=google'
    }),
    (req, res) => {
      // Custom redirect logic to ensure single-window experience
      res.redirect('/');
    }
  );

  // GitHub
  app.get('/api/auth/github',
    passport.authenticate('github', { 
      scope: ['user:email'],
      session: true
    })
  );
  app.get('/api/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login-failed'
    }),
    (req, res) => {
      // Custom redirect logic to ensure single-window experience
      res.redirect('/');
    }
  );



  // LinkedIn
  app.get('/api/auth/linkedin',
    passport.authenticate('linkedin', {
      session: true
    })
  );
  app.get('/api/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login-failed?provider=linkedin'
    }),
    (req, res) => {
      // Custom redirect logic to ensure single-window experience
      res.redirect('/');
    }
  );

  // General login route - redirect to login page
  app.get('/api/login', (req, res) => {
    // Use a full redirect to the login page
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
    const host = req.get('host');
    return res.redirect(`${protocol}://${host}/login`);
  });

  // Logout
  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.redirect('/');
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};