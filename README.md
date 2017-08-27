# gulp-htmlsplit

[Gulp](http://gulpjs.com/) plugin to split HTML files into multiple output files using HTML comments.

![Travis CI](http://img.shields.io/travis/tonygambone/gulp-htmlsplit.svg)
&nbsp;
![npm version](http://img.shields.io/npm/v/gulp-htmlsplit.svg)

## Why?

I wrote this to take a static HTML page layout and split it into multiple files
for a WordPress site (header.php, index.php, and footer.php).

I also used [gulp-processhtml](https://github.com/Wildhoney/gulp-processhtml) to
perform other transformations of the layout, such as injecting PHP code and
changing asset paths. Highly recommended.

## Installation

`npm install gulp-htmlsplit --save-dev`

## Example Usage

### Gulpfile

```js
var htmlsplit = require('gulp-htmlsplit');

// ...

gulp.task('foo', function() {
  gulp.src('./*.html')
    .pipe(htmlsplit())
    .pipe(gulp.dest('build'));
})
```

### HTML file

By default plugin will look for lines in the HTML like this:

`<!-- split myFilename.ext -->`

This divider be customised by setting the `splitStr` option to a valid regex value,
where group 1 represents the desired filename. By default the following regex is used:

```js
var htmlsplit = require('gulp-htmlsplit');

gulp.task('foo', function() {
  gulp.src('./*.html')
    .pipe(htmlsplit(
      // Where (\S+) represents the group with the file name
      splitStr: /\s*<!--\s*split\s+(\S+)\s*-->\s*/g
    ))
    .pipe(gulp.dest('build'));
})
```

Everything following one of these dividers will be piped to a file named `myFilename.ext`,
until another `split` comment is encountered, or the file ends.

If the HTML file does not begin with a `split` comment, the contents will be discarded
until the first comment is encountered.  If no `split` comment is encountered,
the file will be left in the pipeline unchanged.

The resulting files can then be piped to other steps in the task or written out.

```html
<!-- split header.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <header>
      <h1>My header here</h1>
    </header>
<!-- split content.html -->
    <section>
      <p>My content here</p>
    </section>
<!-- split footer.html -->
    <footer>
      <div>My footer here</div>
    </footer>
  </body>
</html>
```

If the filename is the special string `stop`, all content will be discarded until
the next split comment is encountered.  For example, to extract just the `header`
and `footer` elements into separate files:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
<!-- split header.html -->
    <header>
      <h1>My header here</h1>
    </header>
<!-- split stop -->
    <section>
      <p>My content here</p>
    </section>
<!-- split footer.html -->
    <footer>
      <div>My footer here</div>
    </footer>
<!-- split stop -->
  </body>
</html>
```

An alternate `stop` string can be specified in the options:

```js
gulp.task('foo', function() {
  gulp.src('./*.html')
    .pipe(htmlsplit({ stop: 'end-here' }))
    .pipe(gulp.dest('build'));
})
```
