var socket = io();

// Start the game when the start button is clicked
$(document).ready(function() {
    $('#startButton').click(function(event) {
        socket.emit('start game')
    })
})  

// When "join" button is clicked, player joins the game
$(document).ready(function() {
    $('#nameButton').click(function(event) {
        let name = $("#name").val()
        socket.emit('new player', name);
    })
})

// Start the game
$(document).ready(function() {
    $('#startButton').click(function(event) {
        socket.emit('start game')
    })
})  

// Pass to next player
$(document).ready(function() {
    $('#stayButton').click(function(event) {
        socket.emit('pass to next player')
    })
})  

// Roll the Pigs
$(document).ready(function() {
    $('#rollButton').click(function(event) {
        socket.emit('roll the pigs')
    })
})  
// Show the start button
socket.on('show start button', function() {
    $(document).ready(function() {
        $("#startButton").show()
        $('#titleMessage').html("When all the players have joined, click 'Start the Game'")
    })
})
// Remove elements that allow new players to be added
socket.on('turn off new players', function() {
    $(document).ready(function() {
        $("#gamePrep").hide()
        $('#startGame').hide()
    })
})

function updateScoreTable(players) {
    let scoreTable = $("#scoreTable")
    $("#scoreTable tr").remove()
    scoreTable.append(`<tr><th>Name</th><th>Points</th></tr>`)
    players.forEach(player =>  {
        scoreTable.append(`<tr><td>${player.name}</td><td>${player.score}</td></tr>`)
    });
}
// Update score display
socket.on('update score table', function(players) {
    updateScoreTable(players)
});

function updateTurn(player) {
    $('.message').hide()
    $('#turn').show()
    $('#rollButton').show()
    $('#roll').hide()
    $('#stayButton').hide()
    $("#turnName").html(`It is ${player.name}'s turn.  `)
    $("#turnTotal").html('Turn Total: 0')
}
// Update turn display
socket.on('update turn', function(player) {
    updateTurn(player)
});

function updateRoll(roll) {
    $("#pig1Name").html(`${roll.pig1.name}`)
    $("#pig2Name").html(`${roll.pig2.name}`)
    $("#rollTotal").html(`This roll is worth ${roll.score} points`)
    $('#roll').show()
}
// Update roll display
socket.on('update roll', function(roll) {
    updateRoll(roll)
    $('#stayButton').show()

});
// Update turn total
socket.on('update turn total', function(turnTotal) {
    $("#turnTotal").html(`Turn Total: ${turnTotal}`)
});

// Oinker
socket.on('oinker', function(player) {
    $('#rollMessage').html(`${player.name} got an oinker! Total points go back to zero.`)
    $('#rollMessage').show()
    $('#rollButton').hide()
})

// Pig Out
socket.on('pig out', function(player) {
    $('#rollMessage').html(`${player.name} got a pig out! You get zero points this turn.`)
    $('#rollMessage').show()
    $('#rollButton').hide()
})
// Winner
socket.on('winner', function(player) {
    console.log("made it to winner")
    $(document).ready(function() {
        $('#turn').hide()
        $('#titleMessage').html(`${player.name} won the game!!!`)
        $('#titleMessage').show()
    })
});
// Reset the game
$(document).ready(function() {
    $(document).ready(function() {
        $('#resetButton').click(function(event) {
            console.log("reset button clicked")
            socket.emit('reset game')
        })
    })
})  
socket.on('reset', function() {
    $(document).ready(function() {
        $("#gamePrep").show()
        $('.message').html("")
        $('#turn').hide()
        $('#startGame').show()
        $('#startButton').hide()
    })
})
