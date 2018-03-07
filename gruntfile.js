module.exports = function (grunt) {

  var portfolio = grunt.option('portfolio') || 'dcochran';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          ['dist/build.js']: [portfolio + '/build/build.js']
        },
        options: {
          transform: [['babelify', {
            presets: ['es2017', 'es2016', 'es2015'],
            plugins: ['transform-html-import-to-string']
          }]],
        }
      }
    },
    copy: {
      common: {
        expand: true,
        cwd: 'common/assets/fonts',
        src: '**',
        dest: 'dist/assets/fonts'
      },
      app: {
        expand: true,
        cwd: portfolio + '/img',
        src: '**',
        dest: 'dist/assets/img'
      },
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/build.css': portfolio + '/build/build.scss'
        }
      }
    },
    cssmin: {
      combine: {
        files: {'dist/build.css': ['dist/build.css']}
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: {},
      },
      target: {
        files: {'dist/build.js': ['dist/build.js']}
      }
    },
    preprocess: {
      index: {
        src: 'index.html',
        dest: 'dist/index.html'
      }
    },
    env: {
      dev: {
        NODE_ENV: 'dev',
        PORTFOLIO: portfolio
      },
      prod: {
        NODE_ENV: 'prod',
        PORTFOLIO: portfolio
      }
    },
    watch: {
      js: {
        files: [
          'common/modules/**/*.js',
          'common/modules/**/*.html',
          portfolio + '/modules/**/*.js',
          portfolio + '/modules/**/*.html',
          portfolio + '/build/build.js'
        ],
        tasks: ['browserify']
      },
      css: {
        files: ['common/modules/**/*.scss', portfolio + '/modules/**/*.scss', 'common/vendor/css/*'],
        tasks: ['sass']
      },
      html: {
        files: ['index.html'],
        tasks: ['preprocess:index']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-sass');

  var build = ['copy:common', 'copy:app', 'sass', 'browserify', 'preprocess:index'];
  grunt.registerTask('rebuild', ['env:prod'].concat(build).concat(['cssmin', 'uglify']));
  grunt.registerTask('app', ['env:dev'].concat(build).concat(['watch']));
  grunt.registerTask('app-prod', ['env:prod'].concat(build).concat(['cssmin', 'uglify', 'watch']));
};
