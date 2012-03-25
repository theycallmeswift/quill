var colors = require('colors')
  , compiler = require('./compiler')
  , config = require('../config.json')
  , pack = require('../package.json')
  , http   = require('http')
  , path   = require('path')
  , sio    = require('socket.io')
  , static = require('node-static')
  , util   = require('util')
  , colors = require('colors')
  , intro = require('./intro');

var debugError = function(errorMessage, data){
  if (config.development) {
    console.log('################ ERROR ##################');
    console.log(errorMessage);
    if(data) {
      console.log(data);
    }
    console.log('################ ERROR ##################');
  }
};

var themeDir = path.join(__dirname, '..', 'themes', config.theme);
var postsDir = path.join(__dirname, '..', 'posts');

compiler.compile(postsDir, themeDir, config, function(err) {
  if(err) {
    throw err;
  }

  var filePath = path.join(__dirname, '..', '_site');
  var fileServer = new static.Server(filePath);

  var app = http.createServer(function(req, res) {
    req.addListener('end', function () {
      // Treat all other requests as static file requests.
      fileServer.serve(req, res, function (err, result) {
        if (err) {
          util.log("Error serving " + req.url + " - " + err.message);

          res.writeHead(err.status, err.headers);
          res.end();
          return;
        }
      });
    });
  });

  app.on('listening', function() {
    intro();
    console.log('');
    console.log('v'.yellow + String(pack.version).yellow);
    for(var a in pack.author){
      console.log(pack.author[a].cyan);
    }
    console.log('a ' + 'HackNY'.red + ' hack');
    console.log('');
    console.log('-------------------------------------');
    console.log('Theme: ' + String(config.theme).cyan);
    console.log('-------------------------------------')
    console.log('Starting server on port 8000');
  });


  app.listen(8000);
});