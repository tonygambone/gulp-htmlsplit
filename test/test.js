'use strict';

var assert    = require('assert'),
    fs        = require('fs'),
    mocha     = require('mocha'),
    gulp      = require('gulp'),
    through   = require('through2'),
    strassert = require('stream-assert'),
    path      = require('path'),
    htmlsplit = require('../');

var testFile = function(name) {
  return 'test/inputs/' + name;
};

var expected = (function() {
  var out = {};
  ['content', 'header', 'footer', 'head', 'top'].forEach(function(name) {
    out[name] = fs.readFileSync('test/expected/' + name + '.html', 'utf8').trim();
  });
  out.nosplits = fs.readFileSync('test/inputs/nosplits.html', 'utf8');
  return out;
})();

var shouldBeTheFile = function(name) {
  return function(file) {
    assert.equal(file.path, path.resolve(testFile(name + '.html')));
    var output = file.contents.toString('utf8');
    assert.deepEqual(output, expected[name]);
  };
}

describe('gulp-htmlsplit', function() {

  it('should leave a file with no splits alone', function(done) {
    var input = testFile('nosplits.html');
    gulp.src(input)
      .pipe(strassert.length(1))
      .pipe(htmlsplit())
      .pipe(strassert.length(1))
      .pipe(strassert.nth(0, shouldBeTheFile('nosplits')))
      .pipe(strassert.end(done));
  });

  it('should split a file that starts with a split comment', function(done) {
    var input = testFile('splits.html');
    gulp.src(input)
      .pipe(strassert.length(1))
      .pipe(htmlsplit())
      .pipe(strassert.length(3))
      .pipe(strassert.nth(0, shouldBeTheFile('header')))
      .pipe(strassert.nth(1, shouldBeTheFile('content')))
      .pipe(strassert.nth(2, shouldBeTheFile('footer')))
      .pipe(strassert.end(done));
  });

  it('should discard the beginning of a file with no starting comment', function(done) {
    var input = testFile('nostartsplit.html');
    gulp.src(input)
      .pipe(strassert.length(1))
      .pipe(htmlsplit())
      .pipe(strassert.length(2))
      .pipe(strassert.nth(0, shouldBeTheFile('content')))
      .pipe(strassert.nth(1, shouldBeTheFile('footer')))
      .pipe(strassert.end(done));
  });

  it('should not output empty files', function(done) {
    var input = testFile('emptysplits.html');
    gulp.src(input)
      .pipe(strassert.length(1))
      .pipe(htmlsplit())
      .pipe(strassert.length(3))
      .pipe(strassert.nth(0, shouldBeTheFile('header')))
      .pipe(strassert.nth(1, shouldBeTheFile('content')))
      .pipe(strassert.nth(2, shouldBeTheFile('footer')))
      .pipe(strassert.end(done));
  });

  it('should handle stop split comments properly', function(done) {
    gulp.src(testFile('splitstop1.html'))
      .pipe(strassert.length(1))
      .pipe(htmlsplit())
      .pipe(strassert.length(2))
      .pipe(strassert.nth(0, shouldBeTheFile('head')))
      .pipe(strassert.nth(1, shouldBeTheFile('top')))
      .pipe(strassert.end(done));
  });

  it('should handle an alternate stop string', function(done) {
    gulp.src(testFile('splitstop2.html'))
      .pipe(strassert.length(1))
      .pipe(htmlsplit({ stop: 'foo' }))
      .pipe(strassert.length(2))
      .pipe(strassert.nth(0, shouldBeTheFile('head')))
      .pipe(strassert.nth(1, shouldBeTheFile('top')))
      .pipe(strassert.end(done));
  });

  it('should work on multiple files', function(done) {
    gulp.src('test/inputs/{emptysplits,nosplits,nostartsplit,splits}.html')
      .pipe(strassert.length(4))
      .pipe(htmlsplit())
      .pipe(strassert.length(9))
      // emptysplits
      .pipe(strassert.nth(0, shouldBeTheFile('header')))
      .pipe(strassert.nth(1, shouldBeTheFile('content')))
      .pipe(strassert.nth(2, shouldBeTheFile('footer')))
      // nosplits
      .pipe(strassert.nth(3, shouldBeTheFile('nosplits')))
      // nostartsplit
      .pipe(strassert.nth(4, shouldBeTheFile('content')))
      .pipe(strassert.nth(5, shouldBeTheFile('footer')))
      // splits
      .pipe(strassert.nth(6, shouldBeTheFile('header')))
      .pipe(strassert.nth(7, shouldBeTheFile('content')))
      .pipe(strassert.nth(8, shouldBeTheFile('footer')))
      .pipe(strassert.end(done));
  });

});
