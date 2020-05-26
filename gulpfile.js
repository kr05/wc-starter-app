const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const workboxBuild = require('workbox-build');

gulp.task('prpl-server:replace-env', () => {
  return gulp.src(['index.html'])
    .pipe(replace('NODE_ENVIRONMENT', 'production'))
    .pipe(gulp.dest('build'));
});

gulp.task('prpl-server:service-worker', () => {
  const swSrc = 'service-worker.js';
  const swDest = 'build/service-worker.js';

  return workboxBuild.injectManifest({
    swSrc,
    swDest,
    // Other configuration options...
    globDirectory: 'build',
    globPatterns: [
      '**/*.{html,js,css,ico,png,json}',
    ]
  }).then(({count, size}) => {
    console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
  });
});

gulp.task('prpl-server', gulp.series(
  'prpl-server:copy-files',
  'prpl-server:replace-env',
  'prpl-server:clean',
  'prpl-server:service-worker',
  'prpl-server:build'
));