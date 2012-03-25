var socket = io.connect('/');
socket.on('connected', function() {
  var divs = document.getElementsByTagName('div')
    , i
    , lastPost = 0;

  for(i = 0; i < divs.length; i++) {
    if(divs[i].className && divs[i].className.indexOf('_post') !== -1) {
      lastPost = divs[i].id;
      break;
    }
  }
   this.emit('update', lastPost);
});

socket.on('update', function(files) {
  var newElement = '<a href="javascript:location.reload(true)" id="new-post-notice">A new post has been made! <br /><small>Click here to see it.</small></a>';
  var bodyElement = document.body;
  bodyElement.innerHTML = newElement + bodyElement.innerHTML;
});
