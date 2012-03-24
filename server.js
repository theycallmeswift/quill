var http   = require('http')
  , marked = require('marked')
  , sio    = require('socket.io')
  , static = require('node-static')
  , util   = require('util');

var fileServer = new static.Server('./public');

var app = http.createServer(function(request, response) {
  util.log("Incomming request: " + request.url);
  request.addListener('end', function () {
    // Treat all other requests as static file requests.
    fileServer.serve(request, response, function (err, result) {
      if (err) {
        util.log("Error serving " + request.url + " - " + err.message);

        response.writeHead(err.status, err.headers);
        response.end();
        return;
      }
    });
  });
});

var sioApp = sio.listen(app);

sioApp.sockets.on('connection', function(socket) {
  debugger
  util.log("New socket connection");
  socket.emit('connected');
});


app.on('listening', function() {
  util.log('Server listening on 0.0.0.0:8000');
});

app.listen(8000);
