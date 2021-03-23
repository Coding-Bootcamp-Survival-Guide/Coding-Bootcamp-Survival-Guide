// import all models
const Post = require('./Post');
const User = require('./User');
const Like = require('./Like');
const Comment = require('./Comment');

// create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Like.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Like.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

User.hasMany(Like, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Post.hasMany(Like, {
  foreignKey: 'post_id'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Like, Comment };
