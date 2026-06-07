const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCollab, getAllCollabs, getCollabById,
  applyToCollab, acceptMember, addTask, updateTask
} = require('../controllers/collabController');

router.get('/', getAllCollabs);
router.get('/:id', getCollabById);
router.post('/', protect, createCollab);
router.put('/:id/apply', protect, applyToCollab);
router.put('/:id/accept/:userId', protect, acceptMember);
router.post('/:id/tasks', protect, addTask);
router.put('/:id/tasks/:taskId', protect, updateTask);

module.exports = router;