var gulp = require('gulp');
var jshint = require('gulp-jshint');
var fixmyjs = require('gulp-fixmyjs');
var stylish = require('jshint-stylish');
var esformatter = require('gulp-esformatter');

gulp.task('default', function() {
    return gulp.src(['*.js', '**/*.js', '!node_modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(esformatter({
        indent: {
            value: '    '
        }
    }))
    .pipe(gulp.dest('.'));
});
