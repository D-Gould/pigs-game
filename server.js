//Dependencies
var express = require('express')
var http = require('http')
var path = require('path')
var socketIO = require('socket.io')

var app = express();
var server = http.Server(app)
var io = socketIO(server)

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
});

// Starts the server.
server.listen(5000, function() {
    console.log('Starting server on port 5000');
});

var players = {}
io.on('connection', function(socket) {
    console.log("connected!")
    const colors = ['red', 'green', 'blue', 'purple']
    let playerNumber = 1
    socket.on('new player', function(name) {
        players[socket.id] = {
            x: 300,
            y: 300,
            color: colors[Math.floor(Math.random()*colors.length)],
            name: name,
            score: 0
        }
        playerNumber += 1
        console.log("new player!", players)
        io.sockets.emit('updateScore', players);
    })

    // socket.on('movement', function(data) {
    //     var player = players[socket.id] || {};
    //     if (data.left) {
    //         player.x -= 5;
    //     }
    //     if (data.up) {
    //         player.y -=5
    //     }
    //     if (data.right) {
    //         player.x += 5;
    //     }
    //     if (data.down) {
    //         player.y +=5
    //     }
    // })
})

// setInterval(function() {
//     io.sockets.emit('state', players);
// }, 1000 / 60)