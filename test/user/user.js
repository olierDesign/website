// 在不监听的情况下测试

var crypto = require('crypto');					// 随机字符串的生成，引入 crypto 插件模块
var bcrypt = require('bcrypt');					// 密码加密，引入 bcrypt 插件模块

function getRandomString(len) {
	if (!len) {
		len = 16;
	}

	// hex -> 生成Unicode字符
	return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

// 引入入口文件 app.js
var app = require('../../app');

var should = require('should');					// 引入 should 插件模块
var mongoose = require('mongoose');				// 引入 mongoose 插件模块

// 引入 User 模块
// 1: 使用路径
// var User = require('../../app/models/user');
// 2: 使用 mongoose.model
var User = mongoose.model('User');

var user;
// 编写 user 的测试用例
describe('<Unit Test', function(){
	describe('Model User:', function() {
		// 开始测试之前，声明一个 user
		before(function(done) {
			user = {
				name: getRandomString(),
				password: 'password'
			};

			done();
		});

		// 存储之前检查用户是否已经存在
		describe('Before Method save', function() {
			// it -> 测试功能点
			// 数据库中没有待注册的用户名
			it('should begin without test user', function(done) {
				User.find({name: user.name}, function(err, users) {
					users.should.have.length(0);

					done();
				});
			});
		});

		// 存储用户
		describe('User save', function() {
			// 保存用户没有报错
			it('should save without problems', function(done) {
				var _user = new User(user);

				_user.save(function(err) {
					should.not.exist(err);

					_user.remove(function(err) {
						should.not.exist(err);

						done();
					});
				});
			});

			// 密码的生成没有问题 (加盐)
			it('should password be hashed correctly', function(done) {
				var password = user.password;		// 原始的密码
				var _user = new User(user);

				_user.save(function(err) {
					should.not.exist(err);
					_user.password.should.not.have.length(0);

					bcrypt.compare(password, _user.password, function(err, isMatch) {
						should.not.exist(err);

						isMatch.should.equal(true);

						_user.remove(function(err) {
							should.not.exist(err);

							done();
						});
					});	
				});
			});

			// 默认权限是0
			it('should have default role 0', function(done) {
				var _user = new User(user);

				_user.save(function(err) {
					// 上面已经检验过 should.not.exist(err);

					_user.role.should.equal(0);

					_user.remove(function(err) {
						done();
					});
				});
			});

			// 用户重名报错
			it('should fail to save an existing user', function(done) {
				var _user1 = new User(user);

				_user1.save(function(err) {
					should.not.exist(err);

					var _user2 = new User(user);

					_user2.save(function(err) {
						should.exist(err);

						_user1.remove(function(err) {
							if (!err) {
								_user2.remove(function(err) {
									done();
								});
							}
						});
					});
				});
			});
		});

		after(function(done) {
			// clear user info
			done();
		});
	});
});