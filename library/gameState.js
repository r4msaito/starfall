var starFall = {};

starFall.gameState = function(game){ 
	this.player;
	this.map;
	this.cursors;
	this.yellowStarGroup;
	this.varToCreateYellowStar;
	this.score = 0;
	this.scoreLabel;
	this.finalScoreLabel;
	this.characterPosX = 250;
	this.characterPosY = 460;
	this.gravityFactor = 50;
	this.constantGravity = 80;
	this.gameOver;
	this.scoreVar;
	this.gameMusic;
	this.deathMusic;
	this.greenStarCollide;
	this.bulletVelocity = 700;
	this.restartImage;
	this.burst;
	this.haveBullet = false;
	this.createBullet;
	this.bulletsRemainingLabel;
	this.fireButton;
	this.shootSoundVar;
};

starFall.gameState.prototype = {
	
	preload: function(){
		/* ========== Loading all the necessary game resources ========== */
			this.load.image('yellowStar','assets/yellowStar.png');
			this.load.image('greenStar','assets/greenStar.png');
			this.load.image('tileset','assets/tilesetGround.jpg');		//Level tileset image.
			this.load.image('restartImage','assets/restartImage.png');
			this.load.image('bullet','assets/bullet.png');
			this.load.audio('levelMusic','assets/level_music.ogg','assets/level_music.mp3');
			this.load.audio('deathMusic','assets/game_over.ogg','assets/game_over.mp3');
			this.load.audio('shoot','assets/shootSound.ogg','assets/shootSound.mp3');
			this.load.audio('powerUp','assets/greenStarCollide.ogg','assets/greenStarCollide.mp3');
			this.load.spritesheet('character','assets/player.png',32,48);
			this.load.tilemap('environment','assets/level.json',null,Phaser.Tilemap.TILED_JSON); 	// Loads the JSON level tilemep.

	},

	create: function(){
			this.gameOver = false;
			this.map = this.add.tilemap('environment');		//Adds the tilemap.
			this.map.addTilesetImage('tilesetGround','tileset');
				
			this.layer = this.map.createLayer('baseLayer');
			this.layer.resizeWorld();
			this.layer.wrap = true;
			this.map.setCollision(1); 		//Adding collision properties to the ground tile.

			this.gameMusic = this.add.audio('levelMusic',1,true);
			this.gameMusic.play('',0,1,true);
			this.greenStarCollide = this.add.audio('powerUp');
			this.shootSoundVar = this.add.audio('shoot');
			
			this.scoreLabel = this.add.text(15,30,'Score -  ',{font:'20px Arial',fill:'#3c4'});
			this.bulletsRemainingLabel = this.add.text(335,30,'',{font:'20px Arial',fill:'#3c4'});

			/* ========== Enforcing physics properties ========== */
			this.physics.startSystem(Phaser.Physics.ARCADE);	// Enforcing physics properties to the environment.
			this.player = this.add.sprite(this.characterPosX,this.characterPosY,'character');		// Adding the character sprite.

			this.physics.enable(this.player,Phaser.Physics.ARCADE);
			this.player.body.bounce.y = 0.3;
			this.player.body.gravity.y = 300;
			this.player.body.collideWorldBounds = true;

			this.player.animations.add('runLeft',[0,1,2,3],15,true);
			this.player.animations.add('runRight',[5,6,7,8],15,true);
			this.player.animations.add('standStill',[4],10,true);

			/* ========== Controls ========== */
			this.cursors = this.input.keyboard.createCursorKeys();
			this.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
			this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			this.yellowStarGroup = this.add.group();
			this.yellowStarGroup.enableBody = true;

			this.burst = this.add.emitter(0,0,5);
			this.burst.minParticleScale = 0.8;
			this.burst.maxParticleScale = 1;
			this.burst.minParticleSpeed.setTo(-30,30);
			this.burst.maxParticleSpeed.setTo(30,-30);
			this.burst.makeParticles('greenStar');

			this.time.events.loop(this.rnd.integerInRange(150,250),this.createYellowStar,this);
			this.scoreVar = this.time.events.loop(100,this.displayScore,this);
			this.time.events.loop(this.rnd.integerInRange(3000,4000),this.burstGreenStar,this);
			this.time.events.loop(100,this.incrementGravity,this);

	},

	update: function(){
			this.physics.arcade.overlap(this.player,this.yellowStarGroup,this.gameOverState,null,this);
		 	this.physics.arcade.collide(this.player,this.layer);		//Collide player and layer.
		 	this.physics.arcade.collide(this.createBullet,this.yellowStarGroup);
		 	this.physics.arcade.collide(this.createBullet,this.yellowStarGroup,this.handleBulletCollision,null,this);
		 	this.physics.arcade.overlap(this.player,this.burst,this.handleBurst,null,this);
			this.fireButton.onDown.add(this.shootBullet, this);


			/* ========== Manipulating character animations ========== */
			if(this.cursors.left.isDown){
				this.player.body.velocity.x = -150;
				this.player.animations.play('runLeft');
			}
			
			else if(this.cursors.right.isDown){
				this.player.body.velocity.x = 150;
				this.player.animations.play('runRight');
			}
			
			else{
				this.player.body.velocity.x = 0
				this.player.animations.play('standStill');
			}		
			
	},

	createYellowStar: function(){
			if(this.gameOver == false){
				this.varToCreateYellowStar = this.yellowStarGroup.create(this.rnd.integerInRange(0,520),this.rnd.integerInRange(0,80),'yellowStar');
				this.varToCreateYellowStar.body.gravity.y = this.gravityFactor;	
			}
					
	},

	displayScore: function(){
			if(this.gameOver == false){
				this.score++;
				this.scoreLabel.text = "Score " +this.score;
			}
			
	},

	burstGreenStar: function(){
			if(this.gameOver == false){
				this.burst.emitX = this.rnd.integerInRange(0,520);
				this.burst.emitY = this.rnd.integerInRange(0,80);
				this.burst.start(true,5000,null,this,2);
			}
	},

	handleBurst: function(){
			if(this.gameOver == false){
				this.haveBullet = true;
				this.numOfBullets = 10;
				this.gravityFactor = this.gravityFactor - 10;
			}
	},

	incrementGravity: function(){
			this.gravityFactor++;
	},

	shootBullet: function(){
			if(this.gameOver == false && this.haveBullet == true && this.numOfBullets > 0){
				this.shootSoundVar.play();
				this.bulletsRemainingLabel.text = "Bullets remaining: "+10;
				this.createBullet = this.add.sprite(this.player.x,this.player.y + 5,'bullet');
				this.physics.enable(this.createBullet,Phaser.Physics.ARCADE);
				this.createBullet.body.velocity.y =  -this.bulletVelocity;
				this.numOfBullets--;
				this.bulletsRemainingLabel.text = "Bullets remaining: "+this.numOfBullets;
				

			}
			
	},

	handleBulletCollision: function(){
			this.createBullet.kill();
			this.varToCreateYellowStar.kill();
	},


	gameOverState: function(){
			this.player.kill();
			this.varToCreateYellowStar.kill();
			this.gameOver = true;
			this.scoreLabel.destroy();
			this.bulletsRemainingLabel.destroy();
			this.time.events.remove(this.scoreVar);
			this.finalScoreLabel = this.add.text(165,220,'',{font:'20px Arial',fill: '#8c4'});
			this.finalScoreLabel.fontSize = 35;
			this.finalScoreLabel.text = "- Your Score -\n\t\t\t\t\t\t\t "+this.score;
			this.gameMusic.stop();
			this.numOfBullets = 0;
			this.deathMusic = this.add.audio('deathMusic');
			this.deathMusic.play();	

			this.restartImage = this.add.sprite(185,330,'restartImage');
			this.restartImage.inputEnabled = true;
			this.restartImage.events.onInputDown.addOnce(this.restartGame,this);

	},

	restartGame: function(){
			this.gameOver = true;
			this.score = 0;
			this.gravityFactor = 50;
			this.deathMusic.stop();
			this.state.start('gameState');
	}

};
