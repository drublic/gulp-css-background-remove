'use strict';

var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');
var css = require('css');
var fs = require('fs');

module.exports = function (opts) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-css-background-remove', 'Streaming not supported'));
      return;
    }

    var cssObject = css.parse(file.contents.toString());
    var backgroundProperties = [
      'background',
      'background-image'
    ];
    var stylesheets = {
      images: {
        type: 'stylesheet',
        stylesheet: {
          rules: [],
          parsingErrors: []
        }
      },
      rules: {
        type: 'stylesheet',
        stylesheet: {
          rules: [],
          parsingErrors: []
        }
      }
    };

    if (!cssObject.stylesheet || !cssObject.stylesheet.rules) {
      cb(new gutil.PluginError('gulp-css-background-remove', 'Empty or broken stylesheet'));
      return;
    }

    cssObject.stylesheet.rules.forEach(function (element) {
      var declaration;
      // Copy element
      var rule = JSON.parse(JSON.stringify(element));
      // Check if it has image content
      var hasImage = false;

      for (declaration in element.declarations) {
        if (backgroundProperties.indexOf(element.declarations[declaration].property) > -1) {
          if (element.declarations[declaration].value.match(/.*url\((.*)\).*/) !== null) {
            hasImage = true;
            rule.declarations = [ element.declarations[declaration] ];
            element.declarations.splice(declaration, 1);
          }
        }
      }

      if (hasImage) {
        stylesheets.images.stylesheet.rules.push(rule);
      }

      stylesheets.rules.stylesheet.rules.push(element);
    });

    stylesheets.rules = css.stringify(stylesheets.rules);
    stylesheets.images = css.stringify(stylesheets.images);

    // Write images file
    fs.writeFileSync(
      path.join(__dirname, (opts.dest || ''), (opts.filename || 'image.css')),
      stylesheets.images
    );

    // Return rules file
    file.contents = new Buffer(stylesheets.rules);

    setImmediate(cb, null, file);
  });
};
