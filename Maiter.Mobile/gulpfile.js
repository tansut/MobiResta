/// <binding ProjectOpened='default' />
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

gulp.task('browserify', function () {

  var b = browserify({
    entries: __dirname + '/www/link/App.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))        
        //.pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(__dirname + '/www/js/'));
});


gulp.task('browser-sync', function () {
    return browserSync({
        server: {
            baseDir: __dirname + '/www'
        },
        ghostMode: false,
        notify: false,
        debounce: 200,
        port: 9001,
        startPath: '/'
    });
});

gulp.task('clean', function () {
  return gulp.src('link/*')
    .pipe(vinylPaths(del));
});


gulp.task('sass-dev', function () {
    return gulp.src(['www/scss/app.scss'])
        .pipe(sass())
        .pipe(gulp.dest('www/css'));
});

gulp.task('typescript', function () {
    var tsResult = gulp.src(__dirname + '/www/src/**/*.ts')
        .pipe(ts({
        target: 'ES5',
        outDir: 'link',
        module: 'commonjs',
		removeComments: true,
        typescript: require('typescript')
    }));


    return tsResult.js.pipe(gulp.dest(__dirname + '/www/link'));
});

gulp.task('build', ['clean'], function (cb) {    
	run('typescript', 'browserify', ['sass-dev'], function() {
		cb();
	})
});

gulp.task('build-reload', ['build'], function (cb) {   	
	browserSync.reload();
	cb();
});

gulp.task('run', ['clean'], function (cb) {    
	run('typescript', 'browserify', 'sass-dev', ['browser-sync'], function() {
		cb();
	})
});

gulp.task('watch', function () {    
    gulp.watch(__dirname + '/www/src/**/*.ts', ['build']);	
	gulp.watch(__dirname + '/www/scss/**/*.scss', ['build']);

    //gulp.watch([__dirname + '/www/**/*.{html}', '!' + __dirname + '/www/bower_components/**', '!' + __dirname + '/www/link/**'], {
    //    debounceDelay: 400
    //}, browserSync.reload.bind(browserSync));
});

gulp.task('default', ['build'], function(cb) {
	run('watch', function() {
		cb();
	});
});
