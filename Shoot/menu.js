var menuState ={

	preload: function(){
		game.load.image('background',path+'background.png');
	};

	create: function(){
		bkg = game.add.tileSprite(0,0,600,800,'background');
		accueil = game.add.text(game.world.centerX, game.world.centerY,'Accueil',{font: '84px Arial', fill:"#fff"});
		accueil.anchor.setTo(0.5,0.5);
		accueil.visible =true;

		accueilBis = game.add.text(game.world.centerX, game.world.centerY+100,'Appuyez sur une touche',{font: '42px Arial', fill:"#fff"});
		accueilBis.anchor.setTo(0.5,0.5);
		accueilBis.visible =true;

		var key = game.input.keyboard.addkey(Phaser.keyboard.SPACEBACK);

		key.onDown.addOnce(this.start, this);
	};

	start: function(){
		game.state.start('game');
	};
};