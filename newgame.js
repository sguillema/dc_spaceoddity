let numberOfPlayers = 31
let players = []
let rounds = []
let lowestRoll = null
let lowestPlayer = null

/**
 * 
 * 
 * Define events and outcomes
 * 
 * Event descriptions:
 * @event 1 asteroid collides with ship
 * @event 2 poison leaks through ship
 * @event 3 gun misfires and kills a player
 * @event 4 player gets opportunity to heal
 * @event 5 pirate ship latches onto ship, causes violent tremors
 * @event 6 encounter alien. 2 players die from this encounter. If they take damage they are poisoned
 * @event 7 alien reanimates and attacks again. No instant kill event
 * @event 8 player insists on following glow. Companion kills one player due to over suspicion
 * @event 9 player searches crates. If lucky, they get an item granting immunity to one death
 * @event 10 gas leak leads to a fiery explosion in the room
 * @event 11 you encounter pirates in the communications room and get into a scuffle
 * @event 12 the captive crew morphs into aliens and attacks the player
 * @event 13 ship has a messy landing onto nearby planet
 * @event 14 -- narrative. Chance for injuries to escalate and cause massive damage.
 * @event 15 You and your companion exit the ship. Only one player is to be left alive at this point. All but one player get shot.
 * Game over!
 * 
 * 
 */
let events = [
	{eventId: 0, dice: 20, special: false,
		outcomes:[
			{range: [1, 20], result: 0, status: null},
		]
	},
	{eventId: 1, dice: 20, special: false,
		outcomes:[
			{range: [1, 10], result: -1, status: null},
			{range: [11, 15], result: -3, status: null},
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
	{eventId: 7, dice: 20, special: false,
		outcomes:[
			{range: [1, 5], result: -2, status: "poisoned"},
			{range: [6, 10], result: -8, status: null},
			{range: [11, 15], result: -2, status: null},
			{range: [16, 20], result: 0, status: null},
		]
	},
	// Instant death event
	{eventId: 8, dice: 20, special: true, dead: 2,
		outcomes:[
			{range: [1, 20], result: 0, status: null},
		]
	},
	// Special item event
	// Note: pencil is an item that grants immunity to the next event that may kill the player.
	{eventId: 9, dice: 20, special: false,
		outcomes:[
			{range: [1, 19], result: 0, status: null},
			{range: [20, 20], result: 0, status: null, item: "pencil"},
		]
	},
	// Instant death event
	{eventId: 10, dice: 6, special: true, dead: 2,
		outcomes:[
			{range: [1, 1], result: -1, status: null},
			{range: [2, 5], result: -3, status: null},
			{range: [6, 6], result: -5, status: null},
		]
	},
	{eventId: 11, dice: 20, special: false,
		outcomes:[
			{range: [1, 6], result: -2, status: null},
			{range: [7, 15], result: -3, status: null},
			{range: [16, 20], result: -5, status: null},
		]
	},
	{eventId: 12, dice: 6, special: false,
		outcomes:[
			{range: [1, 3], result: 0, status: null},
			{range: [4, 6], result: -4, status: null},
			{range: [3, 3], result: -10, status: null},
		]
	},
	{eventId: 13, dice: 20, special: false,
		outcomes:[
			{range: [1, 6], result: 0, status: null},
			{range: [7, 15], result: -2, status: null},
			{range: [16, 20], result: -5, status: null},
		]
	},
	{eventId: 14, dice: 6, special: false,
		outcomes:[
			{range: [1, 2], result: -10, status: null},
			{range: [3, 6], result: 0, status: null},
		]
	},
	// Final Event -- Game over
	{eventId: 15, dice: 20, special: false,
		outcomes:[
			{range: [1, 20], result: 0, status: null},
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
				item: null,
				history: [
					{eventId: 0, alive: true, rollResult: 0, health: 25, poisoned: false, item: null},				
				]
			}
		)
	}

	/**
	 * Main gameplay loop
	 * 
	 * Loops through each event, then loops through each player.
	 * If the looped player is alive, the game will roll based on the event's dice.
	 * The game will then compare the player's roll against the current event's outcomes.
	 * If outcome that matches the roll will then have its effect applied to that player.
	 * The game will check if the player is poisoned after and will deduct -1 hp.
	 * If the player is at 0 or less health, they will be considered dead and the game won't process them in successive loops.
	 * The current state will be saved to the player's history and the loop will resume.
	 */
	events.forEach(( event ) => {
		players.forEach(( player ) => {
			if( isAlive( player ) ){

				// Generate random number within the event's specified sided dice.
				var rollResult = roll( 1, event.dice )
				// Initialise local variables of player's stats for mutation.
				var health = player.health
				var poisoned = player.poisoned
				var alive = player.alive
				var item = player.item
	
				event.outcomes.forEach(( outcome ) => {
					// Checks if the rollResult is within the range of the currently looped outcome.
					if( rollResult >= outcome.range[0] && rollResult <= outcome.range[1] ){
						// Deduct or add health based on outcome result. Also apply poison if outcome results in poison status.
						health += outcome.result
						if( outcome.status == "poisoned" ){
							poisoned = true
						}
						// Checks if the event outcome contains an item to be given to the player and then gives the item.
						if( !!outcome.item ){
							item = outcome.item
							console.log(player.id+" ACTUALLY GOT THE ITEM!! On event#"+event.eventId)
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
				
				// Pushes mutated player stats (caused by event outcome) to the player's history.
				player.history.push({
					eventId: event.eventId,
					alive: alive,
					rollResult: rollResult,
					health: health,
					poisoned: poisoned,
					item: item,
				})
				
				// Sets player's new stats based on event outcome.
				player.alive = alive
				player.health = health
				player.poisoned = poisoned
				player.rollResult = rollResult
				player.item = item

			}

		})

		// If the event is "special", in this case it means that a player can instantly die, the game will find the lowest roll(s) that event and reduce those players/that player's health to 0.
		if( event.special == true ){
			// This will repeat for as many players that need to be killed this event. E.g. if 2, this will repeat twice.
			for(var i = 0; i < event.dead; i++){

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

		players.forEach(( player ) => {
			if( isImmunue( player ) && !isAlive( player ) ){
				var previousState = player.history[player.history.length-2]
				var newCurrentState = previousState
				newCurrentState.eventId += 1
				// Indicate that the player was saved this turn and remove their item.
				if(newCurrentState.rollResult == "lowest"){
					newCurrentState.rollResult += "SAVED"
				} else {
					newCurrentState.rollResult = "SAVED"
				}
				newCurrentState.item = null
				
				// Set player state this turn to be the same as last turn.
				player.history[player.history.length-1] = newCurrentState
				player.alive = newCurrentState.alive
				player.health = newCurrentState.health
				player.rollResult = newCurrentState.rollResult
				player.poisoned = newCurrentState.poisoned

				// player.item = null
				player.item = null
				console.log(player.id+" was saved at event#"+event.eventId)
			}
		})

		// Compile event summary for the round
		var round = {
			eventId: event.eventId,
			playersAliveCount: 0,
			playersDeadCount: 0,
			playersAlive: [],
			playersDead: [],
		}

		players.forEach(( player ) => {
			if( isAlive( player ) ){
				round.playersAliveCount++
				round.playersAlive.push({
					id: player.id,
					health: player.health
				})
			} else {
				round.playersDeadCount++
				round.playersDead.push({
					id: player.id
				})
			}
		})

		rounds.push( round )
	})
}

function isAlive( player ){
	if ( !player.alive ) {
		return false
	}

	return true
}

function isImmunue( player ){
	if ( player.item == "pencil" ) {
		return true
	}

	return false
}

function roll( min, max ) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}


/**
 * 
 * SIMULATE GAME ONCE
 * 
 */
// initialise()

// console.log( players )

// var alive = 0
// var totalHealth = 0
// players.forEach(( player ) => {
// 	if(player.alive){
// 		alive++
// 		totalHealth += player.health
// 	}
// })
// var averageHealth = Math.round(totalHealth/alive)
// console.log("Surviving players: "+alive)
// console.log("Average health: "+averageHealth)

/**
 * 
 * SIMULATE GAME X AMOUNT OF TIMES
 * 
 */
// var totalAlive = 0
// var repeats = 1000
// for(var j = 0; j < repeats; j++){
// 	initialise()
// 	var alive = 0
// 	players.forEach(( player ) => {
// 		if(player.alive){
// 			alive++
// 		}
// 	})
// 	// console.log(alive)
// 	totalAlive += alive
// }
// var average = Math.round(totalAlive/repeats)
// console.log("Average survivors in "+repeats+" simulations: "+average)

/**
 * 
 * WRITE TO JSON FOR INSPECTION
 * 
 */
// initialise()

// var alive = 0
// var totalHealth = 0
// players.forEach(( player ) => {
// 	if(player.alive){
// 		alive++
// 		totalHealth += player.health
// 	}
// })
// var averageHealth = Math.round(totalHealth/alive)

// var game = {
// 	survivors: alive,
// 	survivorAverageHealth: averageHealth,
// 	rounds: rounds,
// 	players: players,
// }
// var json = JSON.stringify(game)
// var fs = require('fs')
// fs.writeFile('results.json', json, 'utf8', function(){
// 	console.log("Results written to 'results.json' file!")
// })

/**
 * 
 * PROCESS RESULTS
 * 
 */
var results = require('./results.json')
var roundString = `Rounds (1-15): \n\n`
results.rounds.forEach((round)=>{
	roundString += `Event: `+(round.eventId)+`\nTotal Alive: `+round.playersAliveCount+`\nTotal Dead: `+round.playersDeadCount+`\n\n`
	results.players.forEach((player)=>{
		if(player.history.length >= round.eventId){
			// round.eventId -1 because of a bug.
			var roundInfo = player.history[round.eventId-1]
			var status
			if (roundInfo.alive) {
				if (roundInfo.poisoned && roundInfo.item == null) {
					status = "POISONED"
				} else if (roundInfo.poisoned && roundInfo.item == "pencil") {
					status = "POISONED, HAS PENCIL"
				} else if (!roundInfo.poisoned && roundInfo.item == "pencil") {
					status = "HAS PENCIL"
				} else {
					status = "ALIVE"
				}
			} else {
				status = "DEAD"
			}
			var outcomeSimplified = "ERROR"
			outcomeSimplified = roundInfo.rollResult
			if(outcomeSimplified != "lowest"){
				events[round.eventId-1].outcomes.forEach(( outcome ) => {
					if( roundInfo.rollResult >= outcome.range[0] && roundInfo.rollResult <= outcome.range[1] ){
						outcomeSimplified += `(`+outcome.result+`)`
					}
				})
			} else {
				outcomeSimplified += "(Instant Death)"
			}
			roundString += `Player#`+player.id+` -- Roll(Effect): `+outcomeSimplified+` -- Health: `+roundInfo.health+` -- Status: `+status+`\n`
		} else {
			roundString += `Player#`+player.id+` -- Health: 0 -- Status: DEAD\n`
		}
	})
	roundString += `\n\n`
})

// console.log(roundString)

var fs = require('fs')
fs.writeFile('results_summary.txt', roundString, function(){
	console.log("Summary written to 'results_summary.txt' file!")
})