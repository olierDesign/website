var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
var Comment = require('../models/comment');
var _ = require('underscore');

var fs = require('fs');
var path = require('path');

// detail page
exports.detail = function(req, res) {
	var id = req.params.id;		// 拿到 url 中的 id 值

	// 每次请求 /movie/:id ， 该电影的 pv 加 1
	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
		if (err) {
			console.log(err);
		}
	});

	Movie.findById(id, function(err, movie) {
		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				
				res.render('detail', {
					title: movie.title + '详情页',
					movie: movie,
					comments: comments
				});

			});
	});
};

// admin new page
exports.new = function(req, res) {
	Catetory.find({}, function(err, catetories) {
		res.render('admin', {
			title: 'website 后台录入页',
			catetories: catetories,
			movie: {}
		});
	});
};

// admin update movie 点击列表页"list page"的 "更新"，把数据导入到 "admin page"后台录入页
exports.update = function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(err, movie) {
			Catetory.find({}, function(err, catetories) {
				res.render('admin', {
					title: 'website 更新录入页',
					movie: movie,
					catetories: catetories
				});
			});
		});
	}
};

// admin poster
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	// console.log(req.files);

	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;

			// __dirname: 当前路径
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

			fs.writeFile( newPath, data, function(err) {
				req.poster = poster;
				next();
			});
		});
	} else {
		next();
	}
};

// admin post movie 存储从表单提交的数据,拿到从 "admin page" post 过来的数据
exports.save = function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	// 如果 req.poster 存在， 说明上一个流程存储了一个新的海报地址
	if (req.poster) {
		movieObj.poster = req.poster;
	}

	// 表示该数据已存在
	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			// underscore的extend方法可以把新的movie数据，替换掉旧的movieObj数据
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});	
		});
	} else  {

		// 分类id
		var catetoryId = movieObj.catetory;
		// 分类名
		var catetoryName = movieObj.catetoryName;

		_movie = new Movie(movieObj);

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}

			if (catetoryId) {
				Catetory.findById(catetoryId, function(err, catetory) {
					catetory.movies.push(movie._id);

					catetory.save(function(err, catetory) {
						res.redirect('/movie/' + movie._id);
					});
				});
			} else if (catetoryName) {
				var catetory = new Catetory({
					name: catetoryName,
					movies: [movie._id]
				});

				catetory.save(function(err, catetory) {
					movie.catetory = catetory._id;
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie._id);
					});
				});
			} 
		});
	}
};

// list page
exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('list', {
			title: 'website 列表页',
			movies: movies
		});
	});
};

// list delete movie 点击列表页删除按钮，ajax调用的后台处理
exports.del = function(req, res) {
	var id = req.query.id;

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err);
				res.json({success: 0});
			} else {
				res.json({success: 1});
			}
		});
	}
};