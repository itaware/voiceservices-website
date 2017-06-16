'use strict';

var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

module.exports = function(gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;
  var entries = config.entries;

  var fontName = 'iconfont';

  gulp.task('iconfont', function() {
    gulp.src(['assets/SVG/*.svg'])
      .pipe(iconfontCss({
        fontName: fontName,
        path: 'assets/template-iconfont.css',
        targetPath: '../../'+dirs.styles+'/iconfont.scss',
        fontPath: '../fonts/iconfont/'
      }))
      .pipe(iconfont({
        formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
        fontName: fontName
      }))
      .pipe(gulp.dest(dirs.source+'/fonts/iconfont'));
  });

};
