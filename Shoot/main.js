var game = new Phaser.Game(600,800, Phaser.CANVAS, 'shooter');

var menuState = {
	prelaod: function(){},
	create: function(){},
	start: function(){}
};

/*	prelaod: function(){},
	create: function(){},
	update: function(){}
};^*/

game.state.add('menu', menuState, true);
//game.state.add('game', gameState);

game.state.start('menu');