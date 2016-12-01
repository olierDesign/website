var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
	movie: {
		type: ObjectId,
		ref: 'Movie'
	},
	from: {
		type: ObjectId,
		ref: 'User'
	},
	reply: [{
		from: {type: ObjectId, ref: 'User'},
		to: {type: ObjectId, ref: 'User' },
		content: String
	}],
	content: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

// 每次保存之前都调用一下这个方法
CommentSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next(); 
});

// 静态方法不会与数据库进行交换，只有通过module编译实例化后才执行这个方法
CommentSchema.statics = {
	// 用于取出数据库中所有的数据
	fetch: function(cb) {
		return this
				.find({})
				.sort('meta.updateAt')
				.exec(cb);
	},
	// 用于取出数据库中单条数据
	findById: function(id, cb) {
		return this
				.findOne({_id: id})
				.exec(cb);
	}
};

module.exports = CommentSchema;





