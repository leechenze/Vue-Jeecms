var path = require('path')
var gulp = require('gulp')
var cleanCSS = require('gulp-clean-css')
var cssWrap = require('gulp-css-wrap')

var customThemeName = 'blue' // 修改此行，对应生成theme下的目录
var themePrefix = '.custom-'

gulp.task('css-wrap', function () {
  return gulp.src(path.resolve('./theme/index.css'))
    .pipe(cssWrap({ selector: themePrefix + customThemeName }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('src/assets/theme/' + customThemeName))
})

gulp.task('move-font', function () {
  return gulp.src(['./theme/fonts/**']).pipe(gulp.dest(`src/assets/theme/${customThemeName}/fonts`))
})

// gulp.task('default', ['css-wrap', 'move-font'])
