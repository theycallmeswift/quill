var http   = require('http')
  , marked = require('marked')
  , sio    = require('socket.io')
  , static = require('node-static')
  , util   = require('util')
  , config = require('./config.json')
  , colors = require('colors')
  , mu = require('mu2')

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

mu.root = __dirname + '/themes/' + config.theme;
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
