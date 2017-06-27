'use strict';

var fs = require('fs');
var path = require('path');
var foldero = require('foldero');
var nunjucks = require('gulp-nunjucks-html');
var yaml = require('js-yaml');
var gulpif = require('gulp-if');
var Promise = require('bluebird');
var _ = require("lodash");

module.exports = function (gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;
  var dest = path.join(taskTarget);
  var dataPath = path.join(dirs.source, dirs.data);

  // Nunjucks template compile
  gulp.task('nunjucks', ['lang'], function () {
    var siteData = {};
    if (fs.existsSync(dataPath)) {
      // Convert directory to JS Object
      siteData = foldero(dataPath, {
        recurse: true,
        whitelist: '(.*/)*.+\.(json|ya?ml)$',
        loader: function loadAsString(file) {
          var json = {};
          try {
            if (path.extname(file).match(/^.ya?ml$/)) {
              json = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
            }
            else {
              json = JSON.parse(fs.readFileSync(file, 'utf8'));
            }
          }
          catch (e) {
            console.log('Error Parsing DATA file: ' + file);
            console.log('==== Details Below ====');
            console.log(e);
          }
          return json;
        }
      });
    }

    // Add --debug option to your gulp task to view
    // what data is being loaded into your templates
    if (args.debug) {
      console.log('==== DEBUG: site.data being injected to templates ====');
      console.log(siteData);
      console.log('\n==== DEBUG: package.json config being injected to templates ====');
      console.log(config);
    }

    var generate = function (lang, langConfig, langDest) {
      return new Promise(function (resolve, reject) {
        gulp.src([
          path.join(dirs.source, '**/*.nunjucks'),
          '!' + path.join(dirs.source, '{**/\_*,**/\_*/**}')
        ])
          .pipe(plugins.changed(langDest))
          .pipe(plugins.plumber())
          .pipe(plugins.data({
            __locale__: lang,
            config: config,
            production: args.production ? true : false,
            debug: true,
            site: {
              data: siteData
            }
          }))
          .pipe(nunjucks({
            searchPaths: [path.join(dirs.source)],
            setUp: function (env) {
              env.addExtension('I18nExtension', new I18nExtension({
                // TODO : bug dans nunjucks-i18n, locale est pas repris dans this.ctx quand on est dans une macro 
                locale: lang,
                env: env,
                translations: langConfig
              }));
              return env;
            },
            ext: '.html'
          })
            .on('error', function (err) {
              plugins.util.log(err);
            }))
          .on('error', plugins.notify.onError(config.defaultNotification))
          .on('error', reject)
          .pipe(gulpif(args.production, plugins.htmlmin({
            collapseBooleanAttributes: true,
            conservativeCollapse: true,
            removeCommentsFromCDATA: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            collapseWhitespace: true
          })))
          .pipe(gulp.dest(langDest))
          //.pipe(browserSync.reload({stream: true, once: true}))
          .on('end', resolve);
      })
    };

    return Promise.all([
      generate('en', { en: JSON.parse(fs.readFileSync('.lang/en.json', 'utf8')) }, dest),
      generate('fr', { fr: JSON.parse(fs.readFileSync('.lang/fr.json', 'utf8')) }, dest + '/fr/')
    ]).then(function () {
      browserSync.reload();
    }).catch(function () {
      plugins.util.log(err);
    });

  });
};

function I18nExtension(options) {
  this.tags = ['i18n'];

  options = _.defaults(options || {}, {
    translations: {},
    locale: "__locale__"
  });

  var translate = function (defaultText, textId, kwargs) {
    kwargs = kwargs || {};

    var locale = options.locale;
    var text = (options.translations[locale] || {})[textId] || (options.translations[locale] || {})[defaultText] || defaultText;

    // Replace arguments
    _.each(kwargs, function (value, arg) {
      text = text.replace(arg, value);
    });

    return text;
  }

  this.parse = function (parser, nodes, lexer) {
    var tok = parser.nextToken();
    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);
    var body = parser.parseUntilBlocks('endi18n');
    parser.advanceAfterBlockEnd();
    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = function (context, textId, kwargs) {
    kwargs = kwargs || {};
    body = _.last(arguments);

    var text = translate.call(context, body(), textId, kwargs);
    return new nunjucks.runtime.SafeString(text);
  };

  // Add filter
  options.env.addFilter("i18n", translate);
};

