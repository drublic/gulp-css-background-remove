/* eslint-env mocha */
'use strict';
var path = require('path');
var assert = require('assert');
var gutil = require('gulp-util');
var cssBackgroundRemove = require('./');

var generateFile = function (content) {
  return new gutil.File({
    cwd: __dirname,
    base: path.join(__dirname, 'fixture'),
    path: path.join(__dirname, 'fixture', 'fixture.css'),
    contents: new Buffer(content)
  });
};

it('should move background to separate CSS', function (cb) {
  var stream = cssBackgroundRemove({
    dest: 'dist/',
    filename: 'image.css'
  });

  stream.on('data', function (file) {
    assert(file.contents.toString(), 'a {\n\tcolor: #ddd;\n}\na {\n\tcolor: #fff;\n}');
    assert.equal(file.relative, 'fixture.css');
  });

  stream.on('end', cb);

  stream.write(generateFile('a {\n\tbackground: url("test.png"); background-image: url("test.png"); color: #ddd;\n}\na {\n\tcolor: #fff;\n}'));

  stream.end();
});

it('should not move un-url-like property to separate CSS', function (cb) {
  var stream = cssBackgroundRemove({
    dest: 'dist/',
    filename: 'image.css'
  });

  stream.on('data', function (file) {
    assert(file.contents.toString(), 'a {\n\tbackground: #ddd; color: #ddd;\n}\na {\n\tcolor: #fff;\n}');
  });

  stream.on('end', cb);
  stream.write(generateFile('a {\n\tbackground: #ddd; color: #ddd;\n}\na {\n\tcolor: #fff;\n}'));
  stream.end();
});
