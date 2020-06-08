const path = require('path');
const gulp = require('gulp');
const clean = require('@hopin/wbt-clean'); 
const tsBrowser = require('@hopin/wbt-ts-browser');
const tsNode = require('@hopin/wbt-ts-node');

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

gulp.task('clean', gulp.series(
  clean.gulpClean([dst]),
));

gulp.task('build-browser-lib', gulp.series(
  tsBrowser.gulpBuild('gauntface.dpad', {
    src: path.join(src, 'lib'),
    dst: path.join(dst, 'browser-lib'),
  })
));

gulp.task('build-browser-bootstrap', gulp.series(
  tsBrowser.gulpBuild('gauntface.dpad', {
    src: path.join(src, 'bootstrap'),
    dst: path.join(dst, 'cdn'),
    rootDir: src,
  })
));

gulp.task('build-node-lib', gulp.series(
  tsNode.gulpBuild({
    src: path.join(src, 'lib'),
    dst: path.join(dst, 'node-lib'),
  })
));

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel(
      'build-browser-lib',
      'build-browser-bootstrap',
      'build-node-lib',
    ),
  )
);