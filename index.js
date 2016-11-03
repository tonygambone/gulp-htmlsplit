var through = require('through2'),
  PluginError = require('gulp-util').PluginError,
  File = require('vinyl'),
  path = require('path');
  fs = require('fs');

const PLUGIN_NAME = 'gulp-htmlsplit';

function split(opts) {
  var self = this;
  var options = opts || {};
  var stop = options.stop || 'stop';
  this.addFile = function(contents, s, file){
    var newContents = contents.substr(s.start, s.end - s.start);

        if (newContents.length > 0 && s.name != stop) {
          this.push(new File({
            cwd: file.cwd,
            base: file.base,
            path: path.dirname(file.path) + '/' + s.name,
            contents: new Buffer(newContents)
          }));
        }
  };

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      self.emit('error', new PluginError(PLUGIN_NAME, "Streams aren't supported."));
      return cb();
    }

    if (file.isBuffer()) {
      var contents = file.contents.toString(enc);
      if (typeof options.replace == 'object') {
        for (var searchValue in options.replace) {
          if (options.replace.hasOwnProperty(searchValue)) {
            contents = contents.replace(new RegExp(searchValue, 'g'), options.replace[searchValue]);
          }
        }
      }

      // detect split comments and build a list of splits
      var regex = /\s*<!--\s*split\s+(\S+)\s*-->\s*/g;
      var result, splits = [];
      while (result = regex.exec(contents)) {
        splits.push({ name: result[1], start: result.index + result[0].length });
        if (splits.length > 1) {
          splits[splits.length - 2].end = result.index;
        }
      }
      if (splits.length > 0) {
        splits[splits.length - 1].end = contents.length - 1;
      }

      // check for file without splits
      if (splits.length == 0) {
        return cb(null, file);
      }

      // create a new Vinyl file for each split with content in it
      splits.forEach(function(s) {
        if(typeof options.notExistsOnPath == 'string' && s.name != stop){

          try {
            fs.statSync(path.join(options.notExistsOnPath, s.name));
            
          } catch (error) {

            if (error.code == 'ENOENT') {
              self.addFile.call(this, contents, s, file);
            }
          }
        }else{

          self.addFile.call(this, contents, s, file); 
        }

      }.bind(this));
      return cb();
    }

    cb(null, file);
  });
}

module.exports = split;
