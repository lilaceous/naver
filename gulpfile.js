'use strict';
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const html = require('gulp-html-tag-include');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  port: '9006',
  input: './src/**/*',
  output: './dist/',
  html: {
    input: './src/html/**/*.html',
    output: './dist/html/'
  },
  style: {
    input: './src/scss/*.scss',
    output: './dist/css'
  },
  img: {
    input: './src/img/**/*',
    output: './dist/img'
  },
  font: {
    input: './src/font/**/*',
    output: './dist/font'
  },
  js: {
    input: './src/js/*.js',
    output: './dist/js/'
  }
};

function browserSync(done) {
  console.log("start sync...");
  browsersync.init({
    port: paths.port,
    server: {
      baseDir: paths.output
    },
    startPath: './html/index.html' //index.html 일반 프로젝트에서는 index.html 로 변경
  });
  done();
}

function htmlComp() {
  return gulp.src(paths.html.input)
    .pipe(html())
    .pipe(gulp.dest(paths.html.output))
    .pipe(browsersync.reload({stream: true}));
}

function sassComp(done) {
  gulp.src(paths.style.input, {sourcemaps: true})
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sass({outputStyle: 'expanded'})) //nested, expanded, compact, compressed
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.style.output))
    .pipe(browsersync.reload({stream: true}));
  // 압축버전 - 이버전은 소스맵이 안맞아서 배포용으로 따로 뺌
  gulp.src(paths.style.input, {sourcemaps: true})
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'compressed'})) //nested, expanded, compact, compressed
    .pipe(gulp.dest(paths.style.output + '/min'));
  done();
}

function js() {
  return gulp.src(paths.js.input)
    .pipe(gulp.dest(paths.js.output))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.output + '/min'))
    .pipe(browsersync.reload({stream: true}));
}

function img() {
  return gulp.src(paths.img.input)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 85}), // 포토샵 퀄리티 60%정도와 비슷함
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
            {removeTitle: false}, // <title> 제거안함 (접근성, 반응형 웹 디자인시 필요함)
            {removeDesc: false}, // <desc> 제거안함 (접근성, 반응형 웹 디자인시 필요함)
            {removeViewBox: false}, // viewBox가 삭제되지 않아야 css로 width를 조정할 수 있다. (접근성, 반응형 웹 디자인시 필요함)
            {removeDimensions: true} // viewBox 속성이 있을 경우, width/height 속성 제거
          ]
        })
    ]))
    .pipe(gulp.dest(paths.img.output))
    .pipe(browsersync.reload({stream: true}));
}

function font() {
  return gulp.src(paths.font.input)
    .pipe(gulp.dest(paths.font.output))
    .pipe(browsersync.reload({stream: true}));
}

function watchFiles() {
  gulp.watch(paths.html.input, htmlComp);
  gulp.watch(paths.img.input, img);
  gulp.watch(paths.style.input, sassComp);
  gulp.watch(paths.js.input, js);
  gulp.watch(paths.font.input, font);
}

// export tasks
exports.default = gulp.series(gulp.parallel(htmlComp, sassComp, img, js, font), browserSync, watchFiles);


// var gulp = require('gulp'); 
// var scss = require('gulp-sass'); 
// var sourcemaps = require('gulp-sourcemaps'); 
// var nodemon = require('gulp-nodemon');
// var browserSync = require('browser-sync');
// var uglify = require('gulp-uglify');

// // 소스 파일 경로 
// var PATH = {
//     HTML: './workspace/html'
//     , ASSETS: {
//         FONTS: './workspace/assets/fonts'
//         , IMAGES: './workspace/assets/images'
//         , STYLE: './workspace/assets/style'
//         , SCRIPT: './workspace/assets/js'
//     } 
// }, 

// // 산출물 경로 
// DEST_PATH = {
//     HTML: './dist'
//     , ASSETS: {
//         FONTS: './dist/assets/fonts'
//         , IMAGES: './dist/assets/images'
//         , STYLE: './dist/assets/style'
//         , SCRIPT: './dist/assets/js'
//     } 
// }; 

// gulp.task( 'scss:compile', () => { 
//     return new Promise( resolve => {
//         var options = {
//             outputStyle: "nested" // nested, expanded, compact, compressed
//             , indentType: "space" // space, tab
//             , indentWidth: 4 //
//             , precision: 8
//             , sourceComments: true // 코멘트 제거 여부 
//         }; 
        
//         gulp.src( PATH.ASSETS.STYLE + '/*.scss' )
//         .pipe( sourcemaps.init() )
//         .pipe( scss(options) )
//         .pipe( sourcemaps.write() )
//         .pipe( gulp.dest( DEST_PATH.ASSETS.STYLE ) )
//         .pipe( browserSync.reload({stream: true}) );

//         resolve();
//     }); 
// }); 

// gulp.task( 'html', () => { 
//     return new Promise( resolve => {
//         gulp.src( PATH.HTML + '/*.html' )
//         .pipe( gulp.dest( DEST_PATH.HTML ) )
//         .pipe( browserSync.reload({stream: true}) ); 

//         resolve();
//     }); 
// }); 

// gulp.task( 'script:build', () => { 
//     return new Promise( resolve => {
//         gulp.src( PATH.ASSETS.SCRIPT + '/*.js' )
//             .pipe( gulp.dest( DEST_PATH.ASSETS.SCRIPT ) )
//             .pipe( uglify({ 
//                 mangle: true // 알파벳 한글자 압축 
//             }))
//             .pipe( gulp.dest( DEST_PATH.ASSETS.SCRIPT ) )
//             .pipe( browserSync.reload({stream: true}) );
//         resolve();
//     }) 
// }); 


// gulp.task( 'nodemon:start', () => { 
//     return new Promise( resolve => {
//         nodemon({ 
//             script: 'app.js'
//             , watch: 'app'
//         });
//          resolve();
//     }); 
// });

// gulp.task('watch', () => { 
//     return new Promise( resolve => {
//         gulp.watch(PATH.HTML + "/**/*.html", gulp.series(['html'])); 
//         gulp.watch(PATH.ASSETS.STYLE + "/**/*.scss", gulp.series(['scss:compile']));
//         gulp.watch(PATH.ASSETS.SCRIPT + "/**/*.js", gulp.series(['script:build'])); 

//         resolve();
//     }); 
// }); 

// gulp.task('browserSync', () => { 
//     return new Promise( resolve => {
//         browserSync.init( null, { 
//             proxy: 'http://localhost:8005'
//             , port: 8006
//         });
        
//         resolve();
//     }); 
// }); 

// gulp.task( 'default', gulp.series(['scss:compile', 'html', 'script:build', 'nodemon:start', 'browserSync', 'watch']) );

