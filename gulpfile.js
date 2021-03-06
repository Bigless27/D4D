var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pkg = require('./package.json');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon')

// Set the banner content
// var banner = ['/*!\n',
//     ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
//     ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
//     ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
//     ' */\n',
//     ''
// ].join('');

// Compile LESS files from /less into /css

var onError = function(err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
}



gulp.task('nodemon', function(cb){

  var started = false;

  return nodemon({
    script: 'index.js',
  })
  .on('start', function() {
    if(!started){
        cb();
        started = true
        browserSync.reload
    }
  })
  // .on('exit', function() {
  //   console.log('exiting')
  //   process.exit()
  // })
})

gulp.task('sass', function() {
    return gulp.src('./public/sass/*.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(gulp.dest('./build/css'))
         .pipe(browserSync.reload({
            stream: true
        }))
})

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('public/css/creative.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('scripts', function() {
    return gulp.src('app/**/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('appAll.js'))
        .pipe(gulp.dest('./build/js'))
})


// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('public/js/creative.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(uglify())
        // .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))

    gulp.src(['node_modules/bootstrap-validator/dist/validator.min.js'])
        .pipe(gulp.dest('vendor/bootstrap-validator'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))

    gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('vendor/magnific-popup'))

    gulp.src(['node_modules/angular/angular.min.js'])
        .pipe(gulp.dest('vendor/angular'))

    gulp.src(['node_modules/angular-ui-router/release/angular-ui-router.min.js'])
        .pipe(gulp.dest('vendor/angular-ui-router'))

    gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('vendor/scrollreveal'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
})

// Run everything
gulp.task('default', ['sass', 'minify-css', 'scripts', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', ['nodemon'], function() {
    browserSync.init(null,{
        proxy: 'localhost:3000',
        port: 8000
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'scripts', 'minify-css', 'minify-js'], function() {
    gulp.watch('public/sass/*.scss', ['sass'])
    gulp.watch('public/css/*.css', ['minify-css']);
    gulp.watch('app/**/*.js', ['scripts', browserSync.reload])
    gulp.watch('public/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML, Css or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('app/**/*.html', browserSync.reload)
    gulp.watch('css/**/*.css', browserSync.reload)
    gulp.watch('js/**/*.js', browserSync.reload);
});
