'use strict';

//импортируем нужные плагины
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    stylus = require('gulp-stylus'),
    nib = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    connect = require('gulp-connect'),
    opn = require('opn');


//переменная с путями
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/common/',
        js: 'build/common/js/',
        css: 'build/common/css/',
        img: 'build/common/img/',
        fonts: 'build/common/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        jsplugins: 'src/js/plugins.js',//все js плагины
        js: 'src/js/style.js',//В скриптах нам нужен style.js файл
        styleplugins: 'src/css/plugins.css',//список стилей от плагинов
        style: 'src/css/style.styl',//В стилях нам понадобится только style.styl файл
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.styl',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};


//переменная с настройками сервера
var server = {
    host: 'localhost',
    port: '9000'
};


//задача по сборке html
gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(connect.reload()); //И перезагрузим наш сервер для обновлений
});


//задача по сборке js
gulp.task('js:build', function () {
    gulp.src(path.src.jsplugins) //Найдем файл с плагинами
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)); //Выплюнем готовый файл в build

    gulp.src(path.src.js) //Найдем наш style.js файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(connect.reload()); //И перезагрузим сервер
});


//задача по сборке стилей
gulp.task('style:build', function () {
    gulp.src(path.src.styleplugins) //Выберем наш plugins.css
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(connect.reload()); //перезагрузим

    gulp.src(path.src.style) //Выберем наш main.styl
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(stylus({use: [nib()]})) //Скомпилируем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(connect.reload()); //перезагрузим
});


//задача по сборке картинок
gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(connect.reload());
});


//задача по сборке шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts) //выбираем шрифты
        .pipe(gulp.dest(path.build.fonts)); // бросаем их в билд
});


// задача build
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


//наблюдаем за изменением файлов
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


//поднимаем вебсервер и livereload
gulp.task('webserver', function() {
    connect.server({
        host: server.host,
        port: server.port,
        livereload: true
    });
});


//задача по чистке build
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


//открываем браузер
gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port + '/build' );
});


//дефолтная задача по запуску всех задача
gulp.task('default', ['build', 'webserver', 'watch', 'openbrowser']);