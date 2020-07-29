(function($){
    var socket = io.connect('http://localhost:8080');
    var msgtpl = $('.message').html();
    $('.message').remove();
    $('#loginForm').submit(function(e){
        e.preventDefault();
        socket.emit('login',{
           username : $('#username').val(),
           mail: $('#mail').val()
        });
    });
    socket.on('newuser',function(user){
        $('.users').append('<div style="margin-bottom:10px"><img src="'+ user.avatar + '" id="'+ user.id +'"></div>')
    });
    socket.on('disuser',function(user){
       $('#'+ user.id).remove();
    });

    $('#msgForm').submit(function(e){
        e.preventDefault();
        $('#msgForm').val('');
        $('#msgForm').focus();

        socket.emit('newmsg',{ message: $('#message').val() });
    });

    socket.on('newmsg',function(message){
        $('.messages').append('<div class="message">' + Mustache.render(msgtpl,message) + '</div>');
        window.animate({scrollTop: $('.messages').prop('scrollHeight') },50);
    });
})(jQuery)