const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify')
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('es6', () => {
	browserify('client/js/src/app.js')
		.transform('babelify', {
			presets: ['react','es2015']
		})
		.bundle()	
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('client/js/build/'));
});

gulp.task('default', ['es6'],() => {
	gulp.watch('client/js/src/**/*.js',['es6'])
});

