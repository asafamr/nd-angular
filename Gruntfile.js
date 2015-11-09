// jshint ignore: start
module.exports = function(grunt) {
  grunt.util.linefeed = "\n";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options : {
        separator : "\n"
      },
      dist: {
        src: ['src/**/*.js','<%= ngtemplates.app.dest %>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    ngtemplates: {
      app: {
          src:      'src/**/*.html',
          dest:     'build/app.templates.js'

      }
    },
    cssmin: {
      compress: {
        options: {
          keepSpecialComments: '*',
          noAdvanced: true, // turn advanced optimizations off until the issue is fixed in clean-css
          report: 'min',
          selectorsMergeMode: 'ie8'
        },
        src: [
          'dist/nd-angular.css'
        ],
        dest: 'dist/nd-angular.min.css'
      }
    },
    copy: {
      docs : {
        files : [
          { expand: true, cwd : 'dist/', src: ['**/*'], dest: 'docs/assets/dist/' }
        ]
      },
      style:
      {
        files : [
          { expand: true, cwd : 'src/style', src: ['nd-angular.css'], dest: 'dist/' }
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> - (<%= _.pluck(pkg.licenses, "type").join(", ") %>) */\n',
        preserveComments: false,
        //sourceMap: "dist/jstree.min.map",
        //sourceMappingURL: "jstree.min.map",
        report: 'min',
        beautify: {
                ascii_only: true
        },
        compress: {
                hoist_funs: false,
                loops: false,
                unused: false
        }
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
          "browser": true,
          "node": true,

          "curly": true,
          "eqeqeq": true,
          "es3": true,
          "newcap": false,
          "noarg": true,
          "nonew": true,
          "quotmark": "single",
          "strict": true,
          "trailing": true,
          "undef": true,
          "unused": true,

          "globals": {
              "angular": true

          }


      },
      beforeconcat: ['src/**/*.js'],
      afterconcat: ['dist/<%= pkg.name %>.js']
    },
    dox: {
      files: {
        src: ['src/*.js'],
        dest: 'docs'
      }
    },



    watch: {
      js : {
        files: ['src/**/*.js'],
        tasks: ['js'],
        options : {
          atBegin : true
        }
      },
      css : {
        files: ['src/**/*.less','src/**/*.png','src/**/*.gif'],
        tasks: ['css'],
        options : {
          atBegin : true
        }
      },
    },


    replace: {
      files: {
        src: ['dist/*.js', 'bower.json', 'component.json', 'jstree.jquery.json'],
        overwrite: true,
        replacements: [
          {
            from: '{{VERSION}}',
            to: "<%= pkg.version %>"
          },
          {
            from: /"version": "[^"]+"/g,
            to: "\"version\": \"<%= pkg.version %>\""
          },
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-text-replace');


  grunt.registerMultiTask('dox', 'Generate dox output ', function() {
    var exec = require('child_process').exec,
        path = require('path'),
        done = this.async(),
        doxPath = path.resolve(__dirname),
        formatter = [doxPath, 'node_modules', '.bin', 'dox'].join(path.sep);
    exec(formatter + ' < "dist/nd-angular.js" > "docs/nd-angular.json"', {maxBuffer: 5000*1024}, function(error, stout, sterr){
      if (error) {
        grunt.log.error(formatter);
        grunt.log.error("WARN: "+ error);
      }
      if (!error) {
        grunt.log.writeln('dist/nd-angular.js doxxed.');
        done();
      }
    });
  });

  // Default task.
  grunt.registerTask('default', [/*'jshint:beforeconcat',*/ 'ngtemplates','concat','copy:style','cssmin',/*'jshint:afterconcat',*/'uglify','replace','copy:docs','dox']);
  grunt.registerTask('js', ['concat','amd','uglify']);
  grunt.registerTask('css', ['copy','less']);

};
