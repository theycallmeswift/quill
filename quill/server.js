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
}

var themeDir = path.join(__dirname, '..', 'themes', config.theme);
var postsDir = path.join(__dirname, '..', 'posts');

compiler.compile(postsDir, themeDir, function() {
  console.log("Site successfully compiled into _site");
});

var app = http.createServer(function(req, res) {
});

var sioApp = sio.listen(app);

sioApp.sockets.on('connection', function(socket) {
  util.log("New socket connection");
  socket.emit('connected');
});

app.on('listening', function() {
  console.log('');
  console.log('                       _/  _/  _/');
  console.log('    _/_/_/  _/    _/      _/  _/ ');
  console.log(' _/    _/  _/    _/  _/  _/  _/');
  console.log('_/    _/  _/    _/  _/  _/  _/');
  console.log(' _/_/_/    _/_/_/  _/  _/  _/');
  console.log('    _/');
  console.log('   _/');
  console.log('');
  util.log('Server listening on 0.0.0.0:8000');
});

app.listen(8000);
