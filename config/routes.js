var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Catetory = require('../app/controllers/catetory');

var multipart = require('connect-multiparty');		// 可以获取上传文件的类型，名字，路径等
var multipartMiddleware = multipart();				// 上传文件的中间件
// app.use(multipart());								

module.exports = function(app) {
	// pre handle user
	app.use(function(req, res, next) {
		var _user = req.session.user;

		app.locals.user = _user;
		
		next();
	});


	// 首页 Index
	// index page
	app.get('/', Index.index);


	// 用户 User
	// signup 注册
	app.post('/user/signup', User.signup);
	app.get('/signup', User.showSignup);
	// signin 登录
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	// logout 登出
	app.get('/logout', User.logout);
	// userlist page
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);


	// 电影 Movie
	// detail page
	app.get('/movie/:id', Movie.detail);
	// admin page
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	// admin update movie 点击列表页"list page"的 "更新"，把数据导入到 "admin page"后台录入页
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);	
	// admin post movie "存储" 从表单提交的数据,拿到从 "admin page" post 过来的数据
	app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save)
	// list page
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
	// list delete movie 点击列表页删除按钮，ajax调用的后台处理
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);


	// 评论 Comment
	app.post('/user/comment', User.signinRequired, Comment.save);


	// 电影分类 Catetory
	// admin page
	app.get('/admin/catetory/new', User.signinRequired, User.adminRequired, Catetory.new);
	app.post('/admin/catetory', User.signinRequired, User.adminRequired, Catetory.save);
	app.get('/admin/catetory/list', User.signinRequired, User.adminRequired, Catetory.list);

	// results
	app.get('/results', Index.search)
} 

