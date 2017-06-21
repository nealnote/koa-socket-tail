// src/main.js
import foo from './foo.js';

export default function() {
  var socket = io();
  var $message = $('#message');
  socket.on('log', (msg)=>{
    $message.append(
      $('<li></li>').text(msg)
    );
  })
}