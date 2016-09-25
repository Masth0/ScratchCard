var gulp = require('gulp');
var connect = require('gulp-connect');

/*---- Connect  -----------------------------------------------------------------------*/
gulp.task('connect', function() {
	connect.server({
		port : 8000,
		livereload : true
	});
});

/*---- Default -----------------------------------------------------------------------*/
gulp.task('default', ['connect']);