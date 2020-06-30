import * as Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor(){
        super({ key: "PreloadScene" });
    }

    preload(): void {
        // Load Spritesheet
        this.load.path = "src/Assets/";
        this.load.spritesheet("runner","Tilesheet/platformerPack_character.png", {
            frameWidth: 96,
            frameHeight: 96
        });
        this.load.spritesheet("tiles","Tilesheet/platformPack_tilesheet.png", {
            frameWidth: 64,
            frameHeight: 64
        });

        // Load Parallax Background Assets
        this.load.image("cloud_lonely","PNG/Background/cloud_lonely.png");
        this.load.image("cloud_bg","PNG/Background/clouds_bg.png");
        this.load.image("cloud_mg_1","PNG/Background/clouds_mg_1.png");
        this.load.image("cloud_mg_2","PNG/Background/clouds_mg_2.png");
        this.load.image("cloud_mg_3","PNG/Background/clouds_mg_3.png");
        this.load.image("glacial_mountains","PNG/Background/glacial_mountains.png");
        this.load.image("sky","PNG/Background/sky_lightened.png");

        // Load audio
        this.load.audio("bonk",["SFX/bonk.mp3","SFX/bonk.ogg"]);
        this.load.audio("coin",["SFX/coin.mp3","SFX/coin.ogg"]);
        this.load.audio("jump",["SFX/jump.mp3","SFX/jump.ogg"]);
        this.load.audio("slide",["SFX/slide.mp3","SFX/slide.ogg"]);
        
    }

    create(): void {
        console.log('starting game...');
        this.scene.start("GameScene");
    }
}