'use strict';
var path = require('path');

var buildOptions = {
    dev: true
};
var deployCacheDir = path.resolve(path.join(__dirname, '..', 'BaselineResults_GhPages'));

// Requirements
var gulp = require('gulp'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    resultify = require('./tools/resultify'),
    summarizer = require('./tools/summarizer');

// Plugins
var $ = require('gulp-load-plugins')({lazy: false});

// External Tasks
var VendorLibs = require('./tasks/vendor')(buildOptions);

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
        bundleExternal: false,
        insertGlobals: false,
        cache: {},
        packageCache: {},
        fullPaths: true
    };

    var b = browserify('./app/scripts/AppMain.js', params);
    VendorLibs.forEach(function (o) {
        b.external(o.name);
    });

    return b
        .bundle()
        .pipe(source('AppMain.js'))
        .pipe($.if(buildOptions.dev === true, buffer()))
        .pipe($.if(buildOptions.dev === true, $.sourcemaps.init({loadMaps: true})))
        .pipe($.if(buildOptions.dev !== true, $.streamify($.uglify())))
        .pipe($.if(buildOptions.dev === true, $.sourcemaps.write('./')))
        .pipe(gulp.dest('dist/scripts'));
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
gulp.task('resultify', function() {
    return gulp.src('results/**/*.csv', {buffer: false})
        .pipe(resultify())
        .pipe(gulp.dest('dist/data'))
        .pipe($.size());
});
gulp.task('results', ['resultify'], function () {
    return gulp.src('dist/data/**/*.json')
        .pipe(summarizer())
        .pipe(gulp.dest('dist/data'))
        .pipe($.size());
});

// Build Mode
gulp.task('prodmode', function (cb) {
    buildOptions.dev = false;
    cb();
});


// Fonts
gulp.task('fonts', function () {
    return gulp.src('app/bower_components/bootstrap-sass-official/assets/fonts/**/*', {base: 'app/bower_components/bootstrap-sass-official/assets/fonts'})
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});


// Bundle
gulp.task('bundle', ['styles', 'vendor', 'scripts', 'results', 'images', 'fonts'], function(){
    var assets = $.useref.assets();

    return gulp.src('./app/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});


// Clean
gulp.task('clean', function (cb) {
    del.sync('dist', {force: true});
    cb();
});

// Build
gulp.task('build', ['html', 'bundle']);

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

// Deploy
gulp.task('deploy', ['prodmode', 'default'], function() {
    gulp.src('./dist/**/*')
        .pipe($.ghPages({cacheDir: deployCacheDir}));
});

// Webserver
gulp.task('serve', function () {
    gulp.src('dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000
        }));
});


// Watch
gulp.task('watch', ['build', 'serve'], function () {
    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    // Watch tool files
    gulp.watch('tools/summarizer/index.js', ['results']);
});
