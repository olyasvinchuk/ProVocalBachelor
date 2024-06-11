import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  // test,
  verifyToken,
    getUserByToken
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/token').get(verifyToken, getUserByToken);


router.route('/').post(registerUser).get(protect, getUsers);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
// router.get('/test', test)
router.get('/verify', verifyToken)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(
      // protect
      // , admin
      deleteUser)
  .get(
      // protect
      // , admin
      getUserById)
  .put(
      // protect
      // , admin     ,
      updateUser);

export default router;
