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

var players = []
io.on('connection', function(socket) {
    console.log("connected!")
    const colors = ['red', 'green', 'blue', 'purple']
    socket.on('new player', function(name) {
        players.push({
            id: socket.id,
            color: colors[Math.floor(Math.random()*colors.length)],
            name: name,
            score: 0
        })
        console.log("new player!", players)
        io.sockets.emit('updatePlayers', players);
    });
    // socket.on('players', function() {
    //     io.sockets.emit('updatePlayers', players)
    // })

   
})
