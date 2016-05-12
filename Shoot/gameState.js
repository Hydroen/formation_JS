var game = new Phaser.Game(600,800, PHASER.CANVAS, 'id');

var menustate = {
	perlaod: function(){},
	create: function(){},
	update: update(){}
};

var gamestate = {
	perlaod: function(){},
	create: function(){},
	update: update(){}
};

game.state.add('menu', menustate, true);
game.state.add('menu', gamestate);

menustate.update(){
	game.state.start('game', true);
}