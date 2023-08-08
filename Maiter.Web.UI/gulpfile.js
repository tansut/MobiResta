/// <binding ProjectOpened='web-dev, mobile-dev' />
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var run = require('run-sequence');
var fs = require('fs');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var lib = require('./gulplib');
var web = require('./gulpweb');
var mobile = require('./gulpmobile');


gulp.task('web-dev', ['build-web-dev'], function (cb) {
    run('watch-web-dev', function () {
        cb();
    });
});

gulp.task('mobile-dev', ['build-mobile-dev'], function (cb) {
    run('watch-mobile-dev', function () {
        cb();
    });
});