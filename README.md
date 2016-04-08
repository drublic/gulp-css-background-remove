# gulp-css-background-remove [![Build Status](https://travis-ci.org/drublic/gulp-css-background-remove.svg?branch=master)](https://travis-ci.org/drublic/gulp-css-background-remove)


> Remove `background-image` from CSS file to load asynchron

## Install

```
$ npm install --save-dev gulp-css-background-remove
```


## Usage

```js
const gulp = require('gulp');
const cssBackgroundRemove = require('gulp-css-background-remove');

gulp.task('default', () =>
  gulp.src('src/app.css')
    .pipe(cssBackgroundRemove())
    .pipe(gulp.dest('dist'))
);
```

## API

### options

#### filename

Type: `filename`
Default: `image.css`

File name to write images to.

#### dest

Type: `dest`
Default: ``

Destination folder to write file to.

## License

MIT © [Hans Christian Reinl](https://drublic.de)
