var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    path = require('path'),
    changed = require('gulp-changed'),
    w3cjs = require('gulp-w3cjs'),
    rename = require('gulp-rename'),
    through = require('through2'),
    gutil = require('gulp-util'),
    gulpFilter = require('gulp-filter'),
    expect = require('gulp-expect-file'),
    gulpsync = require('gulp-sync')(gulp),
    ngAnnotate = require('gulp-ng-annotate'),
    PluginError = gutil.PluginError;

// production mode (see build task)
var isProduction = false;
var useSourceMaps = false;

// JS APP
gulp.task('scripts:app', function () {

    var files = ['js/app.init.js',
        'js/modules/*.js',
        'js/modules/controllers/*.js',
        'js/modules/directives/*.js',
        'js/modules/services/*.js'
    ];

    return gulp.src(files)
        .pipe(gutil.noop())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .on("error", handleError)
        .pipe(isProduction ? uglify({
            preserveComments: 'some'
        }) : gutil.noop())
        .on("error", handleError)
        .pipe(gutil.noop())
        .pipe(gulp.dest('app/js'));
});


gulp.task('scripts:base', function () {

    return gulp.src(require('./base.js.json'))
        .pipe(uglify())
        .pipe(concat('base.js'))
        .pipe(gulp.dest('app/js'));
});

// copy file from bower folder into the app vendor folder
gulp.task('scripts:vendor:app', function () {

    var jsFilter = gulpFilter('**/*.js');

    return gulp.src(require('./app.js.json'), {
            base: 'bower_components'
        })
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(gulp.dest('app/js/app.js'));
});

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch('js/app.init.js', ['scripts:app']);
    gulp.watch('js/**/*.js', ['scripts:app']);
});

// build for production (minify)
gulp.task('build', ['prod', 'default']);
gulp.task('prod', function () {
    isProduction = true;
});

// default (no minify)
gulp.task('default', gulpsync.sync([
    'scripts:base',
    'scripts:vendor:app',
    'scripts:app',
    'start'
]), function () {

    gutil.log(gutil.colors.cyan('************'));
    gutil.log(gutil.colors.cyan('* All Done *'), 'You can start editing your code, LiveReload will update your browser after any change..');
    gutil.log(gutil.colors.cyan('************'));

});

gulp.task('start', [
    'watch'
]);

gulp.task('done', function () {
    console.log('All Done!! You can start editing your code, LiveReload will update your browser after any change..');
});

// Error handler
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}