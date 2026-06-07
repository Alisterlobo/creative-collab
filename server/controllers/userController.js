const User = require('../models/User');
const Post = require('../models/Post');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const followUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ message: "Can't follow yourself" });

    const target = await User.findById(req.params.id);
    const me = await User.findById(req.user.id);

    const isFollowing = me.following.includes(req.params.id);
    if (isFollowing) {
      me.following = me.following.filter(id => id.toString() !== req.params.id);
      target.followers = target.followers.filter(id => id.toString() !== req.user.id);
    } else {
      me.following.push(req.params.id);
      target.followers.push(req.user.id);
    }

    await me.save();
    await target.save();
    res.json({ following: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name avatar bio');
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ savedBy: req.user.id }).populate('author', 'name avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserProfile, updateProfile, followUser, getFollowers, getSavedPosts };