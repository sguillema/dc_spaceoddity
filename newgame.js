let numberOfPlayers = 25
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
	{id:0, eventId:1, dice:20,
		outcomes:[
			{range: [1, 10], result: -1, status: null},
			{range: [11, 15], result: -2, status: null},
			{range: [16, 20], result: 0, status: null},
		]
	},
	{id:1, eventId:2, dice:20,
		outcomes:[
			{range: [1, 12], result: 0, status: "poisoned"},
			{range: [13, 20], result: 0, status: null},
		]
	},
	{id:2, eventId:3, dice:6,
		outcomes:[
			{range: [1, 3], result: -1, status: null},
			{range: [4, 6], result: 0, status: null},
		]
	},
	{id:3, eventId:4, dice:20,
		outcomes:[
			{range: [1, 3], result: 0, status: null},
			{range: [4, 14], result: 1, status: null},
			{range: [15, 18], result: 2, status: null},
			{range: [19, 20], result: 3, status: null},
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
				var rollResult = roll( 0, round.dice )
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

			}

		})
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
  return Math.floor(Math.random() * (max - min)) + min
}


/**
 * 
 * RUN THE GAME
 * 
 */

initialise()

console.log( players )