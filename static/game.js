var socket = io();

let gamePlayers = []
$(document).ready(function() {
    $('#startButton').click(function(event) {
        socket.emit('start game')
    })
})  
function updateScoreTable(players) {
    let scoreTable = $("#scoreTable")
    $("#scoreTable tr").remove()
    players.forEach(player =>  {
        scoreTable.append(`<tr><td>${player.name}</td><td>${player.score}</td></tr>`)
    });
}
function updateTurn(player) {
    $('#turn').show()
    $("#turnName").html(`It is ${player.name}'s turn.`)
    $("#turnTotal").html('Turn Total: 0')
}

// Allow players to join the game
let nameButton = document.getElementById('nameButton') 
nameButton.addEventListener('click', function(event) {
    let name = document.getElementById("name").value
    socket.emit('new player', name);
});

// Hide the ability to add new players // Start the game
$(document).ready(function() {
    $('#startButton').click(function(event) {
        socket.emit('start game')
    })
})  

socket.on('no new players', function() {
    $(document).ready(function() {
        $("#gamePrep").hide()
        $('#startGame').hide()
    })
})

socket.on('updatePlayers', function(players) {
    gamePlayers = players
    updateScoreTable(gamePlayers)
});

socket.on('update turn', function(player) {
    updateTurn(player)
});
