const Post = require('../models/Post');

// const createPost = async (req, res) => {
//   try {
//     const { title, description, category, tags, openToCollab } = req.body;
//     const imageUrl = req.file ? req.file.path : '';

//     const post = await Post.create({
//       author: req.user.id,
//       title, description, category,
//       tags: tags ? tags.split(',') : [],
//       openToCollab: openToCollab === 'true',
//       imageUrl
//     });

//     await post.populate('author', 'name avatar');
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const createPost = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { title, description, category, tags, openToCollab } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const imageUrl = req.file ? req.file.path : '';

    const post = await Post.create({
      author: req.user.id,
      title,
      description,
      category: category || 'Other',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      openToCollab: openToCollab === 'true',
      imageUrl
    });

    await post.populate('author', 'name avatar openToCollab');
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: err.message });
  }
};


const getAllPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const posts = await Post.find(filter)
      .populate('author', 'name avatar openToCollab')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.includes(req.user.id);
    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user.id, text: req.body.text });
    await post.save();
    await post.populate('comments.user', 'name avatar');
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const saved = post.savedBy.includes(req.user.id);
    if (saved) {
      post.savedBy = post.savedBy.filter(id => id.toString() !== req.user.id);
    } else {
      post.savedBy.push(req.user.id);
    }
    await post.save();
    res.json({ saved: !saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const User = require('../models/User');
    const me = await User.findById(req.user.id);
    const posts = await Post.find({ author: { $in: me.following } })
      .populate('author', 'name avatar openToCollab')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost, getAllPosts, getPostById,
  likePost, commentOnPost, savePost,
  deletePost, getFollowingPosts
};

module.exports = { createPost, getAllPosts, getPostById, likePost, commentOnPost, savePost, deletePost, getFollowingPosts };