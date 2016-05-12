var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'oSheet', { preload: preload, create: create, update: update, render: render });

function preload(){

	console.log("Game is loading");

	var path = "img/";
	game.load.image('background',path+'background.jpg');

}

var bkg;

function create(){

	bkg = game.add.tileSprite(0,0,1280,720,'background');

	game.input.onDown.add(toggle, this);//clic souri

}

function update(){

}

function render(){

	//game.debug.body(sprite);

}