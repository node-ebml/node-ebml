var gulp = require('gulp');
var jshint = require('gulp-jshint');
var fixmyjs = require('gulp-fixmyjs');
var stylish = require('jshint-stylish');
var esformatter = require('gulp-esformatter');
var os = require('os');

var paths = {
    'js': ['*.js', '**/*.js', '!node_modules/**/*.js']
};

gulp.task('default', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(esformatter({
            indent: {
                value: '    '
            }
        }))
        .pipe(gulp.dest('.'));
});

// Not a good idea...
// gulp.task('watch', function() {
//     gulp.watch(paths.js, ['default']);
// });
