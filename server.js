//Dependencies
var express = require('express')
var http = require('http')
var path = require('path')
var socketIO = require('socket.io')

var app = express();
var server = http.Server(app)
var io = socketIO(server)

app.set('port', 3000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
});

// Starts the server.
server.listen(3000, function() {
    console.log('Starting server on port 3000');
});

function checkForWinner() {
    players.forEach( function(player) {
        if (player.score >= 100) {
            return player
        }
    })
    console.log("check for winner works")
    return false
}

var players = []
io.on('connection', function(socket) {
    const colors = ['red', 'green', 'blue', 'purple']
    const turnIndex = 0
    socket.on('new player', function(name) {
        players.push({
            id: socket.id,
            color: colors[Math.floor(Math.random()*colors.length)],
            name: name,
            score: 0
        })
        io.sockets.emit('updatePlayers', players);
    });
    socket.on('start game', function() {
        io.sockets.emit('no new players', players)
        // loop through players, give each a turn
        // loop until player chooses to "Stay" || rolls a pig out
        console.log("Game Starting Now!")
        let turnIndex = 0;
        while (!checkForWinner()) {
            console.log("First turn")
            let turnTotal = 0
            socket.emit('update turn', players[turnIndex])
            
            // display buttons: "Throw the pigs!" "Stay"
            // if player clicks "Stay":
                // socket.emit('updateScore') - player.score += turn total
                // update score board
                // next turn
            // if player clicks "Throw the pigs":
                // throw the pigs
                // if pig out:  next turn
                // if Oinker: 
                    // socket.emit('updateScore') - player.score += turn total
                    // update score board
                    // next turn
                // else: display the throw, update Turn total
            break
    }
    });
    // socket.on('next turn', function() {
    //    turnIndex === 0 ? 0 : turnIndex++ % players.size
    //    console.log("turnIndex", turnIndex)
    //    io.sockets.emit('update turn', players[turnIndex])
    // });
   
})
