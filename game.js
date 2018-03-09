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

function game( playerNumber ) {
	let player = {
		id: playerNumber,
		alive: true,
		health: 25,
		poisoned: false,
		rollResults: [],
		rollResult: null
	}


	player.rollResult = roll( 20 )
	player.rollResults.push( player.rollResult )
	
	// Event #1
	if (isAlive) {
		if ( player.rollResult <= 10) {
			player.health = player.health - 1
		} else if ( player.rollResult >= 11 && player.rollResult <= 15 ) {
			player.health = player.health - 2
		} else {
			
		}
		player.rollResult = roll( 20 )
		player.rollResults.push( player.rollResult )

		if (player.health <= 0) {
			player.alive = false
		}
	}
	
	
	// Event #2
	if (isAlive) {
		if ( player.rollResult <= 12) {
			player.poisoned = true
		} else {
			player.poisoned = false
		}

		if (player.health <= 0) {
			player.alive = false
		}
	}
	
	// Event #3
	if (isAlive) {
		player.rollResult = roll(6)
		player.rollResults.push( player.rollResult )

		if (player.rollResult <=3) {
			player.health = player.health - 1

		} else if (player.rollResult >4) {

		} else {player.health = player.health - 3

		}

		if(player.poisoned == true){
			player.health = player.health - 1
		}

		if (player.health <= 0) {
			player.alive = false
		}
	}

	// //Event #4
	// if (isAlive) {
	// 	player.rollResult = roll(20)
	// 	player.rollResults.push(player.rollResult)
	// 	if(player.rollResult <=3){

	// 	} else if (player.rollResult >=4 && player.rollResult <=14){
	// 		player.health = player.health + 1
	// 	} else if (player.rollResult >=15 && player.rollResult <=18){
	// 		player.health = player.health + 2
	// 	} else {player.health = player.health + 3
	// 	}
		
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	// //Event #5
	// if (isAlive) {
	// 	player.rollResult = roll(6)
	// 	player.rollResults.push(player.rollResult)
	// 	if(player.rollResult <=2){
	// 	} else if (player.rollResult>=3 && player.rollResult <=5){
	// 		player.health = player.health -1
	// 	} else {
	// 		player.health = player.health - 3
	// 	}
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	// //Event #6
	// if (isAlive) {
	// 	player.rollResult = roll(20)
	// 	player.rollResults.push(player.rollResult)
	// 	if(player.rollResult <=10){
	// 		player.poisoned = true 
	// 		player.health = player.health - 5
	// 	} else if (player.rollResult >=11 && player.rollResult <=20){
	// 	}
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	// //Event #7
	// if (isAlive) {
	// 	player.rollResult = roll(20)
	// 	player.rollResults.push(player.rollResult)

	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	// //Event #8 
	// if (isAlive) {
	// 	player.rollResult = roll(20)
	// 	player.rollResults.push(player.rollResult)
	// 	if(player.rollResult =20){
	// 	}
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }


	// //Event #9
	// if (isAlive) {
	// 	player.rollResult = roll(6)
	// 	player.rollResults.push(player.rollResult)
	// 	if(player.rollResult = 1){
	// 		player.health = player.health - 1
	// 	} else if (player.rollResult >=2 && player.rollResult <=5){
	// 		player.health = player.health - 3
	// 	} else {
	// 		player.health - 5
	// 	}
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	// //Event #10
	// if (isAlive) {
	// 	player.rollResult = roll(20)
	// 	player.rollResults.push(player.rollResult)
	// 	if(player.rollResult <=6){
	// 		player.health = player.health - 2
	// 	}
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	// //Event #11
	// if (isAlive) {
	// 	player.rollResult = roll(6)
	// 	player.rollResults.push(player.rollResult)
	// 	if(player.rollResult >=4){
	// 		player.health = player.health - 4
	// 	}
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	// //Event #12
	// if (isAlive) {
	// 	player.rollResult = roll(20)
	// 	player.rollResults.push(player.rollResult) 
	// 	if(player.rollResult >=7 && player.rollResult <=15){
	// 		player.health = player.health - 2
	// 	} else if (player.rollResult >=16){
	// 		player.health = player.health - 5
	// 	}
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

	
	// //Event #13
	// if (isAlive) {
	// 	player.rollResult = roll(20)
	// 	player.rollResults.push(player.rollResult) 
		
	// 	if(player.poisoned == true){
	// 		player.health = player.health - 1
	// 	}

	// 	if (player.health <= 0) {
	// 		player.alive = false
	// 	}
	// }

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
	players.push( game( player ) )
}

console.log(players)