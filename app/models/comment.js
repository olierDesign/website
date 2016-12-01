var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');

// 第一个参数为模型的名字
var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;