var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');

// 第一个参数为模型的名字
var User = mongoose.model('User', UserSchema);

module.exports = User;