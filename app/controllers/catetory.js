var Catetory = require('../models/catetory');

// admin new page
exports.new = function(req, res) {
	res.render('catetory_admin', {
		title: 'website 后台分类录入页',
		catetory: {}
	});
};

// admin post catetory 存储从表单提交的数据,拿到从 "admin page" post 过来的数据
exports.save = function(req, res) {
	var _catetory = req.body.catetory;
	var catetory;

	catetory = new Catetory(_catetory);

	catetory.save(function(err, catetory) {
		if (err) {
			console.log(err);
		}

		res.redirect('/admin/catetory/list');
	});
};

// list page
exports.list = function(req, res) {
	Catetory.fetch(function(err, catetories) {
		if (err) {
			console.log(err);
		}

		res.render('catetorylist', {
			title: 'website 分类列表页',
			catetories: catetories
		});
	});
};