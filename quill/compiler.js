var fs     = require('fs')
  , hbs    = require('handlebars')
  , marked = require('marked')
  , path   = require('path')
  , util   = require('util')
  , wrench = require('wrench');

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
  path.exists(themeDirectory, function(exists) {
    if(!exists) {
      debugger
      return callback(new Error("Error: Theme does not exist"));
    }

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
  });
};

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
      match = filename.match(/^(\d+)-(.*).md$/);

      if(match) {

        filePath = path.join(__dirname, '..', 'posts', filename);
        results.push({
          title:     humanized(match[2]),
          name:      filename,
          path:      filePath,
          timestamp: match[1] * 1000,
          url:       match[2].toLowerCase() + '.html'
        });
      }
    }

    console.log(results);

    return callback(false, results);
  });
};

var generateHTMLFiles = function(files, layout, outputDir, config, callback) {
  var counter = 0
    , compileCompleted
    , compiledTemplate
    , layoutHTML
    , file
    , fileStream
    , outputFilename
    , resultsArray;


  compileCompleted = function() {
    counter += 1;
    if(counter == files.length) {
      util.log("Generating static HTML files");
      callback();
    }
  };

  marked.setOptions({
    gfm: true,
    pedantic: false,
    sanitize: false
  });

  fs.readFile(layout, function(err, layoutBuffer) {
    if(err) {
      return callback(err);
    }

    compiledTemplate = hbs.compile(layoutBuffer.toString());

    for(var key in files) {
      file = files[key];
      fs.readFile(file.path, function(err, data) {
        if(err) {
          return callback(err);
        }

        var pageArray = [];
        pageArray.push({
          title: file.title,
          body: "<div class='post' id='" + file.timestamp + "'>" + marked(data.toString()) + "</div>",
          timestamp: file.timestamp,
          url: file.url
        });

        layoutHTML = compiledTemplate({ config: config, posts: pageArray });

        outputFilename = path.join(outputDir, file.url);
        var fileRes = fs.writeFile(outputFilename, layoutHTML, function(err) {
          if(err) {
            return callback(err);
          }
          compileCompleted();
        });
      });
    }
  });
};

var humanized = function(string) {

  var terms = string.split('-');

  for(var i=0; i < terms.length; i++){
    terms[i] = terms[i].toLowerCase().charAt(0).toUpperCase() + terms[i].slice(1);
  }

  return terms.join(' ');
}

var compile = function(postsDir, themeDir, siteConfig, callback) {
  var counter = 0
    , files
    , siteDirectory = path.join(__dirname, '..', '_site')
    , layout = path.join(themeDir, 'index.html');

  findPosts(postsDir, function(err, result) {
    if(err) {
      return callback(err);
    }
    files = result;

    createSiteDirectory(siteDirectory, function(err) {
      if(err) {
        return callback(err);
      }

      copyAssets(themeDir, siteDirectory, function(err) {
        if(err) {
          return callback(err);
        }

        generateHTMLFiles(files, layout, siteDirectory, siteConfig, function(err) {
          if(err) {
            return callback(err);
          }
          util.log("Site successfully compiled into _site");
          callback(err);
        });
      });
    });
  });
};

module.exports = {
  compile: compile
};
