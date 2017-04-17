"use strict";

// Variables

var gulp = require("gulp"),
    clean = require("gulp-clean"),
    copy = require("gulp-copy"),
    csso = require("gulp-csso"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    uncss = require("gulp-uncss"),
    mqpacker = require("css-mqpacker"),
    autoprefixer = require("gulp-autoprefixer"),
    htmlmin = require("gulp-htmlmin"),
    jsmin = require("gulp-uglify"),
    imagemin = require("gulp-imagemin"),
    svgstore = require("gulp-svgstore"),
    svgmin = require("gulp-svgmin"),
    cheerio = require("gulp-cheerio"),
    browser = require("browser-sync").create(),
    sequence = require("gulp-sequence");

// Tasks

// 1.) Копирование всех файлов в папку build.

gulp.task("copy", function() {
  return gulp.src([
      "css/**/*.css",
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
    ], {
      cwd: "src/**"
    })
    .pipe(gulp.dest("build"));
});

// 2.) Очистка папки build

gulp.task("clean", function () {
  return gulp.src("build", {
    read: false
  }).pipe(clean());
});

// 3.) Компиляция SCSS в CSS. Объединение медиавыражений. Расстановка вендорных префиксов. Удаление неиспользуемых селекторов. Минификация CSS.

gulp.task("style", function() {
  gulp.src("src/scss/style.scss")
    .pipe(plumber({
      log: true
    }))
    .pipe(sass())
    .pipe(postcss([mqpacker({
      sort: true
    })]))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: false
    }))
    .pipe(uncss({
      html: ["build/*.html"]
    }))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("build/css/style.min.css"))
    .pipe(gulp.dest("."));
});

// 4.) Компиляция Bootstrap стилей из SCSS в CSS (src/bootstrap/scss) с последующей их минификацией.

gulp.task("styleBootstrap", function() {
  gulp.src("src/bootstrap/scss/bootstrap.scss")
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: false
      }))
    .pipe(gulp.dest("build/bootstrap/css"))
    .pipe(csso())
    .pipe(rename("build/bootstrap/css/bootstrap.min.css"))
    .pipe(gulp.dest("."));
});

// 5.) Минификация HTML.

gulp.task("minHTML", function() {
  return gulp.src("build/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

// 6.) Минификация JavaScript.

gulp.task("minJS", function() {
  return gulp.src("build/js/*.js")
    .pipe(jsmin())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js"));
});

// 7.) Минификация JavaScript из папки Library.

gulp.task("minJSLib", function() {
  return gulp.src("build/js/library/*.js")
    .pipe(jsmin())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js/library"));
});

// 8.) Минификация JavaScript из папки bootstrap/js.

gulp.task("minJSBootstrap", function() {
  return gulp.src("build/bootstrap/js/*.js")
    .pipe(jsmin())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/bootstrap/js"));
});

// 9.) Сжатие изображений.

gulp.task("minImg", function(cb) {
    gulp.src(["src/img/**/*.{jpg,png,gif,jpeg}"]).pipe(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest("build/img")).on("end", cb).on("error", cb);
});

// 10.) Создание SVG-српайта. Сжатие SVG-иконок.

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(cheerio({
      run: function($) {
        $("svg").attr("style", "display:none");
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

// 11.) Копирование изменений .html из src в build. Минификация.

gulp.task("changeHTML", function() {
  return gulp.src([
      "src/*.html"
    ])
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

// 12.) Копирование изменений .js из src/js в build. Минификация.

gulp.task("changeJS", function() {
  return gulp.src([
      "src/js/**/*.js"
    ])
    .pipe(jsmin())
    .pipe(gulp.dest("build/js"));
});

// 13.) Копирование изменений .js из src/bootstrap/js в build. Минификация.

gulp.task("changeJSBootstrap", function() {
  return gulp.src([
      "src/bootstrap/js/**/*.js"
    ])
    .pipe(jsmin())
    .pipe(gulp.dest("build/bootstrap/js"));
});

// 14.) Сборка проекта.

gulp.task("build", function(fn) {
  sequence(
    "clean",
    "copy",
    "style",
    "styleBootstrap",
    "minHTML",
    "minJS",
    "minJSLib",
    "minJSBootstrap",
    "minImg",
    "symbols",
    fn
  );
});

// 15.) Сервер разработки проекта.

gulp.task("server", function() {
  browser.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });
  gulp.watch("src/scss/**/*.scss", ["style"]);
  gulp.watch("src/bootstrap/scss/**/*.scss", ["styleBootstrap"]);
  gulp.watch("src/*.html", ["changeHTML"]);
  gulp.watch("build/*.html").on("change", browser.reload);
  gulp.watch("src/**/*.js", ["changeJS"]);
  gulp.watch("build/js/**/*.js").on("change", browser.reload);
  gulp.watch("src/bootstrap/js/*.js", ["changeJSBootstrap"]);
  gulp.watch("build/bootstrap/js/*.js").on("change", browser.reload);
});
