var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');

// 第一个参数为模型的名字
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;