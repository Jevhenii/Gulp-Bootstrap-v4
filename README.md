# Gulp + Bootstrap-v4.0.0-alpha.6

Сборка проекта Gulp + Bootstrap v4.0.0-alpha.6

Перечень плагинов Gulp, включенных в данную сборку:

  - gulp - Gulp.
  - gulp-clean - очистка папки build.
  - gulp-copy - копирование всех файлов в build.
  - gulp-plumber - формирование отчета об ошибке без прерывания работы Gulp.
  - gulp-postcss - плагин PostCSS.
  - browser-sync - сервер разработки.
  - css-mqpacker - объединение медиавыражений (PostCSS).
  - gulp-autoprefixer - вендорные префиксы (PostCSS).
  - gulp-csso - минификатор CSS.
  - gulp-cheerio - удаление (добавление) атрибутов у SVG.
  - gulp-sequence - параллельный запуск тасков.
  - gulp-htmlmin - минификатор HTML.
  - gulp-imagemin - минификатор изображений.
  - gulp-sass - компилятор SASS (SCSS) в CSS.
  - gulp-rename - переименование файлов.
  - gulp-svgmin - сжатие SVG.
  - gulp-svgstore - создание спрайта из SVG.
  - gulp-uglify - минификатор JavaScript.
  - gulp-uncss - удаление неиспользуемых селекторов в CSS.

  Запуск сборки:
  - npm i - установка.
  - gulp build - сборка проекта.
  - npm start - сборка проекта и запуск сервера разработки.

  Структура:
   - src:
    - bootstrap
      - scss - исходные scss-файлы Bootstrap v.4
      - js - исходные js-файлы Bootstrap v.4 в обычной и минимизированной версиях.
    Исходные файлы Bootstrap компилируются в bootstrap.min.css и bootstrap.min.js и подключаются к проекту. Для необходимой кастомизации необходимо внести правки в соответствующий scss или js файл.
    - fonts - папка со шрифтами.
    - img - папка с изображениями.
    - js
      - library - дополнительные бибилиотеки, которые подключаются к проекту.
      - script.js - основной файл скриптов проекта.
    - scss
      - block - папка с scss-файлами блоков разметки.
      - global - папка с глобальными scss-файлами проекта.
      - mixins - папка с scss-миксинами проекта.
    - variables.scss - scss-файл для переменных.
    - style.scss - импорт всех scss-файлов с последующей компиляцией в style.min.css, который и подключается к проекту.
    - index.html - HTML для главной странице.
