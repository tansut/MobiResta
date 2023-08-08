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
var gettext = require('gulp-angular-gettext');
var templateCache = require('gulp-angular-templatecache');

exports.RootFolder = "www";
exports.WEBROOT = __dirname + '/' + exports.RootFolder + '/';


exports.ReferenceFiles = {
    css: [],
    js: [],

    vendor: {
        css: ['bower_components/angular-block-ui/dist/angular-block-ui.min.css'
              
        ],
        js: ['bower_components/angular/angular.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-local-storage/dist/angular-local-storage.js',            
            'bower_components/angular-block-ui/dist/angular-block-ui.js',
            'bower_components/sprintf/dist/sprintf.min.js',
            'bower_components/lodash/lodash.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-gettext/dist/angular-gettext.js',
            'bower_components/angular-touch/angular-touch.js',
            'Scripts/Reflect.js'          
        ]
    },

    web: {
        vendor: {
            css: ['bower_components/angular-material/angular-material.css',
               'bower_components/textAngular/dist/textAngular.css',
               'bower_components/bootstrap-css-only/css/bootstrap.min.css',
               'bower_components/font-awesome/css/font-awesome.min.css',
                'bower_components/angular-loading-bar/build/loading-bar.css',
              'bower_components/angular-carousel/dist/angular-carousel.css'],
            js: ['bower_components/angular-material/angular-material.js',
                'bower_components/angular-loading-bar/build/loading-bar.js',
                'bower_components/ngmap/build/scripts/ng-map.js',
            'bower_components/ng-file-upload/ng-file-upload-all.js',
            'bower_components/angular-carousel/dist/angular-carousel.js',
            'bower_components/textAngular/dist/textAngular-rangy.min.js',
            'bower_components/textAngular/dist/textAngular-sanitize.min.js',
            'bower_components/textAngular/dist/textAngular.min.js',
            'build/web-tr.js']
        },
        css: ['css/web.css', 'css/web-common.css', 'css3-mixins.css'],
        js: ['build/web/templates.js']
    },

    mobile: {
        vendor: {
            css: ['bower_components/angularjs-toaster/toaster.min.css'],
            js: ['bower_components/ngCordova/dist/ng-cordova.js',
                 'bower_components/angularjs-toaster/toaster.min.js',
                 'bower_components/ionic/release/js/ionic.js',
                 'bower_components/ionic/release/js/ionic-angular.js',
                 'bower_components/angular-sanitize/angular-sanitize.js',            
            'Scripts/jquery-1.6.4.js',
            'Scripts/jquery.signalR-2.2.0.js',  
                 'build/mobile-tr.js']
        },
        css: ['css/mobile.css', 'css3-mixins.css'],
        js: ['build/mobile/templates.js']
    }
}


exports.templates = function (files, dest) {
    var allFiles = files.map(function (file) {
        return exports.WEBROOT + file;
    });

    return gulp.src(allFiles)
        .pipe(templateCache({
            standalone: true, transformUrl: function (url) {
                return 'src/' + url;
            }
        }))
        .pipe(gulp.dest(exports.WEBROOT + dest));
};


exports.pot = function (files, potName) {
    var allFiles = files.map(function (file) {
        if (file[0] == '!') {
            return '!' + exports.WEBROOT + file.slice(1, file.length - 1);
        }
        else return exports.WEBROOT + file;
    });
    //console.log(allFiles);

    return gulp.src(allFiles)
        .pipe(gettext.extract(potName, {
            // options to pass to angular-gettext-tools... 
        }))
        .pipe(gulp.dest(exports.WEBROOT + 'config/'));
};

exports.translations = function () {
    return gulp.src(exports.WEBROOT + 'config/**/*.po')
        .pipe(gettext.compile({
            // options to pass to angular-gettext-tools... 
            format: 'javascript'
        }))
        .pipe(gulp.dest(exports.WEBROOT + 'build/'));
};


exports.compile = function (op) {
    var browserify = require('browserify'),
    bundler = new browserify({ debug: op.debug || true, transform: [] });
    bundler.add(exports.WEBROOT + op.main);
    bundler.plugin('tsify', {
        target: 'ES5',
        module: 'commonjs',
        typescript: require('typescript')
    });
    return bundler.bundle(function (err, src, map) {
        if (err) console.log(err.message);
        fs.writeFileSync(exports.WEBROOT + op.out, src);
        fs.writeFileSync(exports.WEBROOT + op.out + '.map', map);
    });
}

exports.merge = function (op) {
    return gulp.src(op.fileList)
        .pipe(concat(op.file))
        .pipe(gulp.dest(exports.WEBROOT + op.dir));
}