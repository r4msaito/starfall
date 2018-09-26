var starFall = {};

starFall.startMenu = function(game){
		this.backGroundImage;
		this.startLabel;
		this.titleLabel;

};

starFall.startMenu.prototype = {
	preload: function(){
			this.load.image('menuImage','assets/menuImage.png');
	},
	
	create: function(){
	
			this.titleLabel = this.add.text(200,200,'',{font:'20px Arial',fill:'#3c4'});
			this.titleLabel.fontSize = 45;
			this.titleLabel.text = "- Star Fall -";
			this.startLabel = this.add.text(450,500,'',{font:'20px Arial',fill:'#3c4'});
			this.startLabel.fontSize = 30;
			this.startLabel.text = "Start";
			this.startLabel.inputEnabled = true;
			this.startLabel.events.onInputDown.addOnce(this.startGame,this); 	

	},

	startGame: function(){
			this.state.start('gameState');
	}


};