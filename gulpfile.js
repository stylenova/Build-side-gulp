var gulp = require('gulp'),
		less = require('gulp-less'),
		sass = require('gulp-sass'),
		notify = require('gulp-notify'),
		zip = require('gulp-zip'),
		del = require('del'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		combiner = require('stream-combiner2').obj,
		autoprefixer = require('gulp-autoprefixer'),
		mainBowerFiles = require('main-bower-files'),
		wiredep = require('wiredep').stream,
		browserSync = require('browser-sync');


// подключение путей установленых файлов bower

// проверить почему не прописывает пути в файле index.html
gulp.task('bower', function () {
  gulp.src('./add/index.html')
    .pipe(wiredep({
      directory : "add/bower_components"
    }))
    .pipe(gulp.dest('./add'));
});

// перемежение нужного файла из установленых пакетов bower-components
// запустить все задачи сразу премещения файлов bower-components
gulp.task('allLibs', ['libsJs', 'libsScss', 'libsCss']);

gulp.task('libsJs', function() {
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(gulp.dest('app/libs/'))
});


gulp.task('libsScss', function() {
    return gulp.src(mainBowerFiles('**/*.scss'))
        .pipe(gulp.dest('app/libs/'))
});

gulp.task('libsCss', function() {
    return gulp.src(mainBowerFiles('**/*.css'))
    		//допилить изменения имени на scss
        .pipe(gulp.dest('app/libs/'))
});


// Clean file email zip
gulp.task('clean', function () {
	return del.sync('build');
	});

//Optimization images
gulp.task('img', function() {
	return gulp.src(['app/img/*.jpg', 'app/img/*.png', 'app/img/*.gif'])
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
		}))
	.pipe(gulp.dest('build/img'));
	});

//Compilation less + error
gulp.task('less', function () {
	return combiner(
		gulp.src('app/less/**/*.less'),
		less(),
		autoprefixer({
			browsers: ['last 15 versions', '>1%', 'ie 8', 'ie 7'],
			cascade: false
			}),
		gulp.dest('app/css'),
		browserSync.reload({stream: true})
		).on('error', notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error Less"
		}));   //watching all the steams and shows error
		});


//Compilation sass + error
gulp.task('scss', function () {
	return combiner(
		gulp.src(['app/scss/**/*.scss']),
		sass({outputStyle: 'expanded'}), //{outputStyle: 'expanded'} делает синтаксис скобок нормальным
		autoprefixer({
			browsers: ['last 15 versions', '>1%', 'ie 8', 'ie 7'],
			cascade: false
			}),
		gulp.dest('app/css'),
		browserSync.reload({stream: true})
		).on('error', notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error Sass"
			}));   //watching all the steams and shows error
		});

//Browser-sync
gulp.task('browser-sync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
			},
			notify: false
			});
	});

//watch
gulp.task('watch', ['browser-sync', 'scss'], function(){
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/**/*.css', browserSync.reload);
	gulp.watch('app/**/*.html', browserSync.reload);
});
