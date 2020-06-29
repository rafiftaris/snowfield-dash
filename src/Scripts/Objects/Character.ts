import * as Phaser from "phaser";

export default class Character extends Phaser.Physics.Arcade.Sprite {
    public isJumping: boolean = false;
    public isSliding: boolean = false;
    public isDead: boolean = false;
    public onGround: boolean = false;
    public body: Phaser.Physics.Arcade.Body;
    
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y, "runner", 1);

        this.scene.add.existing(this);

        scene.physics.add.existing(this);

        this.setInteractive();

        this.setCollideWorldBounds(true);

        // this.setGravity(0,250);
        this.body.gravity.y = 400;
        this.depth = 11;

        this.body.setSize(this.body.width/1.5,65);
        this.body.setOffset(15,30);
    
    }

    jump(): void{
        this.setVelocity(0,-300);
        this.play('jump');
        this.isJumping = true;
        this.onGround = false;
        this.scene.sound.play('jump');
    }

    slide(): void{
        //Set collision body smaller
        this.body.setSize(this.body.width,this.body.height/2);
        this.body.setOffset(15,60);
        this.play('slide');
        this.isSliding = true;
        this.onGround = true;
        this.scene.sound.play('slide');
    }

    stand(): void{
        this.isJumping = false;
        this.isSliding = false;
        this.onGround = true;
        this.body.setSize(this.body.width,65);
        this.body.setOffset(15,30);
        this.play('run');
        this.scene.sound.stopAll();
    }

    isStanding(): boolean{
        return (!this.isJumping && !this.isSliding && this.onGround);
    }
}