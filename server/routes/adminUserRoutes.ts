import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { isAuthenticated } from "../multiAuth";

// Validation schema for creating new users
const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userType: z.string().min(1, "User type is required"),
  status: z.enum(["active", "pending", "suspended", "banned"]).default("active"),
  company: z.string().optional(),
  country: z.string().optional(),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Expert"]).optional(),
  platformIntent: z.enum(["Buy Models", "Sell/Upload Models", "Both", "Browse/Learn"]).optional()
});

// Role mapping for admin user creation
const mapUserTypeToRole = (userType: string): string => {
  const mapping: Record<string, string> = {
    "Investor": "investor",
    "Portfolio Manager": "portfolio_manager",
    "Fund Manager": "fund_manager", 
    "Wealth Manager / Financial Advisor": "wealth_manager",
    "Trader": "trader",
    "Analyst (Equity / Credit / Quant)": "analyst",
    "Risk Manager": "risk_manager",
    "Treasury Manager": "treasury_manager",
    "Institutional Allocator": "institutional_allocator",
    "Venture Capitalist": "venture_capitalist",
    "Private Equity Partner": "private_equity_partner",
    "Angel Investor": "angel_investor",
    "Family Office Representative": "family_office_representative",
    "Corporate Finance Executive": "corporate_finance_executive",
    "Developer": "developer",
    "Data Provider": "data_provider",
    "Regulator": "regulator"
  };
  
  return mapping[userType] || "user";
};

// Middleware to check admin/moderator permissions
const requireAdminOrModerator = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const user = req.user;
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }
  
  next();
};

export function registerAdminUserRoutes(app: Express) {
  // Create new user endpoint
  app.post('/api/admin/users', requireAdminOrModerator, async (req: any, res) => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ 
          message: 'A user with this email already exists',
          emailExists: true 
        });
      }

      // Generate unique user ID
      const userId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Map user type to role
      const role = mapUserTypeToRole(validatedData.userType);
      
      // Create user data object
      const userData = {
        id: userId,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: role,
        status: validatedData.status,
        provider: 'admin_created',
        company: validatedData.company || null,
        country: validatedData.country || null,
        experienceLevel: validatedData.experienceLevel || null,
        platformIntent: validatedData.platformIntent || null,
        profileImageUrl: null,
        subscriptionTier: 'free',
        riskScore: 0,
        totalTrades: 0,
        areasOfFocus: [],
        preferredModelTypes: [],
        subscriptionPreferences: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create user in database
      const newUser = await storage.upsertUser(userData);
      
      // Create user profile
      try {
        await storage.createOrUpdateUserProfile(userId, {
          displayName: `${validatedData.firstName} ${validatedData.lastName}`,
          bio: `${validatedData.userType}${validatedData.company ? ` at ${validatedData.company}` : ''}${validatedData.country ? ` from ${validatedData.country}` : ''}`,
          profileCompleted: true
        });
      } catch (profileError) {
        console.error('Failed to create profile for new user:', profileError);
        // Don't fail the user creation if profile creation fails
      }

      console.log(`✅ Admin created user: ${userId} (${validatedData.email})`);
      
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          status: newUser.status,
          userType: validatedData.userType
        }
      });
      
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Validation error',
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
}