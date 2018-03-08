// I have 13 events
// I will roll 13 times
// Each roll may not have the same chance as the last (e.g. probability out of 6, 10, and 20)
// Sample size is 25
function game( player ) {
	let health = 25
	let poisoned = false
	let rollResults = []

	let rollResult = roll( 20 )
	rollResults.push( rollResult )
	
	// Event #1
	if ( rollResult <= 10) {
		health = health - 1
	} else if ( rollResult >= 11 && rollResult <= 15 ) {
		health = health - 2
	} else {
		
	}
	
	rollResult = roll( 20 )
	rollResults.push( rollResult )
	
	// Event #2
	if ( rollResult <= 12) {
		poisoned = true
	} else {
		poisoned = false
	}
	
	// Event #3
	rollResult = roll(6)
	rollResults.push( rollResult )

	if (rollResult <=3) {
		health = health - 1

	} else if (rollResult >4) {

	} else {health = health - 3

	}

	if(poisoned == true){
		health = health - 1
	}

	//Event #4
	rollResult = roll(20)
	rollResults.push(rollResult)
	if(rollResult <=3){

	} else if (rollResult >=4 && rollResult <=14){
		health = health + 1
	} else if (rollResult >=15 && rollResult <=18){
		health = health + 2
	} else {health = health + 3
	}
	
	if(poisoned == true){
		health = health - 1
	}

	//Event #5
	rollResult = roll(6)
	rollResults.push(rollResult)
	if(rollResult <=2){
	} else if (rollResult>=3 && rollResult <=5){
		health = health -1
	} else {
		health = health - 3
	}
	if(poisoned == true){
		health = health - 1
	}

	//Event #6
	rollResult = roll(20)
	rollResults.push(rollResult)
	if(rollResult <=10){
		poisoned = true 
		health = health - 5
	} else if (rollResult >=11 && rollResult <=20){
	}
	if(poisoned == true){
		health = health - 1
	}

	//Event #7
	rollResult = roll(20)
	rollResults.push(rollResult)

	if(poisoned == true){
		health = health - 1
	}


	//Event #8 
	rollResult = roll(20)
	rollResults.push(rollResult)
	if(rollResult =20){
	}
	if(poisoned == true){
		health = health - 1
	}


	//Event #9
	rollResult = roll(6)
	rollResults.push(rollResult)
	if(rollResult = 1){
		health = health - 1
	} else if (rollResult >=2 && rollResult <=5){
		health = health - 3
	} else {
		health - 5
	}
	if(poisoned == true){
		health = health - 1
	}

	//Event #10
	rollResult = roll(20)
	rollResults.push(rollResult)
	if(rollResult <=6){
		health = health - 2
	}
	if(poisoned == true){
		health = health - 1
	}

	//Event #11
	rollResult = roll(6)
	rollResults.push(rollResult)
	if(rollResult >=4){
		health = health - 4
	}
	if(poisoned == true){
		health = health - 1
	}

	//Event #12
	rollResult = roll(20)
	rollResults.push(rollResult) 
	if(rollResult >=7 && rollResult <=15){
		health = health - 2
	} else if (rollResult >=16){
		health = health - 5
	}
	if(poisoned == true){
		health = health - 1
	}

	
	//Event #13
	rollResult = roll(20)
	rollResults.push(rollResult) 
	
	if(poisoned == true){
		health = health - 1
	}


	
	return "Player "+player+": "+health+"; Poisoned: "+poisoned+"; Result: "+rollResults
}

function roll( max ) {
	return Math.floor( Math.random() * Math.floor( max ) )
}

for ( let i = 0; i < 25; i++ ) {
	console.log( game(i) )
	// console.log( roll( 10 ) )
}