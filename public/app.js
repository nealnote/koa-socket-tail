var app = (function () {
'use strict';

// src/foo.js

// src/main.js
var main = function() {
  var socket = io();
  var $message = $('#message');
  socket.on('log', (msg)=>{
    $message.append(
      $('<li></li>').text(msg)
    );
  });
};

return main;

}());
