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

The plugin will look for comments of the form:

`<!-- split filename.ext -->`

Everything following one of these comments will be piped to a file named `filename.ext`,
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

### Options

**stop** -  An alternate string can be specified:

```js
gulp.task('foo', function() {
  gulp.src('./*.html')
    .pipe(htmlsplit({ stop: 'end-here' }))
    .pipe(gulp.dest('build'));
})
```

**notExistsOnPath** - Pass a custom path to create splitted file only if not exists

```js
gulp.task('foo', function() {
  gulp.src('./*.html')
    .pipe(htmlsplit({ notExistsOnPath: 'path/to/destiny' }))
    .pipe(gulp.dest('build'));
})
```

**replace** - Replace the html split name to another

> **INFO:** This option is great to change the origin split name (from another repository/package, for example)

```html
<!-- HTML EXAMPLE -->

<!-- split origin/origin.html -->
<div class="test"> This is a HTML with split name </div>
<!-- split stop -->
```

```js
gulp.task('foo', function() {
  gulp.src('./*.html')
    .pipe(htmlsplit({ 
      replace: {
        'origin': 'newSplitName' //Replace the "origin.html" to "newSplitName" 
      }
    }))
    .pipe(gulp.dest('build'));
})
```
