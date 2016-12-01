var User = require('../models/user');

// signup 注册
exports.signup = function(req, res) {
	var _user = req.body.user;

	User.find({name: _user.name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (user.length > 0) {
			return res.redirect('/signin');
		} else {
			user = new User(_user);

			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}

				res.redirect('/');
			});
		}
	});	
};

exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '注册页面'
	});
};

// signin 登录
exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			res.redirect('/signup');
		}else {
			user.comparePassword(password, function(err, isMatch) {
				if (err) {
					console.log(err);
				}

				if (isMatch) {
					req.session.user = user;
					return res.redirect('/');
				} else {
					return res.redirect('/signin');
				}
			});
		}
	});

};

exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录页面'
	});
};

// logout 登出
exports.logout = function(req, res) {
	delete req.session.user;
		
	res.redirect('/');
};

// userlist page
exports.list = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}

		res.render('userlist', {
			title: 'website  用户列表页',
			users: users
		});
	});
};

// midware for user
exports.signinRequired = function(req, res, next) {
	var user = req.session.user;

	if (!user) {
		return res.redirect('/signin');
	}

	next();
};

exports.adminRequired = function(req, res, next) {
	var user = req.session.user;

	if (user.role <= 10) {
		return res.redirect('/signup');
	}

	next();
};