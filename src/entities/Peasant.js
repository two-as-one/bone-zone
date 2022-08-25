import Phaser from "phaser"
import { Unit } from "./_Unit"

export class Peasant extends Unit {
  constructor(scene, x, y) {
    super(scene, x, y, "peasant", "humans")

    this.homeArea = new Phaser.Geom.Circle(this.body.x, this.body.y, 32)
    this.hp = 1
  }

  ai(currentState) {
    if (currentState === "moving") {
      this.wait(1000)
    } else {
      const target = this.homeArea.getRandomPoint()
      this.move(target.x, target.y)
    }
  }
}
