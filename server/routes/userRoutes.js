const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserProfile, updateProfile,
  followUser, getFollowers, getSavedPosts
} = require('../controllers/userController');

router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/:id/follow', protect, followUser);
router.get('/:id/followers', getFollowers);
router.get('/saved', protect, getSavedPosts);

module.exports = router;