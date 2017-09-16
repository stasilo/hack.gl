var options = {
    // this will be the function name attached to the window object if lib is included with script-tags
    standaloneName: 'hackgl',

    jsEntryPoint: 'src/hack-gl.js',
    jsBundlePath: 'dist',
    jsBundleName: 'hackgl',

    // set a variable telling us if we're building in release/prod or dev
    // $NODE_ENV must be set to "Release" if building for production.
    isProduction: process.env.NODE_ENV && process.env.NODE_ENV === 'Release' ? true : false
};

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var derequire = require('gulp-derequire');
var uglify = require("gulp-uglify");
var noop = require('gulp-noop');
var clean = require('gulp-clean');
var stringify = require('stringify');

var babelify = babel.configure({
    presets: ["es2015", "stage-0", "es2017"],
    plugins: ["transform-runtime", "add-module-exports"],
});

function transpileAndBundleJs(watch) {
    var b = browserify(options.jsEntryPoint, {
            standalone: options.standaloneName,
            debug: !options.isProduction
        })
        .transform(babelify)
        .transform(stringify, {
            appliesTo: { includeExtensions: ['.vertex', '.fragment', '.glsl'] },
            minify: false
        });

    var bundler = watch ? watchify(b) : b;

    function bundle() {
        console.log('[' + new Date().toTimeString() + '] hack.gl -> Transpiling and bundling js assets...');

        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source(options.jsBundleName + '.js'))
            .pipe(buffer())
            .pipe(options.isProduction ? noop() : sourcemaps.init({ loadMaps: true }))
            //.pipe(options.isProduction ? uglify() : noop())
            .on('error', function (err) { console.error(err); this.emit('end'); })
            .pipe(options.isProduction ? noop() : sourcemaps.write('./'))
            .pipe(derequire())
            .pipe(gulp.dest(options.jsBundlePath));
    }

    if (watch) {
        bundler.on('update', function() {
            bundle();
        });
    }

    bundle();
}

function watchJs() {
    return transpileAndBundleJs(true);
};

gulp.task('clean-scripts', function () {
    return gulp
        .src(options.jsBundlePath, { read: false })
        .pipe(clean());
});

gulp.task('build', ['clean-scripts'], function () {
    console.log('hack.gl -> Building assets for ' + (options.isProduction ? '[PRODUCTION]' : '[DEVELOPMENT]'));
    return transpileAndBundleJs(false);
});

gulp.task('watch', ['build'], function () {
    return watchJs();
});

gulp.task('default', ['build']);
