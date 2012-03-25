var compiler = require('./compiler')
  , config = require('../config.json')
  , http   = require('http')
  , path   = require('path')
  , sio    = require('socket.io')
  , static = require('node-static')
  , util   = require('util');

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

compiler.compile(postsDir, themeDir, function() {

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
    console.log('');
    console.log('                       _/  _/  _/'.green);
    console.log('    _/_/_/  _/    _/      _/  _/ '.green);
    console.log(' _/    _/  _/    _/  _/  _/  _/'.green);
    console.log('_/    _/  _/    _/  _/  _/  _/'.green);
    console.log(' _/_/_/    _/_/_/  _/  _/  _/'.green);
    console.log('    _/'.green);
    console.log('   _/'.green);
    console.log('');
    util.log('Server listening on 0.0.0.0:8000');
  });


  app.listen(8000);
});
