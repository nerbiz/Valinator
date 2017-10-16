var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');



gulp.task('js', function() {
    gulp.src('dist/Valinator.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});



gulp.task('default', ['js'], function() {
    gulp.watch('dist/Valinator.js', ['js']);
});