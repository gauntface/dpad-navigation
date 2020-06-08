const path = require('path');
const gulp = require('gulp');
const clean = require('@hopin/wbt-clean'); 
const {setConfig} = require('@hopin/wbt-config');
const tsBrowser = require('@hopin/wbt-ts-browser'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

gulp.task('clean', gulp.series(
  clean.gulpClean([dst]),
));

gulp.task('build-lib', gulp.series(
  tsBrowser.gulpBuild('gauntface.dpad', {
    src: path.join(src, 'lib'),
    dst: path.join(dst, 'lib'),
  })
))

gulp.task('build-bootstrap', gulp.series(
  tsBrowser.gulpBuild('gauntface.dpad', {
    src: path.join(src, 'bootstrap'),
    dst: path.join(dst, 'bootstrap'),
    rootDir: src,
  })
))

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel(
      'build-lib',
      'build-bootstrap',
    ),
  )
);