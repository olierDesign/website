var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;						// 端口
var app = express();

app.set('views', './app/views/pages');						// 设置视图路径
app.set('view engine', 'jade');								// 设置视图引擎

var serveStatic = require('serve-static');
app.use(serveStatic(path.join(__dirname, 'public')));		// 静态资源路径

app.locals.moment = require('moment');						// 日期处理类库

var mongoose = require('mongoose');							// 数据库
var dbUrl = 'mongodb://localhost/website';
mongoose.connect(dbUrl);									// 连接数据库
mongoose.Promise = global.Promise;

var fs = require('fs');
//models loading 
var models_path = __dirname + '/app/models';				// 模型目录路径
// 1. 读取模型目录，并且遍历该目录下的所有文件
// 2. 判断每个文件的状态(js/coffee文件 or 目录)
//    2.1 如果是文件，则 require
//    2.2 如果是目录，继续读取该目录，重复1
var walk = function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);

			if(stat.isFile()){
				// .js or .coffee ，则导入
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath);
				}
			}
			else if(stat.isDirectory()){
				walk(newPath);
			}
		})
};
walk(models_path);		// 在其他控制器都可以调用 mongoose.model 获取 models 中的文件


var bodyParser = require('body-parser');					// 消息体解析中间件
app.use(bodyParser.urlencoded({ extended: true }));			// 把 form 表单数据解析成对象来调用
app.use(bodyParser.json());									// parse application / json

// 持久会话
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(cookieParser());
app.use(session({
  	secret: 'website',
  	resave: false,
  	saveUninitialized: true,
	store: new MongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

var env = process.env.NODE_ENV || 'development';
var morgan = require('morgan');								// 记录日志中间件
if('development' === env){
	app.set('showStackError',true);							// 打印错误
	app.use(morgan(':method :url :status'))					// 将请求信息打印在控制台，便于开发调试
	app.locals.pretty = true;								// 格式化的脚本
	mongoose.set('debug',true);								// mongoose 调试
}

require('./config/routes')(app);							// 调取路由文件

app.listen(port);											// 监听端口

console.log('website started on port' + port);


