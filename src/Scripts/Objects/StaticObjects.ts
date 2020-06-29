import * as Phaser from "phaser";
import BladesGroup, { Blade } from "./Blade";

export default class StaticObjects{
    public grounds: Phaser.GameObjects.TileSprite[] = [null,null];
    public blades: Phaser.Physics.Arcade.Group;
    public spikes: Phaser.Physics.Arcade.Group;
    public coin: Phaser.Physics.Arcade.Group;
    public obstaclesFactory: Phaser.Time.TimerEvent;
    
    private world: Phaser.Physics.Arcade.World;
    private scene: Phaser.Scene;
    private allowAnimation: boolean = true;

    constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene){
      this.world = world;
      this.scene = scene;

      this.grounds[0] = new Phaser.GameObjects.TileSprite(
        scene,
        0,(scene.cameras.main.height/1.5),
        scene.cameras.main.width*2,64,
        'tiles',16);

      this.grounds[1] = new Phaser.GameObjects.TileSprite(
        scene,
        0,(scene.cameras.main.height/1.5)+160,
        scene.cameras.main.width*2,256,
        'tiles',17);

      for(var i=0;i<2;i++){
        scene.add.existing(this.grounds[i]);
        var layer = scene.physics.add.existing(this.grounds[i]);
        var layerBody: Phaser.Physics.Arcade.Body = layer.body;
        layerBody.allowGravity = false;
        layerBody.immovable = true;
        this.grounds[i].depth = 10;
      }

    
      this.blades = new Phaser.Physics.Arcade.Group(this.world,this.scene,{
        classType: Blade,
        defaultKey: 'blades',
        maxSize: 3,
        runChildUpdate: true
      });
      this.blades.createMultiple({
        active: false,
        quantity: 3,
        key: 'blade',
        repeat: this.blades.maxSize-1
      })
      this.blades.setDepth(10);

      this.spikes = new Phaser.Physics.Arcade.Group(this.world,this.scene,{
        classType: Spike,
        defaultKey: 'spikes',
        maxSize: 3,
        runChildUpdate: true
      });
      this.spikes.createMultiple({
        active: false,
        quantity: 3,
        key: 'spike',
        repeat: this.spikes.maxSize-1
      })
      this.spikes.setDepth(10);

      this.coin = new Phaser.Physics.Arcade.Group(this.world,this.scene,{
        classType: Coin,
        defaultKey: 'coin',
        maxSize: 3,
        runChildUpdate: true
      });
      this.coin.createMultiple({
        active: false,
        quantity: 3,
        key: 'coin',
        repeat: this.coin.maxSize-1
      })
      this.coin.setDepth(10);
      var coinChildren = this.coin.getChildren();
      for(var i=0; i<coinChildren.length;i++){
        var coin: Phaser.GameObjects.Sprite = coinChildren[i];
        var coinBody: Phaser.Physics.Arcade.Body = coin.body;
        coinBody.setSize(coinBody.width/2,coinBody.height/2);
      }

      this.scene.time.addEvent({
        delay: 1500,
        loop: true,
        callback: () => {
          var random = Math.random()*3;
          // var random = 3;
          if(random<1){
            this.generateObstacles(this.blades, 'blade');
          } else if (random>=1 && random < 2) {
            this.generateObstacles(this.spikes, 'spike');
          } else {
            this.generateObstacles(this.coin, 'coin');
          }
        }
      });

    }

    generateObstacles(group: Phaser.Physics.Arcade.Group, key: string): void{
      var obstacle: Phaser.GameObjects.Sprite = group.get();
      
      if(obstacle){
        if(key == 'blade' || key == 'coin'){
          obstacle.setPosition(1300,360);
        } else if (key == 'spike'){
          obstacle.setPosition(1300,420);
        }
        obstacle.setActive(true);
        obstacle.setVisible(true);
      }
    }

    playAnimation(allow: boolean): void{
      this.allowAnimation = allow;
    }

    animate(): void{
      if(!this.allowAnimation){
        this.blades.setVelocityX(0);
        this.spikes.setVelocityX(0);
        this.coin.setVelocityX(0);
        return;
      }
      this.blades.rotate(-0.1);
      this.blades.setVelocityX(-300);
      this.spikes.setVelocityX(-300);
      this.coin.setVelocityX(-300);
      this.grounds[0].tilePositionX += 5;
      this.grounds[1].tilePositionX += 5;
    }

    update(): void{
      this.animate();
    }
}

class Blade extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, spritesheet: string) {
    super(scene, x, y, 'tiles', 25);
  }

  preUpdate(time, delta){
    super.preUpdate(time, delta);
    if (this.body.x <= -64){
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class Spike extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, spritesheet: string) {
    super(scene, x, y, 'tiles', 57);
  }

  preUpdate(time, delta){
    super.preUpdate(time, delta);
    if (this.body.x <= -64){
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

export class Coin extends Phaser.Physics.Arcade.Sprite {
  public taken: boolean = false;
	constructor(scene, x, y, spritesheet: string) {
    super(scene, x, y, 'tiles', 51);
  }

  preUpdate(time, delta){
    super.preUpdate(time, delta);
    if (this.body.x <= -64){
      this.setActive(false);
      this.setVisible(false);
    }
  }

  destroy(): void{
    this.taken = true;
    this.setActive(false);
    this.setVisible(false);
  }
}