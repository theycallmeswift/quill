var http   = require('http')
  , marked = require('marked')
  , sio    = require('socket.io')
  , static = require('node-static')
  , util   = require('util')
  , config = require('./config.json')
  , colors = require('colors')

var fileServer = new static.Server('./themes/barebones');

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

var app = http.createServer(function(request, response) {
  util.log("Incomming request: " + request.url);
  request.addListener('end', function () {
    // Treat all other requests as static file requests.
    fileServer.serve(request, response, function (err, result) {
      if (err) {
        debugError("Error serving " + request.url, err);

        response.writeHead(err.status, err.headers);
        response.end();
        return;
      }
    });
  });
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
