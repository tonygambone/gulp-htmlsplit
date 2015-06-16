# gulp-htmlsplit

[Gulp](http://gulpjs.com/) plugin to split HTML files into multiple output files using HTML comments.

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

An alternate `stop` string can be specified in the options:

```js
gulp.task('foo', function() {
  gulp.src('./*.html')
    .pipe(htmlsplit({ stop: 'end-here' }))
    .pipe(gulp.dest('build'));
})
```
