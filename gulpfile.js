'use strict';

var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')();
var noop = function(){};
var paths = {
  lint: ['./gulpfile.js'],
  watch: ['./gulpfile.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./lib/*.js'],
  dest: ['./build']
};

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('build', function(cb) {
  gulp.src(paths.source)
    // .pipe(plugins.sourcemaps.init())
    // .pipe(plugins.sweetjs({
    //   modules: ['lambda-jam/macro']
    // }))
    // .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .on('end', cb)
    .on('error', noop);
});

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .on('error', noop);
});

gulp.task('istanbul', ['build'], function (cb) {
  gulp.src(paths.source)
    .pipe(plugins.istanbul()) // Covering files
    .on('finish', function () {
      gulp.src(paths.tests)
        .pipe(plugins.plumber(plumberConf))
        .pipe(plugins.mocha())
        .pipe(plugins.istanbul.writeReports()) // Creating the reports after tests runned
        .on('finish', function() {
          process.chdir(__dirname);
          cb();
        })
        .on('error',noop);
    });
});

gulp.task('bump', ['build', 'test'], function () {
  var bumpType = plugins.util.env.type || 'patch'; // major.minor.patch

  return gulp.src(['./package.json'])
    .pipe(plugins.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['build', 'test'], function () {
  gulp.watch(paths.watch, ['build', 'test']);
});

gulp.task('test', ['build', 'istanbul']);

gulp.task('release', ['bump']);

gulp.task('default', ['lint', 'watch']);
