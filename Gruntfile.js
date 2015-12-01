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
    nddox: {

      files: {
        src: ['src/**/*.js'],
        dest: 'docs/docs.html'
      }
    },
      css : {
        files: ['src/**/*.less','src/**/*.png','src/**/*.gif'],
        tasks: ['css'],
        options : {
          atBegin : true
        }
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


  grunt.registerMultiTask('nddox','create docs using dox',function()
  {
    //todo:clean and move to some common place - used by nd-node as well
    grunt.log.debug('Doxing...');
    var dox = require('dox');
    var _ =require('lodash');
    var doc = function (file) {
      var buf = grunt.file.read(file),
      obj = dox.parseComments(buf, {
        raw: true
      });
      return obj;
    };

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {
      // Concat specified files.
      var objss = file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(doc);

      var filtered={modules:[],directives:[],services:[],corejobs:[]};

      var lastObjWithMethods={};
      var objs=_.flatten(objss, true);
          objs.forEach(function(obj)
          {
            if(obj && obj.tags)
            {
              var indexedByTag= _.indexBy(obj.tags,'type');
              var getFiltered=function()
              {
                var ret={};
                var doxName=indexedByTag.name && indexedByTag.name.string.replace(/ directive| service| module| corejob/g,'');
                doxName=doxName|| obj && obj.ctx && obj.ctx.name;
                if(doxName){ret.name=doxName;}
                var doxDesc=indexedByTag.description && indexedByTag.description.string ||'';
                if(doxDesc){ret.description=doxDesc;}
                var doxExample=indexedByTag.example && indexedByTag.example.string ||'';
                if(doxExample){ret.example=doxExample;}
                var doxRet=indexedByTag.return && indexedByTag.return.string ;
                if(doxRet){ret.return=doxRet;}
                var doxParams=_.map(_.filter(obj.tags,{type:'param'}),function(param)
                {
                  return {
                    name:param.name,
                    description: param.description,
                    type : param.types.join(',')
                  };
                });
                if(doxParams.length>0){ret.params=doxParams;}
                return ret;
              };

              if(indexedByTag && indexedByTag.name && / module/.test(indexedByTag.name.string))
              {
                var mod=getFiltered();
                lastObjWithMethods=mod;
                filtered.modules.push(mod);
              }
              if(indexedByTag && indexedByTag.name && / corejob/.test(indexedByTag.name.string))
              {
                var corejob=getFiltered();
                lastObjWithMethods=corejob;
                filtered.corejobs.push(corejob);
              }

              if(indexedByTag && indexedByTag.name && / directive/.test(indexedByTag.name.string))
              {
                var dir=getFiltered();
                lastObjWithMethods=dir;
                filtered.directives.push(dir);

              }

              if(indexedByTag && indexedByTag.name && / service/.test(indexedByTag.name.string))
              {
                var serv=getFiltered();
                lastObjWithMethods=serv;
                filtered.services.push(serv);
              }

              if(_.get(obj,'ctx.type')==='function')
              {
                if(!lastObjWithMethods.methods){lastObjWithMethods.methods=[];}
                lastObjWithMethods.methods.push(getFiltered());
              }



            }
      });
      var html='';

      var getDivStr=function(value,divPrefix)
      {
        if(!value){return '';}
        return '<div class="dox-'+divPrefix+'">'+_.escape(value)+'</div>';
      };

      function getArrayTemplateAsString(arr,prefix)
      {
        if(!arr){return '';}

        return '<div class="dox-'+prefix+'s">'+_.map(arr,function(oneObj)
      {
        var ret='<div class="dox-'+prefix+'">';
        ret+=getDivStr(oneObj.name,'name');
        ret+=getDivStr(oneObj.type,'type');
        ret+=getDivStr(oneObj.description,'description');
        ret+=getArrayTemplateAsString(oneObj.params,'param');
        ret+=getDivStr(oneObj.return,'return');
        ret+=getArrayTemplateAsString(oneObj.methods,'method');
        ret+=getDivStr(oneObj.example,'example');
        ret+='</div>';

        return ret;

      }).join('\n')+'</div>';
      }

      html+=getArrayTemplateAsString(filtered.modules,'module');

      html+=getArrayTemplateAsString(filtered.services,'service');
      html+=getArrayTemplateAsString(filtered.directives,'directive');
      html+=getArrayTemplateAsString(filtered.corejobs,'corejob');

      html+='</div>\n';
      var prettyPrint = require('html').prettyPrint;
      grunt.file.write(file.dest, prettyPrint(html, {indent_size: 4}));


    });


  });
/*
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
  });*/

  // Default task.
  grunt.registerTask('default', [/*'jshint:beforeconcat',*/ 'ngtemplates','concat','copy:style','cssmin',/*'jshint:afterconcat',*/'uglify','replace','dox']);
  grunt.registerTask('js', ['concat','amd','uglify']);
  grunt.registerTask('css', ['copy','less']);

};
