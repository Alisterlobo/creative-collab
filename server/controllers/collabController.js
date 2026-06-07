const CollabRoom = require('../models/CollabRoom');

const createCollab = async (req, res) => {
  try {
    const { title, description, lookingFor, compensation } = req.body;
    const room = await CollabRoom.create({
      title, description, lookingFor, compensation,
      owner: req.user.id,
      members: [req.user.id]
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCollabs = async (req, res) => {
  try {
    const collabs = await CollabRoom.find({ isOpen: true })
      .populate('owner', 'name avatar')
      .populate('members', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(collabs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCollabById = async (req, res) => {
  try {
    const room = await CollabRoom.findById(req.params.id)
      .populate('owner', 'name avatar')
      .populate('members', 'name avatar')
      .populate('messages.sender', 'name avatar');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const applyToCollab = async (req, res) => {
  try {
    const room = await CollabRoom.findById(req.params.id);
    if (room.members.includes(req.user.id))
      return res.status(400).json({ message: 'Already a member' });
    res.json({ message: 'Application sent! Owner will review.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptMember = async (req, res) => {
  try {
    const room = await CollabRoom.findById(req.params.id);
    if (room.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Only owner can accept members' });
    if (!room.members.includes(req.params.userId)) {
      room.members.push(req.params.userId);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addTask = async (req, res) => {
  try {
    const room = await CollabRoom.findById(req.params.id);
    room.tasks.push(req.body);
    await room.save();
    res.json(room.tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const room = await CollabRoom.findById(req.params.id);
    const task = room.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    Object.assign(task, req.body);
    await room.save();
    res.json(room.tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCollab, getAllCollabs, getCollabById, applyToCollab, acceptMember, addTask, updateTask };