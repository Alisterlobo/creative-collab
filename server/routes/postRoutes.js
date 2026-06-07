const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const {
  createPost, getAllPosts, getPostById,
  likePost, commentOnPost, savePost, deletePost, 
  getFollowingPosts
} = require('../controllers/postController');

router.get('/following', protect, getFollowingPosts); // ← ADD THIS FIRST
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id/like', protect, likePost);
router.put('/:id/comment', protect, commentOnPost);
router.put('/:id/save', protect, savePost);
router.delete('/:id', protect, deletePost);

module.exports = router;