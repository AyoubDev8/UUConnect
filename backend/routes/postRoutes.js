import express from 'express';
import auth from '../middleware/auth.js';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  deletePost,
  addComment,
  getComments,
  likePost,
  savePost,
  unsavePost
} from '../controllers/postController.js';

const router = express.Router();

router.post('/', auth, createPost);
router.get('/feed', auth, getFeedPosts);
router.get('/user/:userId', auth, getUserPosts);
router.delete('/:postId', auth, deletePost);
router.post('/:postId/comments', auth, addComment);
router.get('/:postId/comments', auth, getComments);
router.post('/:postId/like', auth, likePost);
router.post('/:postId/save', auth, savePost);
router.post('/:postId/unsave', auth, unsavePost);

export default router; 