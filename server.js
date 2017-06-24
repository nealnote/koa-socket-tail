const Koa = require('koa');
const Pug = require('koa-pug');

const http = require('http');
const { spawn } = require('child_process')

const staticServe = require('koa-static');
const session = require('koa-session');

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 4002;
const host = process.env.HOST || '0.0.0.0';
const { platform } = process;
const DEBUG = (env !== 'production');

const router = require('koa-router')();

const app = new Koa();
const pug = new Pug({
  viewPath: './view',
  debug: false,
  pretty: DEBUG,
  compileDebug: DEBUG,
  locals: {
    //global
  },
});

const server = http.createServer(app.callback());
const io = require('socket.io')(server);

app.keys = ['by koa socket.io'];

// socket.io
io.on('connection', (socket) => {
  const shell = spawn(platform == 'win32' ? 'cmd' : 'bash')
  const output = (msg) => {
    socket.emit('log', msg.toString());
  }
  //console.log('a user connected', socket.id);
  socket.on('disconnect', () => {
    shell.kill();
    //console.log('user disconnected', socket.id);
  });
  shell.stdout.on('data', output);
  shell.stderr.on('data', output);
  shell.on('close', () => {
    output('Exit');
    //console.log('shell close');
  });
  socket.on('input', (data) => {
    shell.stdin.write(data)
  });
})

// session
app.use(session({
  key: 'socketid',
  maxAge: 86400000
}, app));
// pug
pug.use(app);

app.use(async(ctx, next) => {
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  await next();
})

// router
router.get('/', (ctx, next) => {
  ctx.render('index.pug');
});

// router & staic
app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(staticServe('./public'));

server.listen(port, () => {
  console.log(`[INFO] Server running on http://${host}:${port}`);
});