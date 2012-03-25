var fs   = require('fs')
  , path = require('path');

var createSiteDirectory = function() {};
var copyAssets = function() {};

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

var compile = function(postsDir, themeDir, callback) {
  var completeFunctionCounter = 0
    , files
    , siteDirectory = path.join(__dirname, '..', '_site');

  var continueCompilation = function() {
    if(completeFunctionCounter == 2) {
      console.log("Generating HTML files");
      return generateHTMLFiles(files, template, callback);
    }
    console.log("Not generating HTML files");
  };

  createSiteDirectory(siteDirectory, function(err) {
    if(err) {
      return callback(err);
    }

    copyAssets(themeDir, siteDir, function() {
      if(err) {
        return callback(err);
      }

      completeFunctionCounter += 1;
      continueCompilation();
    });
  });

  findPosts(postsDir, function(err, result) {
    if(err) {
      return callback(err);
    }
    files = result;

    completeFunctionCounter += 1;
    continueCompilation();
  });
};

module.exports = {
  compile: compile
};
