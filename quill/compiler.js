var fs   = require('fs')
  , path = require('path');

/**
 * findPosts
 *
 * Locate all the generated post markdown files inside the posts directory.
 * Only matches filenames in the `1234567890-post-title.md`.  Returns an
 * array of file objects that have `name`, `path`, `timestamp`, and `url`
 * properties.
 *
 * @param String postsDir Directory containing all the post files
 * @param Function callback Callback function
 * @return Array
 */
var findPosts = function(postsDir, callback) {
  fs.readdir(postsDir, function(err, files) {
    var filename
      , filePath
      , key
      , match
      , results = [];

    if(err) {
      return callback(err);
    }

    for(key in files) {
      filename = files[key];
      match = filename.match(/^(\d+)-(.*).md$/)

      if(match) {
        filePath = path.join(__dirname, '..', 'posts', filename);
        results.push({
          name:      filename,
          path:      filePath,
          timestamp: match[1],
          url:       match[2].toLowerCase() + '.html'
        });
      }
    }

    return callback(false, results);
  });
};

var compile = function(postsDir, callback) {
  findPosts(postsDir, function(err, files) {
    if(err) {
      return callback(err);
    }

    console.log(files);
  });
};

module.exports = {
  compile: compile
};
