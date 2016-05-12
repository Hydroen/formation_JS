var game = new Phaser.Game(600,800, Phaser.CANVAS, 'shooter', {preload: fnPreload, create: fnCreate, update: fnUpdate});

function fnPreload(){
	//Chargement des assets du jeu
	console.log("Game is loading")
	game.forceSingleUpdate = true;

	var path = "img/";

	game.load.image('player',path+'playerShip.png');//path + img.png = adresse avec le nom du fichier

	game.load.image('background',path+'background.png');

	game.load.image('laser',path+'laser.png');
	game.load.image('laserRed',path+'laserRed.png');

	game.load.image('lifeIcon',path+'lifeIcon.png');

	game.load.image('enemyGreen',path+'enemyGreen.png');
	game.load.image('enemyRed',path+'enemyRed.png');
	
	//Nom de l'objet, pathVersImage, Width d'une frame, Height d'une frame, nombre de frame
	game.load.spritesheet('explosion',path+'explosion.png',256/4,256/4,4*4);
};

var PLAYER;
var ENEMYS;


function fnCreate(){
	//Initialisation du jeu
	bkg = game.add.tileSprite(0,0,600,800,'background');
	game.world.setBounds(0,0,game.width,game.height); //définit les limites du jeu

	player = game.add.sprite(263,700,'player');
	player.scale.x = 0.5;//première méthode de redimensionnement
	player.scale.y = 0.5;
	player.life = 3;
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true; //Empeche le player de sortir de l'écran (Si Physics.ARCADE est défini)
	player.body.updateBounds();



};

function fnUpdate(){
	//Pour les opérations effectuées à chaque frame
	
};
