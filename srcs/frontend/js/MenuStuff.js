import * as THREE from 'three';
export class startBut 
{
	constructor() 
	{
		this.geometry = new THREE.BoxGeometry( 50, 1, 50 );
		this.material = new THREE.MeshBasicMaterial( { color: 'green' } );
		this.cube = new THREE.Mesh( this.geometry, this.material );
		this.cube.position.x = -40;
		this.startText;
	}
}

export class optionsBut 
{
	constructor() 
	{
		this.geometry = new THREE.BoxGeometry( 50, 1, 50 );
		this.material = new THREE.MeshBasicMaterial( { color: 'red' } );
		this.cube = new THREE.Mesh( this.geometry, this.material );
		this.cube.position.x = 40;
		this.optText;
	}
}

export class scoreBoard 
{
	constructor() 
	{
		this.scoreLeft;
		this.scoreRight;
		this.nickLeft;
		this.nickRight;
		this.scoreTextSize = 10;
		this.everything;
	}
}

export class endScreen 
{
	constructor() 
	{
		this.backBut;
		this.leftNick;
		this.rightNick;
		this.leftScore;
		this.rightScore;
		this.winner;
		this.announceWinner;
		this.nextBut;
		this.champ;
		this.everything;
	}
}

export class Mode
{
	constructor() 
	{
		this.gameInitialized = false;
		this.isTourney = false;
		this.leftSideText;
		this.rightSideText;
		this.volume = 0.5;
		this.darkMode = false;
	}
}

export class optionsMenu
{
	constructor()
	{
		this.optionsText;
		this.ballText;
		this.darkModeText;
		this.volumeSlider;
		this.volumeControl;
		this.volumeUpBut;
		this.volumeDownBut;
		this.volumeLabel;
		this.backBut;
		this.volumeText;
		this.soccerText;
		this.basketText;
		this.ballTextureBut;
		this.darkModeBut;
		this.onText;
		this.offText;
		this.ballSelection;
		this.everything;
	}
}

export class tourneyMenu
{
	constructor()
	{
		this.submitButton;
		this.backToSelectBut;
		this.showButton;
		this.inputBox;
		this.lockBut;
		this.startTourneyBut;
		this.statusText;
		this.playerArray = [];
		this.MatchArray = [];
		this.inPlayers;
		this.everything;
	}
}

export class Match
{
	constructor()
	{
		this.leftSide;
		this.rightSide;
		this.id;
	}
}

export class selectMenu
{
	constructor()
	{
		//Buttons
		this.oneVsOneBut;
		this.twoVsTwoBut;
		this.vsimpBut;
		this.tourneyBut;
		this.backBut;
		//Texts
		this.backText;
		this.everything;
	}
}

export class mainMenu
{
	constructor()
	{
		this.playBut;
		this.settingsBut;
		this.everything;
	}
}

export class myButton
{
	constructor(mycolor, x, y, z) 
	{
		this.geometry = new THREE.BoxGeometry( x, y, z );
		this.material = new THREE.MeshBasicMaterial( { color: mycolor } );
		this.cube = new THREE.Mesh( this.geometry, this.material );
		this.text;
	}
}