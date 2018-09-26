starFall.gameOver = function(){
	this.backGroundImage;

};

starFall.gameOver.prototype = {
	preload: function(){
			this.load.image('gameOverImage','assets/gameOverImage.png');

	},

	create: function(){
			this.backGroundImage = this.add.sprite(0,0,'gameOverImage');


	}
};