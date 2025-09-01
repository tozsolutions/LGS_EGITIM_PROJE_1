import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../shared/constants';
import { UserRole } from '../../shared/types';
import logger from '../utils/logger';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = AuthUtils.verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
      
      next();
    } catch (tokenError) {
      logger.warn('Invalid token attempt', { token: token.substring(0, 10) + '...', ip: req.ip });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID
      });
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', { 
        userId: req.user.id, 
        userRole: req.user.role, 
        requiredRoles: roles,
        route: req.path
      });
      
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    next();
  };
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = AuthUtils.verifyToken(token);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        };
      } catch (tokenError) {
        // Invalid token, but we continue without user info
        logger.warn('Invalid token in optional auth', { ip: req.ip });
      }
    }
    
    next();
  } catch (error) {
    logger.error('Optional authentication middleware error:', error);
    next(); // Continue without authentication
  }
};

export { AuthRequest };