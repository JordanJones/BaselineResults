'use strict';

var gulp = require('gulp'),
    del = require('del'),
    path = require('path');

// Plugins
var $ = require('gulp-load-plugins')({lazy: false});
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var resultify = require('./tools/resultify');
var summarizer = require('./tools/summarizer');

var deployCacheDir = path.resolve(path.join(__dirname, '..', 'BaselineResults_GhPages'));

var buildOptions = {
    dev: true,
    watch: false
};

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
    var params = {
        debug: buildOptions.dev === true,
        cache: {},
        packageCache: {},
        fullPaths: true
    };

    var bundler = browserify('./app/scripts/AppMain.js', params);
    (buildOptions.dev === true ? ['react', 'react/addons'] : []).forEach(function (o) { bundler.external(o)});

    function rebundle () {
        return bundler.bundle()
            .pipe(source('AppMain.js'))
            .pipe($.if(buildOptions.dev !== true, $.streamify($.uglify())))
            .pipe(gulp.dest('dist/scripts'));
    }

    if (buildOptions.watch === true) {
        bundler = watchify(bundler, watchify.args);
        bundler.on('update', rebundle);
    }
    return rebundle();
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
        .pipe(summarizer())
        .pipe(gulp.dest('dist/data'))
        .pipe($.size());
});


// Clean
gulp.task('clean', function (cb) {
    del(
        [
            'dist/images',
            'dist/index.html',
            'dist/bower_components',
            'dist/styles',
            'dist/scripts',
            'dist/data'
        ],
        cb
    );
});

// Build Mode
gulp.task('watchmode', function () {
    buildOptions.watch = true;
});
gulp.task('prodmode', function () {
    buildOptions.dev = false;
});


// Bundle
gulp.task('bundle', ['styles', 'scripts', 'results'], function(){
    var assets = $.useref.assets();

    return gulp.src('./app/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

// Deploy
gulp.task('deploy', ['clean', 'prodmode', 'html', 'bundle', 'images'], function() {
    return gulp.src('./dist/**/*')
        .pipe($.ghPages({cacheDir: deployCacheDir}));
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

gulp.task('json', function() {
    gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
        .pipe(gulp.dest('dist/scripts/'));
});


// Watch
gulp.task('watch', ['watchmode', 'html', 'bundle', 'serve'], function () {

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);


    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    // Watch tool files
    gulp.watch('tools/summarizer/index.js', ['results']);

    // Don't watch JS files as this happens automatically
});
