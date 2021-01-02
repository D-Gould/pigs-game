var socket = io();


function updateScoreTable(players) {
    console.log("building score table")
    let scoreTable = document.getElementById('scoreTable') 
    scoreTable.innerHTML = ""
    for (var id in players) {
        player = players[id]
        // $("#scoreTable tbody").append("<tr>" + 
        // "<td>${player.name}</td>" +
        // "<td>${player.score}</td>" +
        // "</tr>");
        let row = scoreTable.insertRow(-1)
        let name = row.insertCell(0)
        let score = row.insertCell(1)
        name.innerHTML = player.name
        score.innerHTML = player.score
    };
}

// Allow players to join the game
let nameButton = document.getElementById('nameButton') 
nameButton.addEventListener('click', function(event) {
    let name = document.getElementById("name").value
    socket.emit('new player', name);
});

let startButton = document.getElementById('startButton') 
startButton.addEventListener('click', function(event) {
    document.getElementById('addPlayers').style.visibility = 'hidden'
    document.getElementById('startGame').style.visibility = 'hidden'
});

var canvas = document.getElementById('canvas')
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.on('updateScore', function(players) {
    updateScoreTable(players)
})


// var movement = {
//     up: false,
//     down: false,
//     left: false,
//     right: false
// }
// document.addEventListener('keydown', function(event) {
//     console.log(event.key)
//     switch (event.key) {
//         case "a": // A
//             movement.left = true;
//             break;
//         case "w": // w
//             movement.up = true;
//             break;
//         case "d": // D
//             movement.right = true;
//             break;
//         case "s": // S
//             movement.down = true;
//             break;
//     }
// })

// document.addEventListener('keyup', function(event) {
//     switch (event.key) {
//         case "a": // A
//             movement.left = false;
//             break;
//         case "w": // w
//             movement.up = false;
//             break;
//         case "d": // D
//             movement.right = false;
//             break;
//         case "s": // S
//             movement.down = false;
//             break;
//     }
// })
// setInterval(function() {
//     socket.emit('movement', movement)
// }, 1000 / 60);

// socket.on('state', function(players) {
//     context.clearRect(0, 0, 800, 600);
//     for (var id in players) {
//         var player = players[id]
//         context.fillStyle = player.color
//         context.beginPath();
//         context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
//         context.fill();
//     }
// })