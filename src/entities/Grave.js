import Phaser from "phaser"
import { Building } from "./_Building"

export class Grave extends Building {
  constructor(scene, x, y) {
    super(scene, x, y, "grave", "undead")

    window.grave = this

    this.body.setSize(16, 16)
    this.body.setOffset(-8, -8)

    this.spawnTimer = 5000
    this.spawnArea = this.homeArea = new Phaser.Geom.Circle(
      this.body.x,
      this.body.y,
      8
    )
  }

  preUpdate(time, delta) {
    if (this.spawnTimer < 0) {
      this.spawn()
      this.spawn()
      this.spawn()
      this.spawn()
      this.spawn()
      this.spawn()
      this.spawnTimer = 5000
    }

    this.spawnTimer -= delta
  }

  spawn() {
    const target = this.homeArea.getRandomPoint()
    this.scene.spawn("skeleton", target.x, target.y)
  }
}
