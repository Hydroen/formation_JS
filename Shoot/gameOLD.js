var game = new Phaser.Game(600,800, Phaser.CANVAS, 'shooter', {preload: fnPreload, create: fnCreate, update: fnUpdate});

function fnPreload(){
	//Chargement des assets du jeu
	console.log("Game is loading")
	game.forceSingleUpdate = true;

	var path = "img/";

	game.load.image('player',path+'playerShip.png');//path + img.png = adresse avec le nom du fichier
	game.load.image('background',path+'background.png');
	game.load.image('laser',path+'laser.png');
	game.load.image('lifeIcon',path+'lifeIcon.png');
	game.load.image('enemyGreen',path+'enemyGreen.png');
	game.load.image('enemyRed',path+'enemyRed.png');
	game.load.image('laserRed',path+'laserRed.png');

	//Nom de l'objet, pathVersImage, Width d'une frame, Height d'une frame, nombre de frame
	game.load.spritesheet('explosion',path+'explosion.png',256/4,256/4,4*4);
};

var BULLETS;
var ENEMIES;
var ENEMIES1;
var ENEMIES2;
var ENEMIESBULLETS;
var LIFEICONS;
var player;
var bkg;
var cursors;
var enemyTimer;
var anim;
var score ={
	text: "Score : ",
	value: 0
};
var scoreLabel;
var gameOver;
var accueil;
var accueilBis;
var accLoop = 0;

function fnCreate(){
	//Initialisation du jeu
	bkg = game.add.tileSprite(0,0,600,800,'background');
	player = game.add.sprite(263,700,'player');
	player.scale.x = 0.5;//première méthode de redimensionnement
	player.scale.y = 0.5;
	player.life = 3;
	player.lifeMax = 6;
	//player.scale/setTo(0.5,0.5); //seconde méthode

	game.world.setBounds(0,0,game.width,game.height); //définit les limites du jeu
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true; //Empeche le player de sortir de l'écran (Si Physics.ARCADE est défini)
	player.body.updateBounds();


	cursors = game.input.keyboard.createCursorKeys();
	game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

	BULLETS=createPool('laser', 15); //Créé la pool de lasers
	ENEMIES1=createPool('enemyGreen', 10, {x:0.5, y:0.5});// Enemies
	ENEMIES2=createPool('enemyRed', 10, {x:0.5, y:0.5});// Enemies
	ENEMIES=ENEMIES1;
	ENEMIESBULLETS=createPool('laserRed', 5);//Laser Red
	
	ENEMIES1.forEach(function(e){
		e.events.onKilled.add(explode, this);
	});

	ENEMIES2.forEach(function(e){
		e.events.onKilled.add(explode, this);
	});

	LIFEICONS = game.add.group();
	for(var i=0; i < player.lifeMax;i++){
		var l = LIFEICONS.create(game.world.width -300 + (40*i),30, 'lifeIcon'); 
			l.anchor.setTo(0.5,0.5);
	}
	for(var i=0; i < player.life;i++){
			var l = LIFEICONS.getFirstExists();
		if(l){
			l.kill();
		}
	}

	
	spawnEnemy();

	explosion = game.add.sprite(-100,-100,'explosion',16);
	explosion.scale.setTo(1.5,1.5);
	anim = explosion.animations.add('explosion');

	scoreLabel = game.add.text(10,10,score.text + score.value,{font:'34px Arial', fill:'#fff'});
	gameOver = game.add.text(game.world.centerX, game.world.centerY,'GAME OVER',{font: '84px Arial', fill:"#fff"});
	gameOver.anchor.setTo(0.5,0.5);
	gameOver.visible =false;

	accueil = game.add.text(game.world.centerX, game.world.centerY,'Accueil',{font: '84px Arial', fill:"#fff"});
	accueil.anchor.setTo(0.5,0.5);
	accueil.visible =true;

	accueilBis = game.add.text(game.world.centerX, game.world.centerY+100,'Appuyez sur une touche',{font: '42px Arial', fill:"#fff"});
	accueilBis.anchor.setTo(0.5,0.5);
	accueilBis.visible =true;
};

function createPool(img, qty, scale){
	var pool = game.add.group();
	pool=game.add.group();
	pool.enableBody = true;
	pool.physicsBodyType = Phaser.Physics.ARCADE;
	pool.createMultiple(qty, img);
	pool.setAll('checkWorldBounds', true);
	pool.setAll('outOfBoundsKill', true);

	if(scale){
		pool.setAll('scale.x', scale.x);
		pool.setAll('scale.y', scale.y);
		pool.forEach(function(e){
			e.body.updateBounds();
		})
	}

	return pool;
}

function spawnEnemy(){
	var minTime = 300, maxTime = 1200;
	var speed = game.rnd.integerInRange(100,300);
	enemyTimer = game.time.events.add(game.rnd.integerInRange(minTime,maxTime),spawnEnemy);
	if(enemyTimer.delay%2===1){
		ENEMIES=ENEMIES1;
	}else{
		ENEMIES=ENEMIES2;
	}
	//-300 + Math.random() * 600 / 0;
	var enemy = ENEMIES.getFirstExists(false);
	if(enemy){
		var posX = game.rnd.integerInRange(0,game.width);
		enemy.reset(posX,-20);
		enemy.body.velocity.setTo(0, speed);
	}
}
var firingTimer=0;

function affAcc(){
	console.log("TEST");
	game.paused  =true;
	if(game.input.onDown){
		accueil.visible =false;
		accueilBis.visible =false;
		game.paused=false;
		accLoop=0;
	}
};

function fnUpdate(){
	//Pour les opérations effectuées à chaque frame
	if(accLoop){
		affAcc();
	}
	
	bkg.tilePosition.y +=2;

	//collisions
	game.physics.arcade.overlap(BULLETS, ENEMIES1, collisionsBulletEnemy, null, this);
	game.physics.arcade.overlap(BULLETS, ENEMIES2, collisionsBulletEnemy, null, this);
	game.physics.arcade.overlap(ENEMIES1, player, enemyHitsPlayer, null, this);
	game.physics.arcade.overlap(ENEMIES2, player, enemyHitsPlayer, null, this);
	game.physics.arcade.overlap(ENEMIESBULLETS, player, enemyHitsPlayer, null, this);
	
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	if(cursors.left.isDown)
	{
		player.body.velocity.x = -300;
	}else if(cursors.right.isDown){
		player.body.velocity.x = 300;
	}

	if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		fireBullet();
	}

	if(game.time.now > firingTimer){
		enemyFire();
	}
};

//Custom methods
var bulletTime = 0;
function fireBullet(){
	if(game.time.now > bulletTime){
		var bullet = BULLETS.getFirstExists(false);
		if(bullet){
			var posx = player.x + 20;
			bullet.reset(posx, player.y -8);
			bullet.body.velocity.y = -300;
		}
		bulletTime = game.time.now + 150;
	}
};

function enemyFire(){
	var eb=ENEMIESBULLETS.getFirstExists(false);
	currentEnemies = [];

	ENEMIES.forEachAlive(function(enemy){
		if(enemy.y < 600){
			currentEnemies.push(enemy);
		}
	});

	if(eb && currentEnemies.length > 0){
		var rnd = game.rnd.integerInRange(0,currentEnemies.length -1);
		var shooter = currentEnemies[rnd];
		eb.reset(shooter.body.x, shooter.body.y);
		//objet qu'on bouge, cible, vélocité
		game.physics.arcade.moveToObject(eb,player,300);
		firingTimer = game.time.now + game.rnd.integerInRange(500,2000);
	}
};

//Callbacks
function collisionsBulletEnemy(enemy, bullet){
	bullet.kill();
	enemy.kill();

	score.value +=5;
	scoreLabel.text = score.text + score.value;
};

function enemyHitsPlayer(player,enemy){
	enemy.kill();
	var l = LIFEICONS.getFirstExists();
	if(l){
		l.kill();
	}
	player.life--;
	if(player.life <= 0){
		gameOver.visible = true;
		player.kill();
		game.paused  =true;
		console.log("Dead");
		game.input.onTap.addOnce(restart, this);
	}
};

function restart(){
	ENEMIES.callAll('kill');
	ENEMIESBULLETS.callAll('kill');
	BULLETS.callAll('kill');
	game.time.events.remove(enemyTimer);
	game.time.events.add(1000, spawnEnemy);
	player.revive();
	LIFEICONS.callAll('revive');
	player.life = 3;
	score.value = 0;
	scoreLabel.text = score.text + score.value;
	gameOver.visible = false;
	game.paused = false;
};

function explode(enemy){
	explosion.x = enemy.x - enemy.width/2;
	explosion.y = enemy.y - enemy.height/2;
	anim.play('explosion');
	if((enemy.y*enemy.x)%100<1 && player.life <= player.lifeMax){
		player.life++;
		var l = LIFEICONS.getFirstExists(false);
		if(l){
			l.revive();	
		}
	}

};