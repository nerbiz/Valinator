var gulp = require('gulp');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

var sourceFiles = 'src/**/*.js';



gulp.task('js', function() {
    // Normal, unminified version
    gulp.src(sourceFiles)
        .pipe(plumber())
        .pipe(concat('zee-valinator.js'))
        .pipe(gulp.dest('dist'));

    // Minified version
    gulp.src(sourceFiles)
        .pipe(plumber())
        .pipe(concat('zee-valinator.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});



gulp.task('default', ['js'], function() {
    gulp.watch(sourceFiles, ['js']);
});
