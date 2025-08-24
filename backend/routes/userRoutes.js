import { Router } from 'express';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { listUsers, toggleBlock, deleteUser, getMyUsers } from '../controllers/userController.js';

const router = Router();

// ✅ Admin Routes
router.get('/', protect, requireAdmin, listUsers);
router.patch('/:id/toggle-block', protect, requireAdmin, toggleBlock);
router.delete('/:id', protect, requireAdmin, deleteUser);

router.get("/me", protect, getMyUsers);

export default router;
