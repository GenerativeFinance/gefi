import type { Express } from "express";
import { storage } from "../storage";

// Middleware to check admin/moderator permissions
const requireAdminOrModerator = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return res.status(403).json({ message: "Access denied. Admin or moderator role required." });
  }

  next();
};

export function registerAdminRoutes(app: Express) {
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
        role: user.role || 'user'
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
      
      if (!['user', 'admin', 'moderator'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role value' });
      }

      const updatedUser = await storage.updateUserRole(id, role, req.user.id);
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
}

// Helper functions
function mapRoleToUserType(role?: string): string {
  switch (role) {
    case 'admin': return 'Admin';
    case 'moderator': return 'Moderator';
    case 'user': return 'Investor';
    default: return 'User';
  }
}

function getComplianceStatus(riskScore: number): string {
  if (riskScore <= 20) return 'compliant';
  if (riskScore <= 50) return 'under_review';
  return 'high_risk';
}