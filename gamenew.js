// I have 13 events
// I will roll 13 times
// Each roll may not have the same chance as the last (e.g. probability out of 6, 10, and 20)
// Sample size is 25

// Implement instant kill
// track each player


let players = []
let lowestRoll = null
let lowestPlayer = null

players.forEach(function(currentPlayer) {
	if( lowestRoll == null ) {
		lowestRoll = currentPlayer.rollResult
	} else {
		if (currentPlayer.rollResult < lowestRoll) {
			lowestRoll = currentPlayer.rollResult
		}
	}
})

players.forEach(function(currentPlayer) {
	if(currentPlayer.id == lowestPlayer){
		currentPlayer.alive = false
		currentPlayer.health = 0
	}
})

function createPlayer( playerNumber ) {
	let player = {
		id: playerNumber,
		alive: true,
		health: 25,
		poisoned: false,
		rollResults: [],
		rollResult: null
	}
	return player
}

function isAlive(player){
	if (!player.alive) {
		return false
	}

	return true
}

function roll( max ) {
	return Math.floor( Math.random() * Math.floor( max ) )
}

for ( let player = 0; player < 25; player++ ) {
	players.push( createPlayer( player ) )
}

console.log(players)