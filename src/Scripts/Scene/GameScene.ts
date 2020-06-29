import * as Phaser from "phaser";
import Character from "../Objects/Character";
import * as StaticObjects from "../Objects/StaticObjects";
import Score from "../Objects/Score"

export default class GameScene extends Phaser.Scene {

  private scoreText: Score;
  private instructionText: Phaser.GameObjects.Text;
  private gameOverText: Phaser.GameObjects.Text;

  private character: Character;
  private staticObjects: StaticObjects.default;
  
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private swipe: Phaser.Input.Pointer;
  
  private gameOver: boolean = false;
  private disableInput: boolean = false;
  
  private parallaxLayer: Map<string, Phaser.GameObjects.TileSprite> = new Map();

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
    this.physics.world.setBounds(0,0,this.cameras.main.width+1000,this.cameras.main.height);

    // Create inputs(cursor for keyboar, swipe for touchscreen)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.swipe = this.input.activePointer;

    this.gameOver = false;

    // Create animations
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers("runner", {start: 2, end: 3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'slide',
      frames: this.anims.generateFrameNumbers("runner", {start: 6, end: 6}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers("runner", {start: 1, end: 1}),
      frameRate: 10,
      repeat: -1
    });
  }

  create(): void {
    this.createParallaxBackground();
    this.createText();
    
    this.character = new Character(this, this.cameras.main.width/3.5, (this.cameras.main.height/1.5)-(64+96/2));
    this.character.anims.load('run');
    this.character.anims.load('slide');
    this.character.anims.load('jump');
    
    this.staticObjects = new StaticObjects.default(this.physics.world,this);
  }

  update(): void {

    this.animateParallaxBg();
    this.staticObjects.update();
    
    if(!this.character.isDead){
      // Collision and Overlap
      this.physics.collide(this.character,this.staticObjects.grounds[0],this.playerTouchingGround,null,this);
      this.physics.overlap(this.character,this.staticObjects.blades,this.playerHit,null,this);
      this.physics.overlap(this.character,this.staticObjects.spikes,this.playerHit,null,this);

      // Collision for coin is set on each element, not the whole group
      var coinChildren = this.staticObjects.coin.getChildren();
      for(var i=0; i<coinChildren.length;i++){
        var coin = <Phaser.GameObjects.Sprite>coinChildren[i];
        this.physics.overlap(this.character,coin,function(){this.bonusPoint(coin)},null,this);
      }

      this.handleInputs();
      this.enableInput();

    } else {
      if(!this.gameOver){
        this.disableInput = true;
        this.character.setVelocityY(-300);
        this.character.body.setCollideWorldBounds(false);
        this.character.play('jump');
        
        this.staticObjects.playAnimation(false);
        this.time.removeAllEvents();

        this.time.addEvent({
          delay: 750,
          callback: () => {
            this.add.existing(this.gameOverText);
            this.disableInput = false;
          }
        });

        this.gameOver = true;
      }
      this.handleRestartInput();
    }
  }

  handleRestartInput(): void{
    if((this.cursors.space.isDown || this.swipe.isDown) && !this.disableInput){
      this.scene.start("GameScene");
    }
  }

  handleInputs(): void {
    if(this.disableInput){
      return;
    }
    
    var swipeDistance = this.swipe.prevPosition.y - this.swipe.position.y;

    if ((this.cursors.up.isDown && !this.character.isSliding && this.character.onGround) || 
    this.swipe.isDown && swipeDistance > 50)
    {
      this.character.jump();
      this.disableInput = true;
    }
    else if ((this.cursors.down.isDown && !this.character.isJumping || 
      this.swipe.isDown && swipeDistance < -50))
    {
      this.character.slide();
      this.disableInput = true;
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.character.stand();
        }
      });
    }
  }

  createText(): void{
    this.scoreText = new Score(this,0,{
      fontFamily: 'Courier',
      fontSize: '64px',
      color: '#000',
      stroke: '#000',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      fixedWidth: this.cameras.main.width
    });

    this.instructionText = new Phaser.GameObjects.Text(this,0,10,'Swipe/Arrow Up to Jump\nSwipe/Arrow Down to Slide\n\nGreen Diamond: +50 points',{
      fontFamily: 'Courier',
      fontSize: '20px',
      color: '#000',
      stroke: '#000',
      align: 'left',  // 'left'|'center'|'right'|'justify'
    });
    this.instructionText.depth = 11;
    this.add.existing(this.instructionText);

    this.gameOverText = new Phaser.GameObjects.Text(this,0,this.cameras.main.height/3,'GAME OVER\n\nTouch Screen or Press Space to Restart',{
      fontFamily: 'Courier',
      fontSize: '32px',
      color: '#000',
      stroke: '#000',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      fixedHeight: this.cameras.main.height,
      fixedWidth: this.cameras.main.width,
    });
    this.gameOverText.depth = 11;
    
  }

  createParallaxBackground(): void{
    var layer: Phaser.GameObjects.TileSprite = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,'sky');
    layer.setOrigin(0,0);
    layer.setTileScale(2,2.2);
    this.parallaxLayer.set('sky', layer);

    layer = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,'cloud_lonely');
    layer.setOrigin(0,0);
    layer.setScrollFactor(0);
    layer.setTileScale(2,2.2);
    layer.depth = 1;
    this.parallaxLayer.set('cloud_lonely', layer);

    layer = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,'cloud_bg');
    layer.setOrigin(0,0);
    layer.setScrollFactor(0);
    layer.setTileScale(2,2.2);
    layer.depth = 2;
    this.parallaxLayer.set('cloud_bg', layer);

    layer = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,'cloud_mg_1');
    layer.setOrigin(0,0);
    layer.setScrollFactor(0);
    layer.setTileScale(2,2.2);
    layer.depth = 6;
    this.parallaxLayer.set('cloud_mg_1', layer);

    layer = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,'cloud_mg_2');
    layer.setOrigin(0,0);
    layer.setScrollFactor(0);
    layer.setTileScale(2,2.2);
    layer.depth = 5;
    this.parallaxLayer.set('cloud_mg_2', layer);

    layer = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,'cloud_mg_3');
    layer.setOrigin(0,0);
    layer.setScrollFactor(0);
    layer.setTileScale(2,2.2);
    layer.depth = 4;
    this.parallaxLayer.set('cloud_mg_3', layer);

    layer = this.add.tileSprite(0,0,this.cameras.main.width,this.cameras.main.height,'glacial_mountains');
    layer.setOrigin(0,0);
    layer.setScrollFactor(0);
    layer.setTileScale(2,2.2);
    layer.depth = 3;
    this.parallaxLayer.set('glacial_mountains', layer);

    this.parallaxLayer.forEach((layer: Phaser.GameObjects.TileSprite) => {
      this.add.existing(layer);
    });

  }

  animateParallaxBg(): void{
    if(this.character.isDead){
      return;
    }
    this.parallaxLayer.forEach((layer: Phaser.GameObjects.TileSprite, key: string) => {
      switch(key){
        case 'cloud_lonely':
          layer.tilePositionX += 0.1;
          break;
        case 'glacial_mountains':
          layer.tilePositionX += 0.2;
          break;
        case 'cloud_bg':
          layer.tilePositionX += 0.1;
          break;
        case 'cloud_mg_1':
          layer.tilePositionX += 0.5;
          break;
        case 'cloud_mg_2':
          layer.tilePositionX += 0.4;
          break;
        case 'cloud_mg_3':
          layer.tilePositionX += 0.3;
          break;
      }
    });
  }

  enableInput(): void {
    if(!this.cursors.up.isDown && !this.cursors.down.isDown && this.character.isStanding()){
      this.disableInput = false;
    }
  }

  playerTouchingGround(): void{
    if(this.character.isDead){
      return;
    }
    if(!this.character.onGround){
      this.character.stand();
      this.enableInput();
    }
    this.character.onGround = true;
  }

  playerHit(): void{
    if(this.character.isDead){
      return;
    }
    this.character.isDead = true;
    this.sound.play('bonk');
  }

  bonusPoint(coin: StaticObjects.Coin): void{
    if(!coin.taken){
      this.scoreText.value += 50;
    }
    coin.destroy();
    this.sound.play('coin');
  }

}
  