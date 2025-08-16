import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";

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

// Middleware to check admin/moderator permissions with enhanced checks
const requireAdminOrModerator = async (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "No user session found" });
  }

  // Get fresh user data from database to ensure current role/status
  try {
    const dbUser = await storage.getUser(user.id);
    if (!dbUser) {
      return res.status(401).json({ message: "User not found in database" });
    }

    // Check if user has admin or moderator role
    if (dbUser.role !== 'admin' && dbUser.role !== 'moderator') {
      return res.status(403).json({ 
        message: "Access denied. Admin or moderator role required.",
        userRole: dbUser.role 
      });
    }

    // Attach fresh user data to request for use in route handlers
    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return res.status(500).json({ message: "Permission check failed" });
  }
};

export function registerAdminRoutes(app: Express) {
  // Get admin statistics (admin/moderator only)
  app.get('/api/admin/stats', requireAdminOrModerator, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      const stats = {
        totalUsers: users.length,
        activeModels: 0, // No fictional data - will be real when implemented
        totalRevenue: 0, // No fictional data - will be real when implemented  
        pendingReviews: 0, // No fictional data - will be real when implemented
        securityAlerts: 0, // No fictional data - will be real when implemented
        supportTickets: 0, // No fictional data - will be real when implemented
        complianceRate: 0, // No fictional data - will be real when implemented
        resolutionRate: 0 // No fictional data - will be real when implemented
      };
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Failed to fetch admin statistics' });
    }
  });

  // Get all users (admin/moderator only)
  app.get('/api/admin/users', requireAdminOrModerator, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Transform users to match frontend interface
      const transformedUsers = users.map(user => ({
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userType: mapRoleToUserType(user.role),
        status: user.status || 'active',
        verified: user.status === 'active',
        lastLogin: user.lastLoginAt?.toISOString() || user.updatedAt?.toISOString() || '',
        totalTrades: user.totalTrades || 0,
        joinDate: user.createdAt?.toISOString().split('T')[0] || '',
        riskScore: user.riskScore || 0,
        complianceStatus: getComplianceStatus(user.riskScore || 0),
        provider: user.provider || 'email',
        role: user.role || 'user',
        // Additional debug info
        debugInfo: {
          dbRole: user.role,
          dbStatus: user.status,
          dbProvider: user.provider,
          dbCreatedAt: user.createdAt
        }
      }));

      res.json(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Get user statistics (admin/moderator only)
  app.get('/api/admin/users/stats', requireAdminOrModerator, async (req: any, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ message: 'Failed to fetch user statistics' });
    }
  });

  // Update user status (admin/moderator only)
  app.put('/api/admin/users/:id/status', requireAdminOrModerator, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['active', 'suspended', 'pending', 'banned'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const updatedUser = await storage.updateUserStatus(id, status, req.user.id);
      res.json({ 
        message: 'User status updated successfully', 
        user: {
          id: updatedUser.id,
          status: updatedUser.status,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Failed to update user status' });
    }
  });

  // Update user role (admin only)
  app.put('/api/admin/users/:id/role', requireAdminOrModerator, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      // Only admins can change roles
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can modify user roles' });
      }
      
      // Extended list of valid roles including financial professional roles
      const validRoles = [
        'user', 'admin', 'moderator', 'developer', 'data_provider', 'regulator',
        // Financial Professional roles
        'investor', 'portfolio_manager', 'fund_manager', 'wealth_manager', 
        'wealth_manager_financial_advisor', 'trader', 'analyst', 'analyst_equity_credit_quant',
        'risk_manager', 'treasury_manager', 'institutional_allocator', 'venture_capitalist', 
        'private_equity_partner', 'angel_investor', 'family_office_representative', 
        'corporate_finance_executive'
      ];
      
      // Map user type to internal role
      const roleFromUserType = mapUserTypeToRole(role);
      console.log('Attempting to update role:', role, '-> internal role:', roleFromUserType);
      
      if (!validRoles.includes(roleFromUserType)) {
        console.log('Invalid role. Valid roles are:', validRoles);
        return res.status(400).json({ 
          message: 'Invalid role value',
          received: role,
          mapped: roleFromUserType,
          validRoles: validRoles
        });
      }

      const updatedUser = await storage.updateUserRole(id, roleFromUserType, req.user.id);
      res.json({ 
        message: 'User role updated successfully', 
        user: {
          id: updatedUser.id,
          role: updatedUser.role,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Failed to update user role' });
    }
  });

  // Get single user details (admin/moderator only)
  app.get('/api/admin/users/:id', requireAdminOrModerator, async (req: any, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Transform user data
      const transformedUser = {
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userType: mapRoleToUserType(user.role),
        status: user.status || 'active',
        verified: user.status === 'active',
        lastLogin: user.lastLoginAt?.toISOString() || user.updatedAt?.toISOString() || '',
        totalTrades: user.totalTrades || 0,
        joinDate: user.createdAt?.toISOString().split('T')[0] || '',
        riskScore: user.riskScore || 0,
        complianceStatus: getComplianceStatus(user.riskScore || 0),
        provider: user.provider || 'email',
        role: user.role || 'user',
        profileImageUrl: user.profileImageUrl,
        subscriptionTier: user.subscriptionTier || 'free',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json(transformedUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user details' });
    }
  });

  // Update user status
  app.put('/api/admin/users/:userId/status', requireAdminOrModerator, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!['active', 'pending', 'suspended', 'banned'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      await storage.updateUserStatus(userId, status);
      
      res.json({ 
        message: 'User status updated successfully',
        userId,
        status 
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update user role/type
  app.put('/api/admin/users/:userId/role', requireAdminOrModerator, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const validRoles = [
        "Investor", "Portfolio Manager", "Fund Manager", "Wealth Manager / Financial Advisor",
        "Trader", "Analyst (Equity / Credit / Quant)", "Risk Manager", "Treasury Manager", 
        "Institutional Allocator", "Venture Capitalist", "Private Equity Partner", 
        "Angel Investor", "Family Office Representative", "Corporate Finance Executive",
        "Developer", "Data Provider", "Regulator"
      ];

      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role value' });
      }

      await storage.updateUserRole(userId, role);
      
      res.json({ 
        message: 'User role updated successfully',
        userId,
        role 
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

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

// Helper function to map role to user type for display
function mapRoleToUserType(role?: string): string {
  if (!role) return 'User';
  
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'moderator': 'Moderator', 
    'developer': 'Developer',
    'data_provider': 'Data Provider',
    'regulator': 'Regulator',
    'investor': 'Investor',
    'portfolio_manager': 'Portfolio Manager',
    'fund_manager': 'Fund Manager',
    'wealth_manager': 'Wealth Manager',
    'wealth_manager_financial_advisor': 'Wealth Manager / Financial Advisor',
    'trader': 'Trader',
    'analyst': 'Analyst',
    'analyst_equity_credit_quant': 'Analyst (Equity / Credit / Quant)',
    'risk_manager': 'Risk Manager',
    'treasury_manager': 'Treasury Manager',
    'institutional_allocator': 'Institutional Allocator',
    'venture_capitalist': 'Venture Capitalist',
    'private_equity_partner': 'Private Equity Partner',
    'angel_investor': 'Angel Investor',
    'family_office_representative': 'Family Office Representative',
    'corporate_finance_executive': 'Corporate Finance Executive'
  };
  
  return roleMap[role.toLowerCase()] || 'User';
}

// Helper function to map user type to role for storage
function mapUserTypeToRole(userType: string): string {
  const userTypeMap: Record<string, string> = {
    'Admin': 'admin',
    'Moderator': 'moderator',
    'Developer': 'developer',
    'Data Provider': 'data_provider',
    'Regulator': 'regulator',
    'Investor': 'investor',
    'Portfolio Manager': 'portfolio_manager',
    'Fund Manager': 'fund_manager',
    'Wealth Manager': 'wealth_manager',
    'Wealth Manager / Financial Advisor': 'wealth_manager_financial_advisor',
    'Trader': 'trader',
    'Analyst': 'analyst',
    'Analyst (Equity / Credit / Quant)': 'analyst_equity_credit_quant',
    'Risk Manager': 'risk_manager',
    'Treasury Manager': 'treasury_manager',
    'Institutional Allocator': 'institutional_allocator',
    'Venture Capitalist': 'venture_capitalist',
    'Private Equity Partner': 'private_equity_partner',
    'Angel Investor': 'angel_investor',
    'Family Office Representative': 'family_office_representative',
    'Corporate Finance Executive': 'corporate_finance_executive'
  };
  
  return userTypeMap[userType] || 'user';
}

function getComplianceStatus(riskScore: number): string {
  if (riskScore <= 20) return 'compliant';
  if (riskScore <= 50) return 'under_review';
  return 'high_risk';
}