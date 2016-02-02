'use strict';

var path = require('path')

module.exports = function (grunt) {

  [
    'grunt-contrib-coffee',
    'grunt-contrib-jade',
    'grunt-contrib-stylus',
    'grunt-contrib-copy',
    'grunt-exec',
    'grunt-regarde'
  ].forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    exec: {
      app: {
        cmd: 'node app'
      }
    },

    watch: {
      stylus: {
        files: ['src/**/*.styl'],
        tasks: ['stylus']
      },
      jade: {
        files: ['src/**/*.jade'],
        tasks: ['jade']
      },
      coffee: {
        files: ['src/**/*.coffee'],
        tasks: ['coffee']
      },
      copy: {
        files: ['src/**/*.html'],
        tasks: ['copy']
      }
    },

    coffee: {
      dist: {
        expand: true,
        cwd: 'src',
        src: ['**/*.coffee'],
        dest: 'dist',
        ext: '.js'
      }
    },

    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '**/**.jade',
            dest: 'dist/',
            ext: '.html'
          }
        ]
      }
    },

    stylus: {
      compile: {
        options: {
          'include css': true,
          'import': ['nib', 'jeet'],
          paths: [
            "node_modules/jeet/stylus"
          ]
        },
        files: {
          'dist/css/landing_page.css': 'src/styl/pages/landing_page/main.styl',
          'dist/css/how-it-works.css': 'src/styl/pages/how-it-works/main.styl',
          'dist/css/about.css': 'src/styl/pages/about/main.styl',
          'dist/css/project_index.css': 'src/styl/pages/project_index/main.styl',
          'dist/css/project_listing.css': 'src/styl/pages//project_listing/main.styl',
          'dist/css/project_dashboard.css': 'src/styl/pages/project_dashboard/main.styl',
          'dist/css/login.css': 'src/styl/pages/login/main.styl',
          'dist/css/user_profile.css': 'src/styl/pages/user_profile/main.styl',
          'dist/css/company_profile.css': 'src/styl/pages/company_profile/main.styl',
          'dist/css/pricing.css': 'src/styl/pages/pricing/main.styl',
          'dist/css/manager.css': 'src/styl/pages/manager/main.styl',
          'dist/css/contact.css': 'src/styl/pages/contact/main.styl'
        }
      }
    },

    copy: {
      compile: {
        expand: true,
        cwd: 'src',
        src: '**.html',
        dest: 'dist'
      }
    }
  });

  grunt.renameTask('regarde', 'watch');
  grunt.registerTask('build', [
    'jade',
    'stylus',
    'coffee',
    'copy'
  ]);
  grunt.registerTask('default', [
    'build',
    'watch'
  ]);
};
