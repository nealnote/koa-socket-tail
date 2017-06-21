// src/main.js
import foo from './foo.js';

const socket = io();
const $message = $('#message');
const $cmd = $('#cmd');

function escapeHtml(html){
  return html.replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
}
function output(data){
  $message.append(`${escapeHtml(data)}\n`).scrollTop(9e6);
}

export default function() {
  socket.on('log', output);
  $cmd.on('keypress', (e) => {
    var data = $cmd.val();
    if(e.keyCode == 13){
      socket.emit('input', `${data}\n`);
      $cmd.val('');
    }
  })
}