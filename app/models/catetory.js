var mongoose = require('mongoose');
var CatetorySchema = require('../schemas/catetory');

// 第一个参数为模型的名字
var Catetory = mongoose.model('Catetory', CatetorySchema);

module.exports = Catetory;