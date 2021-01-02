var socket = io();

let gamePlayers = []

function updateScoreTable(players) {
    console.log("building score table")
    let scoreTable = document.getElementById('scoreTable') 
    scoreTable.innerHTML = ""
    players.forEach(player =>  {
        let row = scoreTable.insertRow(-1)
        let name = row.insertCell(0)
        let score = row.insertCell(1)
        name.innerHTML = player.name
        score.innerHTML = player.score
    });
}
function playGame() {

    // loop through players, give each a turn
    // loop until player chooses to "Stay" || rolls a pig out
    // while (!turnOver) {
        // display "It's Player's turn"
        // create & display Turn total
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
}
// Allow players to join the game
let nameButton = document.getElementById('nameButton') 
nameButton.addEventListener('click', function(event) {
    let name = document.getElementById("name").value
    socket.emit('new player', name);
});

// Hide the ability to add new players // Start the game
let startButton = document.getElementById('startButton') 
startButton.addEventListener('click', function(event) {
    document.getElementById('addPlayers').style.visibility = 'hidden'
    document.getElementById('startGame').style.visibility = 'hidden'
    playGame()
});


// Socket responses
// socket.on('updateScore', function() {
//     updateScoreTable(gamePlayers)
// })

socket.on('updatePlayers', function(players) {
    console.log("players = ", players)
    gamePlayers = players
    updateScoreTable(gamePlayers)
    console.log("gamePlayers = ", gamePlayers)
})

