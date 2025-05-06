import express from 'express';
import auth from '../middleware/auth.js';
import { getUserProfile, editUserProfile, getUserByUsername, getUserById, getSuggestedUsers, searchUsers, followUser, getSavedPosts, getLikedPosts } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, editUserProfile);
router.get('/username/:username', auth, getUserByUsername);
router.get('/id/:userId', auth, getUserById);
router.get('/suggested', auth, getSuggestedUsers);
router.get('/search', auth, searchUsers);
router.post('/:userId/follow', auth, followUser);
router.get('/saved', auth, getSavedPosts);
router.get('/liked', auth, getLikedPosts);

export default router; 