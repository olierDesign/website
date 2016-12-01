module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			jade: {
				files: ['app/views/**'],
				options: {
					livereload: true
				}
			},

			js: {
				files: ['public/js/**', 'app/models/**/*.js', 'app/schemas/**/*.js'],
				// tasks: ['jshint'],    jshint -> 语法检查
				options: {
					livereload: true
				}
			},

			uglify: {
		        files: ['public/**/*.js'],
		        tasks: ['jshint'],
		        options: {
		          livereload: true
		        }
		      },		

			styles: {
				files: ['public/**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}

		},

		// js 语法检查依赖的文件就是 .jshintrc
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},

		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'public/build/index.css': 'public/less/index.less'
				}
			}
		},

		uglify: {
			development: {
				files: {
					// 压缩一个文件
					'public/build/admin.min.js': 'public/js/admin.js',
					// 把多个文件压缩成一个文件
					'public/build/detail.min.js': [
						'public/js/detail.js'
					]
				}
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['./'],
					watchedFolders: ['app', 'config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},

		concurrent: {
			tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	grunt.option('force', true);					// 防止语法错误和警告，中断整个服务

	grunt.loadNpmTasks('grunt-contrib-watch');		// 文件增删改，自动重启
	grunt.loadNpmTasks('grunt-nodemon');			// 实时监听入口文件，自动重启
	grunt.loadNpmTasks('grunt-concurrent');			// 优化慢任务构建的时间，跑多个阻塞的任务，如 watch 和 nodemon
	
	grunt.loadNpmTasks('grunt-mocha-test');			// 测试用例中间件

	grunt.loadNpmTasks('grunt-contrib-less');		
	grunt.loadNpmTasks('grunt-contrib-uglify');		// js 压缩
	grunt.loadNpmTasks('grunt-contrib-jshint');		// js 语法检测

	grunt.registerTask('default', ['concurrent']);	// cmd: grunt
	grunt.registerTask('test', ['mochaTest']);		// cmd: grunt test
};