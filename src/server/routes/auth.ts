import { Router } from 'express';
import Joi from 'joi';
import { AuthRequest, authenticate } from '../middleware/auth';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../shared/constants';
import { UserRole } from '../../shared/types';
import { AuthUtils } from '../utils/auth';
import db from '../config/database';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(32).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'teacher', 'student').default('student')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

// GET /api/v1/auth/profile - Get current user profile
router.get('/profile', authenticate, async (req: AuthRequest, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    const user = await db('users')
      .select('id', 'email', 'username', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'updatedAt')
      .where({ id: req.user.id })
      .first();

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.USER_NOT_FOUND });
      return;
    }

    res.json({ success: true, message: 'Profil', data: { user } });
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
  return;
});

// POST /api/v1/auth/register - Register new user
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.VALIDATION_ERROR, error: error.message });
      return;
    }

    const { email, username, firstName, lastName, password, role } = value as {
      email: string; username: string; firstName: string; lastName: string; password: string; role: UserRole;
    };

    // Extra password strength validation
    const pwd = AuthUtils.validatePassword(password);
    if (!pwd.isValid) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.WEAK_PASSWORD, error: pwd.errors.join(', ') });
      return;
    }

    // Uniqueness checks
    const existing = await db('users').whereRaw('LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)', [email, username]).first();
    if (existing) {
      res.status(HTTP_STATUS.CONFLICT).json({ success: false, message: ERROR_MESSAGES.USER_ALREADY_EXISTS });
      return;
    }

    const hashed = await AuthUtils.hashPassword(password);
    const [id] = await db('users').insert({ email, username, firstName, lastName, role, isActive: true, password: hashed });

    const payload = { id, email, role };
    const tokens = AuthUtils.generateTokens(payload);

    const user = await db('users')
      .select('id', 'email', 'username', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'updatedAt')
      .where({ id })
      .first();

    res.status(HTTP_STATUS.CREATED).json({ success: true, message: SUCCESS_MESSAGES.USER_CREATED, data: { user, tokens } });
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
  return;
});

// POST /api/v1/auth/login - Login user
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.VALIDATION_ERROR, error: error.message });
      return;
    }

    const { email, password } = value as { email: string; password: string };
    const user = await db('users').whereRaw('LOWER(email) = LOWER(?)', [email]).first();
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    const ok = await AuthUtils.comparePassword(password, user.password);
    if (!ok) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    const payload = { id: user.id, email: user.email, role: user.role as UserRole };
    const tokens = AuthUtils.generateTokens(payload);

    const safe = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS, data: { user: safe, tokens } });
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
  return;
});

// POST /api/v1/auth/refresh - Refresh access token
router.post('/refresh', async (req, res): Promise<void> => {
  try {
    const { error, value } = refreshSchema.validate(req.body);
    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.VALIDATION_ERROR, error: error.message });
      return;
    }

    const { refreshToken } = value as { refreshToken: string };
    const decoded: any = AuthUtils.verifyToken(refreshToken);

    // Ensure the user still exists and is active
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user || !user.isActive) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    const tokens = AuthUtils.generateTokens({ id: user.id, email: user.email, role: user.role });
    res.json({ success: true, message: 'Token yenilendi', data: { tokens } });
  } catch (error: any) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.TOKEN_INVALID });
  }
  return;
});

// POST /api/v1/auth/logout - Logout user (stateless)
router.post('/logout', authenticate, async (_req, res): Promise<void> => {
  res.json({ success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
  return;
});

export default router;