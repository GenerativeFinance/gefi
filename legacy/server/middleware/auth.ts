import type { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if user is authenticated (this would typically check session or JWT)
  if (req.session && (req.session as any).user) {
    req.user = (req.session as any).user;
    return next();
  }

  // For development/testing purposes, we'll create a mock user if none exists
  if (!req.user && process.env.NODE_ENV !== 'production') {
    req.user = {
      id: 'github_55703540',
      email: 'test@example.com',
      role: 'admin'
    };
    return next();
  }

  return res.status(401).json({ error: 'Authentication required' });
};

export default { isAuthenticated };