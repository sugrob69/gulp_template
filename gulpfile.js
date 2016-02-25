'use strict';

const gulp = require('gulp');

const path = {
	build: {
        html: './build/',
		css: './build/common/css/',
		js: './build/common/js/',
		img: './build/common/img/',
		svg: './build/common/img/svg/',
		fonts: './build/common/fonts/'
	},
	src: {
        jade: './src/*.jade',
        html: './src/*.html',
        js: './src/js/*.js',
        styleStylus: './src/css/main.styl',
		styleStylusVendor: './src/css/vendor.styl',
		img: './src/img/*.*',
		svg: './src/img/svg/*.svg',
		fonts: './src/fonts/**/*.*'
	},
	assets: {
		js: {
			src: ['./src/vendor/bower_components/jquery/dist/jquery.min.js'],
			dest: './build/common/js/'
		},
		fonts: {
			src: ['./src/vendor/bower_components/bootstrap/dist/fonts/*.*'],
			dest: './build/common/fonts/'
		}
	},
	watch: {
		jade: './src/**/*.jade',
		js: './src/js/*.js',
        html: './src/*.html',
		styleStylus: 'src/**/*.styl',
		img: 'src/img/*.*',
		svg: 'src/img/svg/*.svg',
		fonts: 'src/fonts/**/*.*',
		server: 'build/**/*.*'
	},
	server: {
		dest: 'build/'
	},
	clean: './build'
};


function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);

        return task(callback);
    });
}


lazyRequireTask('html', './tasks/html.js', {
    src: path.src.html,
    dest: path.build.html
});


lazyRequireTask('jade', './tasks/jade.js', {
    src: path.src.jade,
    dest: path.build.html
});


lazyRequireTask('js', './tasks/js.js', {
    src: path.src.js,
    dest: path.build.js
});


lazyRequireTask('stylus', './tasks/stylus.js', {
    src: path.src.styleStylus,
    vend: path.src.styleStylusVendor,
    dest: path.build.css
});


lazyRequireTask('svg', './tasks/svg.js', {
    src: path.src.svg,
    dest: path.build.svg
});


lazyRequireTask('fonts', './tasks/fonts.js', {
    src: path.src.fonts,
    dest: path.build.fonts
});


lazyRequireTask('img', './tasks/img.js', {
    src: path.src.img,
    dest: path.build.img
});


lazyRequireTask('assets:js', './tasks/assets.js', {
    src: path.assets.js.src,
    dest: path.assets.js.dest
});


lazyRequireTask('assets:fonts', './tasks/assets.js', {
    src: path.assets.fonts.src,
    dest: path.assets.fonts.dest
});


lazyRequireTask('del', './tasks/del.js', {
    dest: path.clean
});


lazyRequireTask('serve', './tasks/serve.js', {
    dest: path.server.dest,
    watch: path.watch.server
});


gulp.task('watch', function() {
	gulp.watch(path.watch.styleStylus, gulp.series('stylus'));
	gulp.watch(path.watch.svg, gulp.series('svg'));
	gulp.watch(path.watch.fonts, gulp.series('fonts'));
	gulp.watch(path.watch.img, gulp.series('img'));
	gulp.watch(path.watch.html, gulp.series('html'));
	gulp.watch(path.watch.jade, gulp.series('jade'));
	gulp.watch(path.watch.js, gulp.series('js'));
	gulp.watch(path.assets.js.src, gulp.series('assets:js'));
	gulp.watch(path.assets.fonts.src, gulp.series('assets:fonts'));
});


gulp.task('build', gulp.series('del', gulp.parallel('html', 'jade', 'stylus', 'assets:js', 'js', 'svg', 'assets:fonts', 'fonts', 'img')));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));