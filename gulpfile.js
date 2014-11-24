'use strict';

var gulp = require('gulp'),
    del = require('del');

// Plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var resultify = require('./tools/resultify');
var summarizer = require('./tools/summarizer');


// Styles
gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});





// Scripts
gulp.task('scripts', function () {
    return browserify('./app/scripts/main.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist/scripts'))
});



// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});


// Results
gulp.task('results', function() {
    return gulp.src('results/**/*.csv', {buffer: false})
        .pipe(resultify())
        .pipe(gulp.dest('dist/data'))
        .pipe($.size());
});


// Summarizer
gulp.task('summarize', function() {
    return gulp.src('dist/data/**/Results.json')
        .pipe(summarizer())
        .pipe(gulp.dest('dist/data'))
        .pipe($.size());
});


// Clean
gulp.task('clean', function (cb) {
    del(['dist/styles', 'dist/scripts', 'dist/images', 'dist/data'], cb);
});


// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower', 'results', 'summarize'], function(){
    var assets = $.useref.assets();

    return gulp.src('./app/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

// Deploy
gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe($.ghPages());
});

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['clean', 'build']);

// Webserver
gulp.task('serve', function () {
    gulp.src('dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000
        }));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*.js', {base: 'app/bower_components'})
        .pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
        .pipe(gulp.dest('dist/scripts/'));
});


// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);


    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);


    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
});
