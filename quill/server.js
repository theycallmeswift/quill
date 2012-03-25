var colors = require('colors')
  , compiler = require('./compiler')
  , config = require('../config.json')
  , http   = require('http')
  , mu     = require('mu2')
  , path   = require('path')
  , sio    = require('socket.io')
  , static = require('node-static')
  , util   = require('util');

var debugError = function(errorMessage, data){
  if (config.development) {
    console.log('################ ERROR ##################'.red);
    console.log(errorMessage);
    if(data) {
      console.log(data);
    }
    console.log('################ ERROR ##################'.red);
  }
}

var bigQuill = function() {
  console.log('');
  console.log('                       _/  _/  _/'.green);
  console.log('    _/_/_/  _/    _/      _/  _/ '.green);
  console.log(' _/    _/  _/    _/  _/  _/  _/'.green);
  console.log('_/    _/  _/    _/  _/  _/  _/'.green);
  console.log(' _/_/_/    _/_/_/  _/  _/  _/'.green);
  console.log('    _/'.green);
  console.log('   _/'.green);
  console.log('');
}

var themeDir = path.join(__dirname, '..', 'themes', config.theme);
var postsDir = path.join(__dirname, '..', 'posts');

compiler.compile(postsDir, themeDir, function() {
  console.log("Site successfully compiled into _site");
});

mu.root = path.join(__dirname, '..', 'themes', config.theme);
var app = http.createServer(function(req, res) {
  if (config.development) {
    mu.clearCache();
  }
  var stream = mu.compileAndRender('index.html', {name: "john"});
  util.pump(stream, res);
});

var sioApp = sio.listen(app);

sioApp.sockets.on('connection', function(socket) {
  util.log("New socket connection");
  socket.emit('connected');
});

app.on('listening', function() {
  bigQuill();
  util.log('Server listening on 0.0.0.0:8000');
});

app.listen(8000);
