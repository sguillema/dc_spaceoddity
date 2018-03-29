let numberOfPlayers = 25
let players = []
let lowestRoll = null
let lowestPlayer = null

let rounds = [
	{id:0, event:1, dice:20,
		outcomes:[
			{range: [1, 10], result: -1, status: null},
			{range: [11, 15], result: -2, status: null},
			{range: [16, 20], result: 0, status: null},
		]
	},
	{id:1, event:2, dice:20,
		outcomes:[
			{range: [1, 12], result: 0, status: "poisoned"},
			{range: [13, 20], result: 0, status: null},
		]
	},
	{id:2, event:3, dice:6,
		outcomes:[
			{range: [1, 3], result: -1, status: null},
			{range: [4, 6], result: 0, status: null},
		]
	},
	{id:2, event:3, dice:20,
		outcomes:[
			{range: [1, 3], result: 0, status: null},
			{range: [4, 14], result: 1, status: null},
			{range: [15, 18], result: 2, status: null},
			{range: [19, 20], result: 3, status: null},
		]
	},
]

function initialise(){
	for(let i = 0; i < numberOfPlayers; i++) {
		players.push(
			{
				id: i,
				alive: true,
				health: 25,
				poisoned: false,
				rollResults: [],
				rollResult: null
			}
		)
	}

	rounds.forEach(( round ) => {
		players.forEach(( player ) => {
			var rollResult = roll( 0, round.dice )
			
		})
	})
}

function round( playerNumber, roundNumber ) {
	if(roundNumber == 1) {
	}
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