import Post from '../models/Post.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const createPost = async (req, res) => {
  try {
    if (req.user.role !== 'creator') return res.status(403).json({ error: 'Only creators can create posts.' });
    const { caption, imageURL, createdAt, createdBy } = req.body;
    if (!imageURL) return res.status(400).json({ error: 'imageURL is required' });
    if (!createdBy) return res.status(400).json({ error: 'createdBy is required' });
    if (!mongoose.Types.ObjectId.isValid(createdBy)) return res.status(400).json({ error: 'createdBy must be a valid user _id' });
    const post = new Post({ caption, imageURL, createdAt, createdBy, likes: [], comments: [] });
    await post.save();
    await User.findByIdAndUpdate(createdBy, { $push: { posts: post._id } });
    res.status(201).json({ ...post.toObject(), id: post._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts.map(post => ({ ...post.toObject(), id: post._id })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(posts.map(post => ({ ...post.toObject(), id: post._id })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });
    await Post.findByIdAndDelete(req.params.postId);
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: req.params.postId } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const comment = { text, createdBy: req.user._id, createdAt: Date.now() };
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: comment } },
      { new: true }
    );
    res.json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: postId } });
    res.json({ message: 'Post saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unsavePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
    res.json({ message: 'Post unsaved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const userId = req.user._id.toString();
    let updatedPost;
    if (post.likes.map(id => id.toString()).includes(userId)) {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: req.params.postId } });
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(userId, { $addToSet: { likedPosts: req.params.postId } });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 