import { Router } from 'express';

const router = Router();

// GET /api/v1/users - Get all users (admin only)
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Users routes placeholder'
  });
});

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Get user ${req.params.id} placeholder`
  });
});

// PUT /api/v1/users/:id - Update user
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Update user ${req.params.id} placeholder`
  });
});

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Delete user ${req.params.id} placeholder`
  });
});

export default router;