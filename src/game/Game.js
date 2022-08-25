import Phaser from "phaser"
import { LevelScene } from "../scenes/LevelScene"

export class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: 480,
      height: 320,
      backgroundColor: "#fff",
      pixelArt: true,
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      zoom: 1,
      roundPixels: true,
      scene: LevelScene,
    })
  }
}
