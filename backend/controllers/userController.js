import User from '../models/User.js';
import Post from '../models/Post.js';

export const getUserProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editUserProfile = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'username', 'bio', 'profilePic'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followingIds = user.following.map(id => id.toString());
    const users = await User.find({ _id: { $nin: [...followingIds, req.user._id.toString()] } }).limit(5);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    const users = await User.find({ username: { $regex: username, $options: 'i' } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    if (!userToFollow) return res.status(404).json({ error: 'User not found' });
    const userId = req.user._id.toString();
    const targetId = userToFollow._id.toString();
    let isFollowing = req.user.following.includes(targetId);
    if (isFollowing) {
      await User.findByIdAndUpdate(userId, { $pull: { following: targetId } });
      await User.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });
      await User.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } });
    }
    res.json({ following: !isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = await Post.find({ _id: { $in: user.savedPosts } })
      .sort({ createdAt: -1 })
      .populate('createdBy');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = await Post.find({ _id: { $in: user.likedPosts } })
      .sort({ createdAt: -1 })
      .populate('createdBy');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 