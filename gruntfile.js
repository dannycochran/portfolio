// order here determines dependency (must manually add all vendor JS here)
var vendorJavascripts = ['vendor/js/zepto.js', 'vendor/js/underscore.js', 'vendor/js/backbone.js',
'vendor/js/d3.v3.js', 'vendor/js/headroom.js'];

var componentHTML = {
  header: 'app/templates/bookends/header.html',
  footer: 'app/templates/bookends/footer.html'
};

module.exports = function (grunt) {

  var mode = typeof(grunt.option('offline')) === 'undefined' ? 'online' : 'offline';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        options: {separator: ';'}, // to prevent zepto's non-colon ending from destroying everything
        src: [vendorJavascripts, 'app/**/*.js'],
        dest: 'dist/build.js',
      },
      html: {
        src: [componentHTML.header, 'app/templates/books/*.html', componentHTML.footer],
        dest: 'index.html'
      },
      css: {
        src: mode === 'offline' ? ['vendor/css/dev-fonts.css', 'dist/build.css'] : ['dist/build.css'],
        dest: 'dist/build.css'
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: true,
      },
      target: {
        files: {'dist/build.js': ['dist/build.js']}
      }
    },
    preprocess: {
      index: {
        src: 'index.html',
        dest: 'index.html'
      }
    },
    env: {
      dev: {
        NODE_ENV: 'dev',
        MODE: mode
      },
      prod: {
        NODE_ENV: 'prod',
        MODE: mode
      }
    },
    sass: {
      dist: {
        files: {'dist/build.css': 'assets/sass/custom.scss'}
      }
    },
    watch: {
      js: {files: 'app/**/*.js', tasks: ['concat:js']},
      css: {files: 'assets/sass/*.scss', tasks: ['sass', 'concat:css']},
      html: {
        files: ['app/templates/**/*.html'],
        tasks: ['concat:html']
      }
    },
    sloc: {js: {files: {'./': ['server.js', 'app/**.js']}}},
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          nodeArgs: ['--debug'],
          ignoredFiles: ['node_modules/**', 'app/**/*.js', 'assets/**'],
          watchExtensions: ['js'],
          env: {PORT: '3000'}
        }
      },
      prod: {
        options: {
          file: 'server.js',
          env: {PORT: '3000'}
        }
      }
    },
    concurrent: {
      app: {
        tasks: ['nodemon:dev', 'watch'],
        options: {logConcurrentOutput: true}
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.registerTask('rebuild', ['env:prod', 'sass', 'concat', 'uglify']);
  grunt.registerTask('app', ['env:dev', 'sass', 'concat', 'preprocess:index', 'concurrent:app']);
  grunt.registerTask('app-prod', ['env:prod', 'sass', 'concat', 'uglify', 'preprocess:index', 'nodemon:prod']);
};
