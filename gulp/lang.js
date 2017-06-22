'use strict';

var path = require('path');
var fs = require('fs');
var marked = require('marked');

module.exports = function (gulp, plugins, args, config, taskTarget, browserSync) {

  gulp.task('lang', function () {
    return gulp.src('lang/*.json')
      .pipe(plugins.transform(function (contents, file) {
        var lang = path.parse(file.path).name;
        var files = fs.readdirSync('lang/'+lang);
        var pjson = JSON.parse(contents.toString());
        // add content of *.md in [lang].json as [filename]: content
        for (var i in files) {
          var pf = path.parse(files[i]);
          if (pf.ext == '.md') {
            pjson[pf.name] = marked(fs.readFileSync('lang/'+lang+'/'+files[i]).toString());
          }
        }
        return JSON.stringify(pjson);
      }))
      .pipe(gulp.dest('.lang'));
  });

};
