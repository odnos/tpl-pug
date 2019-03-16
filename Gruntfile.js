// FULL CONFIG FILE!
module.exports = function(grunt) {

  // Плагины для imagemin
  const imageminMozjpeg = require('imagemin-mozjpeg');
  const imageminOptipng = require('imagemin-optipng');
  const imageminGifsicle = require('imagemin-gifsicle');
  const imageminSvgo = require('imagemin-svgo');

  grunt.initConfig({
    // CLEAN
    clean: {
      files: ['dist']
    },
    // WATCH
    watch: {
      less: { files: ['src/less/**/*.less'], tasks: ['less'] },
      pug: { files: ['src/pug/**/*.pug'], tasks: ['pug'] },
      js: { files: ['src/js/scripts.js'], tasks: ['uglify'] },
      imagemin: { files: ['src/images/*.*'], tasks: ['imagemin'] }
    },
    // LESS
    less: {
      options: {
        sourceMap: true,
        compress: true,
        plugins: [
          new(require('less-plugin-autoprefix'))({ browsers: ["last 2 versions", "ie 10", "ie 11"] })
        ]
      },
      dev: {
        files: {
          'dist/css/styles.css': 'src/less/main.less'
        }
      }
    },
    // PUG
    pug: {
      compile: {
        options: {
            pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: 'src/pug/',
          src: ['**/*.pug', '!**/includes/**', '!**/templates/**'],
          dest: 'dist/',
          ext: ".html"
        }]
      }
    },
    // UGLIFY
    uglify: {
      options: {
        mangle: false
      },
      dev: {
        files: {
          'dist/js/scripts.js': [
            'node_modules/jquery/dist/jquery.min.js',
            // 'node_modules/@cmyee/pushy/js/pushy.min.js',
            // 'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
            'src/js/scripts.js'
          ]
        }
      }
    },
    // BROWSERSYNC
    browserSync: {
      dev: {
        bsFiles: {
          src: ['dist/css/*.css', 'dist/*.html']
        },
        options: {
          watchTask: true,
          server: './dist'
        }
      }
    },
    // COPY
    copy: {
      main: {
        files: [
          // favicon.ico, robots.txt
          { expand: true, cwd: 'src', src: ['*.ico','*.txt','*.png'], dest: 'dist' },
          // fonts
          { expand: true, cwd: 'src/fonts', src: ['*.woff','*.woff2'], dest: 'dist/fonts' },
          // normalize
          { src: 'node_modules/normalize.css/normalize.css', dest: 'src/less/vendor/normalize.less' },
          // pushy
          // { src: 'node_modules/@cmyee/pushy/css/pushy.css', dest: 'src/less/vendor/pushy.less' },
          // fancybox
          // { src: 'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css', dest: 'src/less/vendor/fancybox.less' }
        ]
      }
    },
    // IMAGEMIN
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3,
          progressive: true,

          use: [
            imageminMozjpeg(),
            imageminOptipng(),
            imageminGifsicle(),
            imageminSvgo(),
          ]
        },
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*.{png,jpg,gif,svg}', '!**/icons/**'],
          dest: 'dist/images/'
        }]
      }
    },
    // SPRITE
    sprite:{
      all: {
        src: ['src/images/icons/*.png'],
        dest: 'src/images/sprite.png',
        destCss: 'src/images/icons/sprite.css',
        imgPath: '../images/sprite.png',
        retinaSrcFilter: ['src/images/icons/*@2x.png'],
        retinaDest: 'src/images/sprite@2x.png',
        retinaImgPath: '../images/sprite@2x.png'
      }
    }

  });

  // LOAD NPM TASKS
  require('jit-grunt')(grunt, {
    sprite: 'grunt-spritesmith',
  });

  // DEFAULT TASK
  grunt.registerTask('default', ['clean', 'copy', 'pug', 'less', 'uglify', 'imagemin', 'browserSync', 'watch']);
};
