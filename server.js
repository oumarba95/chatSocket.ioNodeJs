var http = require('http');
var md5 = require('md5');
httpServer = http.createServer(function(req,res){
    res.end('Salut');
});

httpServer.listen(8080);
var io = require('socket.io').listen(httpServer);
var users = {};
var messages = [];

io.sockets.on('connection',function(socket){

    for(var k in users){
        socket.emit('newuser',users[k]);
    }

    for(var k in messages){
        socket.emit('newmsg',messages[k]);
    }
    var me = false;
    socket.on('login',function(user){
       me = user;
       me.id = user.mail.replace('@','-').replace('.','-');
       me.avatar = 'https://gravatar.com/avatar/' +  md5(user.mail) + '?s=50';
       //socket.broadcast.emit('newuser');
       users[me.id] = me;
       io.sockets.emit('newuser',me);
    });

    socket.on('disconnect',function(){
        if(!me){
            return false;
        }

        delete users[me.id];
        io.sockets.emit('disuser',me);
    });

    socket.on('newmsg',function(message){
        message.user = me;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        messages.push(message);
        io.sockets.emit('newmsg',message);
    });
});