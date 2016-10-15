var gulp = require('gulp');
var connect = require('gulp-connect');
var minify = require('gulp-minify');

/*---- Connect  -----------------------------------------------------------------------*/
gulp.task('connect', function() {
	connect.server({
		port : 8000,
		livereload : true
	});
});

gulp.task('minify', function() {
	gulp.src('js/Scratch.js')
		.pipe(minify({
			ext:{
				min: '.min.js'
			},
			preserveComments: 'some',
		}))
		.pipe(gulp.dest('dist'));
});

/*---- Default -----------------------------------------------------------------------*/
gulp.task('default', ['connect']);