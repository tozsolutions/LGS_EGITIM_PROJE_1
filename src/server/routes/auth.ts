import { Router, Request, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { AuthUtils } from '../utils/auth';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../shared/constants';
import { UserRole } from '../../shared/types';
import db from '../config/database';
import logger from '../utils/logger';
import Joi from 'joi';

const router = Router();

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email adresi giriniz',
    'any.required': 'Email adresi gereklidir'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Şifre en az 6 karakter olmalıdır',
    'any.required': 'Şifre gereklidir'
  })
});

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email adresi giriniz',
    'any.required': 'Email adresi gereklidir'
  }),
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Kullanıcı adı en az 3 karakter olmalıdır',
    'string.max': 'Kullanıcı adı en fazla 30 karakter olabilir',
    'any.required': 'Kullanıcı adı gereklidir'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Şifre en az 8 karakter olmalıdır',
    'any.required': 'Şifre gereklidir'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Ad en az 2 karakter olmalıdır',
    'string.max': 'Ad en fazla 50 karakter olabilir',
    'any.required': 'Ad gereklidir'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Soyad en az 2 karakter olmalıdır',
    'string.max': 'Soyad en fazla 50 karakter olabilir',
    'any.required': 'Soyad gereklidir'
  }),
  role: Joi.string().valid('student', 'teacher').default('student'),
  grade: Joi.number().min(1).max(12).when('role', {
    is: 'student',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  school: Joi.string().max(100).optional(),
  parentEmail: Joi.string().email().when('role', {
    is: 'student',
    then: Joi.optional(),
    otherwise: Joi.forbidden()
  }),
  subject: Joi.string().valid('turkce', 'matematik', 'fen_bilimleri', 'sosyal_bilgiler', 'ingilizce', 'din_kulturu').when('role', {
    is: 'teacher',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  experienceYears: Joi.number().min(0).when('role', {
    is: 'teacher',
    then: Joi.optional(),
    otherwise: Joi.forbidden()
  }),
  qualification: Joi.string().max(200).when('role', {
    is: 'teacher',
    then: Joi.optional(),
    otherwise: Joi.forbidden()
  })
});

// POST /api/v1/auth/login - Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = value;

    // Find user by email
    const user = await db('users')
      .where({ email, is_active: true })
      .first();

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // Verify password
    const isPasswordValid = await AuthUtils.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      logger.warn('Failed login attempt', { email, ip: req.ip });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login_at: new Date() });

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const { accessToken, refreshToken } = AuthUtils.generateTokens(tokenPayload);

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// POST /api/v1/auth/register - Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, username, password, firstName, lastName, role, ...profileData } = value;

    // Additional password validation
    const passwordValidation = AuthUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: passwordValidation.errors.join(', ')
      });
    }

    // Check if user already exists
    const existingUser = await db('users')
      .where({ email })
      .orWhere({ username })
      .first();

    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: existingUser.email === email 
          ? ERROR_MESSAGES.USER_ALREADY_EXISTS 
          : 'Bu kullanıcı adı zaten kullanımda'
      });
    }

    // Hash password
    const passwordHash = await AuthUtils.hashPassword(password);

    // Start transaction
    const result = await db.transaction(async (trx) => {
      // Create user
      const [userId] = await trx('users').insert({
        email,
        username,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: role || UserRole.STUDENT,
        is_active: true
      });

      // Create profile based on role
      if (role === UserRole.STUDENT || !role) {
        await trx('student_profiles').insert({
          user_id: userId,
          grade: profileData.grade || 8,
          school: profileData.school,
          parent_email: profileData.parentEmail
        });
      } else if (role === UserRole.TEACHER) {
        await trx('teacher_profiles').insert({
          user_id: userId,
          subject: profileData.subject,
          experience_years: profileData.experienceYears || 0,
          qualification: profileData.qualification
        });
      }

      return userId;
    });

    logger.info('User registered successfully', { userId: result, email, role });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_CREATED,
      data: {
        userId: result
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// GET /api/v1/auth/profile - Get current user profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    // Get user with profile data
    const user = await db('users')
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    let profileData = {};

    // Get role-specific profile data
    if (user.role === UserRole.STUDENT) {
      const profile = await db('student_profiles')
        .where({ user_id: user.id })
        .first();
      profileData = profile;
    } else if (user.role === UserRole.TEACHER) {
      const profile = await db('teacher_profiles')
        .where({ user_id: user.id })
        .first();
      profileData = profile;
    } else if (user.role === UserRole.ADMIN) {
      const permissions = await db('admin_permissions')
        .where({ user_id: user.id })
        .select('permission');
      profileData = { permissions: permissions.map(p => p.permission) };
    }

    res.json({
      success: true,
      message: 'Profil bilgileri getirildi',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at,
        profile: profileData
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// POST /api/v1/auth/refresh - Refresh access token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Refresh token gereklidir'
      });
    }

    try {
      const decoded = AuthUtils.verifyToken(refreshToken);
      
      // Verify user still exists and is active
      const user = await db('users')
        .where({ id: decoded.id, is_active: true })
        .first();

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
      }

      // Generate new tokens
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const tokens = AuthUtils.generateTokens(tokenPayload);

      res.json({
        success: true,
        message: 'Token yenilendi',
        data: {
          tokens: {
            ...tokens,
            expiresIn: 7 * 24 * 60 * 60
          }
        }
      });

    } catch (tokenError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID
      });
    }

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

// POST /api/v1/auth/logout - Logout user
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // In a more sophisticated implementation, you would:
    // 1. Add the token to a blacklist
    // 2. Store active sessions in Redis
    // 3. Invalidate the specific session
    
    // For now, we just log the logout
    logger.info('User logged out', { userId: req.user?.id });

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
});

export default router;