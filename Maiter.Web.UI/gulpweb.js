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

var WEBROOT = lib.WEBROOT;
var ReferenceFiles = lib.ReferenceFiles;
var rootFolder = lib.RootFolder;

gulp.task('compile-web-dev', function () {
    return lib.compile({
        main: 'src/web/Main.ts',
        out: 'js/web-bundle-app.js'
    });
});

gulp.task('merge-web-dev', function () {
    return null;
    var jsList = ReferenceFiles.js.concat(ReferenceFiles.web.js);
    jsList = jsList.map(function (item) {
        return WEBROOT + item;
    })

    jsList.push(WEBROOT+ 'build/web-bundle-compiled.js');

    return lib.merge({
        fileList: jsList,
        file: '/web-bundle-app.js',
        dir: 'js'
    })
});

gulp.task('merge-web-dev-vendor', function () {
    var jsList = ReferenceFiles.vendor.js.concat(ReferenceFiles.web.vendor.js);
    jsList = jsList.map(function (item) {
        return WEBROOT + item;
    })

    return lib.merge({
        fileList: jsList,
        file: '/web-bundle-vendor.js',
        dir: 'js'
    })
});

gulp.task('mergecss-web-dev', function () {

    var cssList = ReferenceFiles.vendor.css.concat(ReferenceFiles.web.vendor.css).concat(ReferenceFiles.css).concat(ReferenceFiles.web.css);
    cssList = cssList.map(function (item) {
        return WEBROOT + item;
    })
    return lib.merge({
        fileList: cssList,
        file: 'web-styles-bundle.css',
        dir: 'css'
    })
});

gulp.task('sass-dev', function () {
    var scss = gulp.src([rootFolder + '/scss/**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest(rootFolder + '/css'));
    return scss;
});

gulp.task('pot-web-dev', function () {
    return lib.pot(['src/web/**/*.html', 'src/UI/**/*.html', 'src/Kalitte/**/*.html', 'js/web-bundle-app.js'], 'web.pot');
});

gulp.task('pot-web-dev-translate', function () {
    return lib.translations();
});

gulp.task('merge-templates-web-dev', function () {
    return lib.templates(['src/**/*.html'], 'build/web');
});



gulp.task('build-web-dev', [], function (cb) {
    run('merge-templates-web-dev', 'compile-web-dev', 'merge-web-dev', 'merge-web-dev-vendor', 'sass-dev', 'mergecss-web-dev', 'pot-web-dev', 'pot-web-dev-translate',  function () {
        cb();
    })
});

gulp.task('watch-web-dev', function () {
    gulp.watch(__dirname + '/' + rootFolder + '/src/**/*.ts', function () {
        console.log('TS File change detected. Working please wait ...');
        run('compile-web-dev', 'merge-web-dev', function () {
            console.log('TS File change tasks done.')
        });
    });
    gulp.watch(__dirname + '/' + rootFolder + '/scss/**/*.scss', function () {
        run('sass-dev', 'mergecss-web-dev');
    });
    gulp.watch(__dirname + '/' + rootFolder + '/src/**/*.html', function () {
        console.log('HTML File change detected. Working please wait ...');
        run('merge-templates-web-dev', 'pot-web-dev', 'pot-web-dev-translate', 'compile-web-dev', 'merge-web-dev', function () {
            console.log('HTML File change tasks done.')
        });
    });
});


