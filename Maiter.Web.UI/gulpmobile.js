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
var watch = require('gulp-watch');

var WEBROOT = lib.WEBROOT;
var ReferenceFiles = lib.ReferenceFiles;
var rootFolder = lib.RootFolder;

gulp.task('compile-mobile-dev', function () {
    return lib.compile({
        main: 'src/Mobile/Main.ts',
        out: 'js/mobile-bundle-app.js'
    });
});

gulp.task('merge-mobile-dev', function () {
    //tansu: Şimdilik iptal ettim debuggin saçmaladı.
    return;
    var jsList = ReferenceFiles.js.concat(ReferenceFiles.mobile.js);
    jsList = jsList.map(function (item) {
        return mobileROOT + item;
    })

    jsList.push(mobileROOT + 'build/mobile-bundle-compiled.js');

    return lib.merge({
        fileList: jsList,
        file: '/mobile-bundle-app.js',
        dir: 'js'
    })
});


gulp.task('merge-mobile-dev-vendor', function () {
    var jsList = ReferenceFiles.vendor.js.concat(ReferenceFiles.mobile.vendor.js);
    jsList = jsList.map(function (item) {
        return WEBROOT + item;
    })
    //console.log(jsList);
    return lib.merge({
        fileList: jsList,
        file: '/mobile-bundle-vendor.js',
        dir: 'js'
    })
});

gulp.task('mergecss-mobile-dev', function () {

    var cssList = ReferenceFiles.vendor.css.concat(ReferenceFiles.mobile.vendor.css).concat(ReferenceFiles.css).concat(ReferenceFiles.mobile.css);
    cssList = cssList.map(function (item) {
        return WEBROOT + item;
    })
    return lib.merge({
        fileList: cssList,
        file: 'mobile-styles-bundle.css',
        dir: 'css'
    })
});

gulp.task('sass-dev', function () {
    var scss = gulp.src([rootFolder + '/scss/**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest(rootFolder + '/css'));
    return scss;
});


gulp.task('build-mobile-dev', [], function (cb) {
    run('merge-templates-mobile-dev', 'compile-mobile-dev', 'merge-mobile-dev-vendor', 'sass-dev', 'mergecss-mobile-dev', 'pot-mobile-dev', 'pot-mobile-dev-translate', function () {
        cb();
    })
});


gulp.task('pot-mobile-dev', function () {
    return lib.pot(['src/mobile/**/*.html', 'src/UI/**/*.html', 'src/Kalitte/**/*.html',  'js/mobile-bundle-app.js'], 'mobile.pot');
});

gulp.task('pot-mobile-dev-translate', function () {
    return lib.translations();
});

gulp.task('merge-templates-mobile-dev', function () {
    return lib.templates(['src/**/*.html'], 'build/mobile');
});


gulp.task('cordova-copy', function () {
    var fld = __dirname + '/' + rootFolder;
    var dest = __dirname + '/' + 'Cordova/' + rootFolder;
    var dest2 = __dirname + '/' + 'Cordova/platforms/browser/' + rootFolder;
    gulp.src(fld + '/**/*', { base: fld })
      .pipe(watch(fld, { base: fld, readDelay: 500 }))
      .pipe(gulp.dest(dest))
      .pipe(gulp.dest(dest2));
});


gulp.task('watch-mobile-dev', function () {

    gulp.watch(__dirname + '/' + rootFolder + '/src/**/*.ts', function () {
        console.log('TS File change detected. Working please wait ...');
        run('compile-mobile-dev', 'merge-mobile-dev', function () {
            console.log('TS File change tasks done.')
        });
    });

    gulp.watch(__dirname + '/' + rootFolder + '/scss/**/*.scss', function () {
        run('sass-dev', 'mergecss-mobile-dev');
    });

    gulp.watch(__dirname + '/' + rootFolder + '/src/**/*.html', function () {
        console.log('HTML File change detected. Working please wait ...');
        run('merge-templates-mobile-dev', 'pot-mobile-dev', 'pot-mobile-dev-translate', 'compile-mobile-dev', 'merge-mobile-dev', function () {
            console.log('HTML File change tasks done.')
        });
    });


    gulp.start('cordova-copy');
});


