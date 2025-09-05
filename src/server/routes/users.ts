import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../shared/constants';
import { UserRole } from '../../shared/types';
import db from '../config/database';

const router = Router();

// GET /api/v1/users - Get all users (admin only)
router.get('/', authenticate, authorize([UserRole.ADMIN]), async (_req, res): Promise<void> => {
  const users = await db('users').select('id','email','username','firstName','lastName','role','isActive','createdAt','updatedAt');
  res.json({ success: true, data: { users } });
  return;
});

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', authenticate, async (req, res): Promise<void> => {
  const user = await db('users').select('id','email','username','firstName','lastName','role','isActive','createdAt','updatedAt').where({ id: req.params.id }).first();
  if (!user) { res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.USER_NOT_FOUND }); return; }
  res.json({ success: true, data: { user } });
  return;
});

// PUT /api/v1/users/:id - Update user
router.put('/:id', authenticate, authorize([UserRole.ADMIN]), async (req, res): Promise<void> => {
  const { firstName, lastName, role, isActive } = req.body || {};
  await db('users').where({ id: req.params.id }).update({ firstName, lastName, role, isActive, updatedAt: db.fn.now() });
  const user = await db('users').select('id','email','username','firstName','lastName','role','isActive','createdAt','updatedAt').where({ id: req.params.id }).first();
  res.json({ success: true, data: { user } });
  return;
});

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), async (req, res): Promise<void> => {
  await db('users').where({ id: req.params.id }).delete();
  res.status(HTTP_STATUS.NO_CONTENT).send();
  return;
});

export default router;