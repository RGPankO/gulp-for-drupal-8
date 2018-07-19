'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel = require("gulp-babel");
const bulkSass = require('gulp-sass-bulk-import');
const uglify = require('gulp-uglify');

const paths = {
  srcSCSS: ['./src/scss/**/*.scss', './templates/**/*.scss'],
  srcScripts: './src/scripts/**/*.js',
  bootstrapSCSS: './bootstrap_overrides/**/*.scss',
  distCSS: './css/',
  distJS: './scripts/',
  srcFonts: ['./src/fonts/**/*.*'],
  distFonts: './fonts/'
};

const settings = {
  autoprefixer: {
    browsers: ['last 2 versions'],
    cascade: false
  }
}

/*
// Compiling SASS
*/
gulp.task('sass', function () {
  return gulp.src(paths.srcSCSS)
    .pipe(bulkSass())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./templates', './src/scss']
    }).on('error', sass.logError))
    .pipe(autoprefixer(settings.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('prod:sass', function () {
  return gulp.src(paths.srcSCSS)
    .pipe(bulkSass())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./templates', './src/scss']
    }).on('error', sass.logError))
    .pipe(autoprefixer(settings.autoprefixer))
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('sass:watch', ['sass'], function () {
  gulp.watch(paths.srcSCSS, ['sass']);
});

/*
// Compiling Javascript
*/
gulp.task('scripts', function () {
  return gulp.src(paths.srcScripts)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.distJS));
});

gulp.task('prod:scripts', function () {
  return gulp.src(paths.srcScripts)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJS));
});

gulp.task('scripts:watch', ['scripts'], function () {
  gulp.watch(paths.srcScripts, ['scripts']);
});

gulp.task('watch', ['init'], function () {
  gulp.start('sass:watch');
  gulp.start('scripts:watch');
});

/*
// Compiling SASS and JS for prod
*/
gulp.task('build', function () {
  gulp.start('prod:bootstrapSCSS');
  gulp.start('prod:scripts');
  gulp.start('prod:sass');
  gulp.start('fonts');
});

gulp.task('default', function () {
  gulp.start('watch');
});

/*
// Compiling Bootstrap SASS
*/
gulp.task('bootstrapSCSS', ['copyBootstrap'], function () {
  return gulp.src(paths.bootstrapSCSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('prod:bootstrapSCSS', ['copyBootstrap'], function () {
  return gulp.src(paths.bootstrapSCSS)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer(settings.autoprefixer))
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('copyBootstrap', function () {
  return gulp.src(['./node_modules/bootstrap-sass/assets/**/*']).pipe(gulp.dest('./bootstrap/assets'));
});

gulp.task('fonts', function () {
  return gulp.src(paths.srcFonts).pipe(gulp.dest(paths.distFonts));
});

gulp.task('init', ['bootstrapSCSS', 'fonts'], function () {
  return Promise.resolve();
});
