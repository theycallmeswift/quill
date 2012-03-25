var fs     = require('fs')
  , path   = require('path')
  , util   = require('util')
  , wrench = require('wrench')
  , _      = require('underscore');

/**
  * createSiteDirectory
  *
  * Creates the directory where the static site will exist. Removes any
  * existing directory beforehand.
  *
  * @param String directory Directory where the static site will be stored
  * @param Function callback Callback function
  */
var createSiteDirectory = function(directory, callback) {
  path.exists(directory, function(exists) {
    if(exists) {
      util.log("Removing directory: " + directory);
      wrench.rmdirSyncRecursive(directory);
    }

    fs.mkdir(directory, function() {
      util.log("Successfully created directory: " + directory);
      callback();
    });
  });
};

/**
 * copyAssets
 *
 * Copys the assets folder from the theme directory into the new static site
 * directory.
 *
 * @param String themeDirectory Directory containing the theme
 * @param String siteDirectory Directory where the compiled static site exists
 * @param Function callback Callback function
 */
var copyAssets = function(themeDirectory, siteDirectory, callback) {
  var themeAssets = path.join(themeDirectory, 'assets')
    , siteAssets = path.join(siteDirectory, 'assets');

  path.exists(themeAssets, function(exists) {
    if(!exists) {
      util.log("No assets directory found in " + themeDirectory);
      return callback();
    }

    wrench.copyDirRecursive(themeAssets, siteAssets, function() {
      util.log("Successfully copied assets");
      callback();
    });
  });
};

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

var generateHTMLFiles = function(files, layout, callback) {
  console.log("Generating HTML files");
};

var compile = function(postsDir, themeDir, callback) {
  var files
    , siteDirectory = path.join(__dirname, '..', '_site')
    , layout = path.join(themeDir, 'index.html');

  var continueCompilation = _.after(2, function() {
    util.log("Generating static HTML files");
    generateHTMLFiles(files, layout, callback);
  });

  createSiteDirectory(siteDirectory, function(err) {
    if(err) {
      return callback(err);
    }

    copyAssets(themeDir, siteDirectory, function() {
      if(err) {
        return callback(err);
      }

      continueCompilation();
    });
  });

  findPosts(postsDir, function(err, result) {
    if(err) {
      return callback(err);
    }
    files = result;

    continueCompilation();
  });
};

module.exports = {
  compile: compile
};
