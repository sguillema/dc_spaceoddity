let numberOfPlayers = 31
let players = []
let lowestRoll = null
let lowestPlayer = null

/**
 * 
 * 
 * Define rounds and outcomes
 * 
 * 
 */
let rounds = [
	{eventId: 1, dice: 20, special: false,
		outcomes:[
			{range: [1, 10], result: -1, status: null},
			{range: [11, 15], result: -2, status: null},
			{range: [16, 20], result: 0, status: null},
		]
	},
	{eventId: 2, dice: 20, special: false,
		outcomes:[
			{range: [1, 12], result: 0, status: "poisoned"},
			{range: [13, 20], result: 0, status: null},
		]
	},
	// Instant death event
	{eventId: 3, dice: 6, special: true, dead: 1,
		outcomes:[
			{range: [1, 3], result: -1, status: null},
			{range: [4, 6], result: 0, status: null},
		]
	},
	{eventId: 4, dice: 20, special: false,
		outcomes:[
			{range: [1, 3], result: 0, status: null},
			{range: [4, 14], result: 1, status: null},
			{range: [15, 18], result: 2, status: null},
			{range: [19, 20], result: 3, status: null},
		]
	},
	{eventId: 5, dice: 6, special: false,
		outcomes:[
			{range: [1, 2], result: 0, status: null},
			{range: [3, 5], result: -1, status: null},
			{range: [6, 6], result: -3, status: null},
		]
	},
	// Instant death event
	{eventId: 6, dice: 20, special: true, dead: 2,
		outcomes:[
			{range: [1, 10], result: -5, status: "poisoned"},
			{range: [11, 20], result: -1, status: null},
		]
	},
	// Instant death event
	{eventId: 7, dice: 20, special: true, dead: 1,
		outcomes:[
		]
	},
	// Special item event
	{eventId: 8, dice: 20, special: false,
		outcomes:[
			{range: [20, 20], result: 0, status: null},
		]
	},
	{eventId: 9, dice: 6, special: false,
		outcomes:[
			{range: [1, 1], result: -1, status: null},
			{range: [2, 5], result: -3, status: null},
			{range: [6, 6], result: -5, status: null},
		]
	},
	{eventId: 9, dice: 6, special: false,
		outcomes:[
			{range: [1, 1], result: -1, status: null},
			{range: [2, 5], result: -3, status: null},
			{range: [6, 6], result: -5, status: null},
		]
	},
	{eventId: 10, dice: 20, special: false,
		outcomes:[
			{range: [1, 6], result: -2, status: null},
			{range: [7, 15], result: -3, status: null},
			{range: [16, 20], result: -5, status: null},
		]
	},
	{eventId: 11, dice: 6, special: false,
		outcomes:[
			{range: [4, 6], result: -4, status: null},
		]
	},
	{eventId: 12, dice: 20, special: false,
		outcomes:[
			{range: [7, 15], result: -2, status: null},
			{range: [16, 20], result: -5, status: null},
		]
	},
	// Final Event -- Game over
	{eventId: 13, dice: 20, special: false,
		outcomes:[
		]
	},
]

/**
 * 
 * 
 * Main game function
 * 
 * 
 */
function initialise(){
	// Initialises players for the game
	for( let i = 0; i < numberOfPlayers; i++ ) {
		players.push(
			{
				id: i,
				alive: true,
				health: 25,
				poisoned: false,
				rollResult: 0,
				history: [
					{eventId: 0, alive: true, rollResult: 0, health: 25, poisoned: false},				
				]
			}
		)
	}

	/**
	 * Main gameplay loop
	 * 
	 * Loops through each round, then loops through each player.
	 * If the looped player is alive, the game will roll based on the round's dice.
	 * The game will then compare the player's roll against the current round's outcomes.
	 * If outcome that matches the roll will then have its effect applied to that player.
	 * The game will check if the player is poisoned after and will deduct -1 hp.
	 * If the player is at 0 or less health, they will be considered dead and the game won't process them in successive loops.
	 * The current state will be saved to the player's history and the loop will resume.
	 */
	rounds.forEach(( round ) => {
		players.forEach(( player ) => {
			if( isAlive( player ) ){

				// Generate random number within the round's specified sided dice.
				var rollResult = roll( 1, round.dice )
				// Initialise local variables of player's stats for mutation.
				var health = player.health
				var poisoned = player.poisoned
				var alive = player.alive
	
				round.outcomes.forEach(( outcome ) => {
					// Checks if the rollResult is within the range of the currently looped outcome.
					if( rollResult >= outcome.range[0] && rollResult <= outcome.range[1] ){
						// Deduct or add health based on outcome result. Also apply poison if outcome results in poison status.
						health += outcome.result
						if ( outcome.status == "poisoned" ){
							poisoned = true
						}
					}
				})
				
				// Checks if poisoned.
				if( poisoned ){
					health -= 1
				}
	
				// Checks if player is alive.
				if( health <= 0 ){
					// Reset to 0 in case of overkill damage
					health = 0
					alive = false
				}
				
				// Pushes mutated player stats (caused by round outcome) to the player's history.
				player.history.push({
					eventId: round.eventId,
					alive: alive,
					rollResult: rollResult,
					health: health,
					poisoned: poisoned,
				})
				
				// Sets player's new stats based on round outcome.
				player.alive = alive
				player.health = health
				player.poisoned = poisoned
				player.rollResult = rollResult

			}

		})

		// If the round is "special", in this case it means that a player can instantly die, the game will find the lowest roll(s) that round and reduce those players/that player's health to 0.
		if( round.special == true ){
			// This will repeat for as many players that need to be killed this round. E.g. if 2, this will repeat twice.
			for(var i = 0; i < round.dead; i++){

				var lowestRollIds = []
				var lowestRoll = 0
				
				// Loops to find the lowest roll value
				players.forEach(( player ) => {
					// Sets lowest roll to first player's roll if it's equal to 0.
					// Otherwise it replaces the lowest roll if the current player's roll is the lowest yet.
					if( player.alive ){
						if( lowestRoll == 0 || player.rollResult < lowestRoll){
							lowestRoll = player.rollResult
						}
					}
				})
	
				// Loops to find players that rolled the lowest and pushes their ids to the lowestRollIds array.
				players.forEach(( player ) => {
					if( player.alive ){
						if( player.rollResult == lowestRoll ){
							lowestRollIds.push( player.id )
						}
					}
				})
	
				// If there is more than one lowest roll id, a single player will be selected randomly to have their health set to 0. 
				// Otherwise the player that rolled the lowest will have their health set to 0.
				if( lowestRollIds.length > 1 ){
					var rollResult = roll( 0, lowestRollIds.length - 1 )
					players.forEach(( player ) => {
						if( player.id == lowestRollIds[rollResult] ){
							player.health = 0
							player.alive = false
							player.rollResult = "lowest"
							player.history[player.history.length-1].alive = false
							player.history[player.history.length-1].rollResult = "lowest"
							player.history[player.history.length-1].health = 0
						}
					})
				} else {
					players.forEach(( player ) => {
						if( player.id == lowestRollIds[0] ){
							
							player.health = 0
							player.alive = false
							player.rollResult = "lowest"
							player.history[player.history.length-1].alive = false
							player.history[player.history.length-1].rollResult = "lowest"
							player.history[player.history.length-1].health = 0
						}
					})
				}
			}

		}
	})
}

function isAlive( player ){
	if (!player.alive) {
		return false
	}

	return true
}

function roll( min, max ) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}


/**
 * 
 * RUN THE GAME
 * 
 */

// initialise()

// console.log( players )

// var alive = 0
// players.forEach(( player ) => {
// 	if(player.alive){
// 		alive++
// 	}
// })
// console.log(alive)
var totalAlive = 0
var repeats = 100
for(var j = 0; j < repeats; j++){
	initialise()
	var alive = 0
	players.forEach(( player ) => {
		if(player.alive){
			alive++
		}
	})
	// console.log(alive)
	totalAlive += alive
}
var average = Math.round(totalAlive/repeats)
console.log("Average survivors in "+repeats+" simulations: "+average)