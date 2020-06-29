import "phaser";
import GameScene from "./Scripts/Scene/GameScene";
import PreloadScene from "./Scripts/Scene/PreloadScene";

type GameConfig = Phaser.Types.Core.GameConfig;

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 720;

const config: GameConfig = {
  title: "Starfall",
  scale:{
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  physics: {
    default: "arcade",
    arcade:{
        debug: true
    }
  },
  audio: {
    disableWebAudio: false,
    noAudio: false
  },
  backgroundColor: "#242020",
  scene: [PreloadScene, GameScene],
};
export class StarfallGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
    
  }
  
}
window.onload = () => {
  var game = new StarfallGame(config);
};