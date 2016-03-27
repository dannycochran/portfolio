module.exports = function (grunt) {

  var portfolio = grunt.option('portfolio') || 'dcochran';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    shell: {
      js: {command: 'duo ' + portfolio + '/build/build.js --output dist/; mv dist/dcochran/build/build.js dist/build.js; rm -rf dist/dcochran'},
      sass: {command: 'sass ' + portfolio + '/build/build.scss dist/build.css'},
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
        files: ['common/modules/**/*.js', 'common/modules/**/*.html', 'common/vendor/js/*.js',
        'common/extensions/*.js', portfolio + '/modules/**/*.js', portfolio + '/modules/**/*.html', portfolio + '/build/build.js'],
        tasks: ['shell:js']
      },
      css: {
        files: ['common/modules/**/*.scss', portfolio + '/modules/**/*.scss', 'common/vendor/css/*'],
        tasks: ['shell:sass']
      },
      html: {
        files: ['index.html'],
        tasks: ['preprocess:index']
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          nodeArgs: ['--debug'],
          ignoredFiles: ['node_modules/**', portfolio + '/modules/**/*.js', 'assets/**'],
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-shell');

  var build = ['copy:common', 'copy:app', 'shell', 'preprocess:index'];
  grunt.registerTask('rebuild', ['env:prod'].concat(build).concat(['cssmin', 'uglify']));
  grunt.registerTask('app', ['env:dev'].concat(build).concat(['concurrent:app']));
  grunt.registerTask('app-prod', ['env:prod'].concat(build).concat(['cssmin', 'uglify', 'concurrent:app']));
};
