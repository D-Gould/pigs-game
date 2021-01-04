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
let players = []
let turnIndex = 0
let turnTotal = 0

function isThereAWinner() {
    let winner;
    players.forEach( function(player) {
        if (player.score >= 100) {
            winner = player
        }
    })
    return winner
}
const oinker = () => {
    // approx 1 in 30 rolls should be an oinker
    return Math.floor((Math.random() * 30)) === 1
}
const score = ([pig1, pig2]) => {
    if (pig1.name === pig2.name && pig1.name.match('Side')) {
        return 1
    } else if (pig1.name === pig2.name) {
        return (pig1.points + pig2.points)*2
    } else { 
        return pig1.points + pig2.points
    }
}
const randomRoll = () => {
    const num=Math.random();
    if(num < 0.35) return 5;  // Side probability 0.35 
    else if(num < 0.65) return 4; // Dot Side probability 0.30
    else if(num < 0.87) return 0; // Razorback probability 0.22
    else if(num < 0.96) return 1; // Trotter probability 0.09
    else if(num < 0.99) return 2; // Snouter probability 0.03
    else return 3;  // Leaning Jowler probability 0.01
}
const roll = () => {
    if (oinker()) {
        return {type: "oinker", pig1: {name: "Oinker!"}, pig2: {name: "Oinker!"}, score: 0}
    }

    // TODO: Add images into each pig
    let pigOptions = [{name: "Razorback", points: 5}, 
                    {name: "Trotter", points: 5}, 
                    {name: "Snouter", points: 10}, 
                    {name: "Leaning Jowler", points: 15}, 
                    {name: "Dot Side", points: 0}, 
                    {name: "Side", points: 0}]
    
    // TODO: figure out how to add probability into the random rolls
    const pigs = [pigOptions[randomRoll()], pigOptions[Math.floor(randomRoll())]]
    
    if (pigs.find(pig => pig.name === "Dot Side") && pigs.find(pig => pig.name === "Side")) {
        return {type: "pig out", pig1: pigs[0], pig2: pigs[1], score: 0}
    }
    const rollScore = score(pigs)
    return {type: "roll", pig1: pigs[0], pig2: pigs[1], score: rollScore}
}

function nextTurn() {
    // Add last player's turntotal to their score
    players[turnIndex].score += turnTotal
    io.sockets.emit("update score table", players)
    
    // Check if anyone has won
    const winner = isThereAWinner()    
    if (winner) {
        io.sockets.emit("winner", winner)
    }

    // Set up the next player
    turnTotal = 0
    turnIndex += 1
    turnIndex = turnIndex % players.length
    // update the board
    io.sockets.emit("update turn", players[turnIndex])
}

io.on('connection', function(socket) {
    const colors = ['red', 'green', 'blue', 'purple']
    socket.on('new player', function(name) {
        players.push({
            id: socket.id,
            color: colors[Math.floor(Math.random()*colors.length)],
            name: name,
            score: 0
        })
        io.sockets.emit('update score table', players);
        if (players.length >=2) {
            io.sockets.emit('show start button');

        }
    });
    socket.on('start game', function() {
        io.sockets.emit('turn off new players', players)
        io.sockets.emit("update turn", players[turnIndex])
    });
    socket.on('roll the pigs', function() {
        let thisRoll = roll();
        let player = players[turnIndex]
        switch (thisRoll.type) {
            case "pig out":
                turnTotal = 0
                io.sockets.emit("update turnTotal", turnTotal)
                io.sockets.emit("update roll", thisRoll)
                io.sockets.emit("pig out", player)
                break;
            case "oinker": 
                player.score = 0
                io.sockets.emit("update score table", players)
                turnTotal = 0
                io.sockets.emit("update turnTotal", turnTotal)
                io.sockets.emit("update roll", thisRoll)
                io.sockets.emit("oinker", player)
                break;
            case "roll": 
                io.sockets.emit("update roll", thisRoll)
                turnTotal += thisRoll.score
                io.sockets.emit("update turn total", turnTotal)
                break;
        }
    })
    socket.on('pass to next player', function() {
        nextTurn()
    })
    socket.on('reset game', function() {
        players = [];
        turnTotal = 0
        turnIndex = 0
        io.sockets.emit("update score table", players)
        io.sockets.emit("reset")
    })
   
})
