//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081)
    , user = require('./models/user.js')
    , db = require('./db.js');

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

server.use(express.bodyParser());

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server,{log: false});
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
        db.connect(function (err) {
                if(err != undefined){
                    console.log('Error: Unable to connect to the MySQL database.');
                }
                else{
                    if(req.session.user == undefined) {
                        console.log('You are not logged in!');
                    }
                    else {
                        console.log('Welcome, '+req.session.user+'!');
                    }
                }
        });

      
  res.render('index.jade', {
    locals : { 
              title : 'Learnit!',
              description: 'Your Page Description',
              author: 'Your Name',
              analyticssiteid: 'XXXXXXX',
              user: (req.session.user == undefined ? 'guest' : req.session.user)
            }
  });
});

server.get('/login',function(req,res) {
        res.render('login.jade', {
                locals : { 
                    title : 'Your Page Title'
                        ,description: 'Your Page Description'
                        ,author: 'Your Name'
                        ,analyticssiteid: 'XXXXXXX' 
                        }
            });
    });

server.post('/login',function(req,res) {
        var username = req.body.inputEmail;
        var password = req.body.inputPassword;
        var u = new user.model({});

        u.authenticate(username,password,function(err,success) {
                if(!success){
                    console.log('error logging in '+username+':'+password+': '+err);
                }
                else{
                    console.log(username+':'+password+' logged in successfully!');
                    req.session.user = username;
                }
                res.redirect('/');
            });
    });


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
