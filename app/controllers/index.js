var Movie = require('../models/movie');
var Catetory = require('../models/catetory');

// index page
exports.index = function(req, res) {
	Catetory
		.find({})
		.populate({
			path: 'movies',
			options: {
				limit: 6
			}
		})
		.exec(function(err, catetories) {
			if (err) {
				console.log(err);
			}

			res.render('index', {
				title: 'website 首页',
				catetories: catetories
			});
		});
};


exports.search = function(req, res) {
	// 分页查询
	var catId = req.query.cat;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;
	var index = page * count;

	// 搜索
	var q = req.query.q;

	if (catId) {
		Catetory
		.find({_id: catId})
		.populate({
			path: 'movies',
			select: 'title poster'
			// options: {
			// 	limit: 2,
			// 	skip: index
			// }
		})
		.exec(function(err, catetories) {
			if (err) {
				console.log(err);
			}

			var catetory = catetories[0] || {};
			var movies = catetory.movies || [];
			var results = movies.slice(index, index + count);

			res.render('results', {
				title: 'website 结果列表',
				keyword: catetory.name,
				currentPage: page + 1,
				query: 'cat=' + catId,
				totalPage: Math.ceil(movies.length / count),
				movies: results
			});
		});
	} else {
		Movie
			.find({title: new RegExp((q+ '.*'), 'i')})
			.exec(function(err, movies) {
				if (err) {
					console.log(err);
				}

				var results = movies.slice(index, index + count);

				res.render('results', {
					title: 'website 搜索列表页面',
					keyword: q,
					currentPage: (page + 1),
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / count),
					movies: results
				});
			});
	}
		
};