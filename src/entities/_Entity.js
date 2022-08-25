import Phaser from "phaser"

export class Entity extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name, faction) {
    super(scene, x, y)
    this.faction = faction

    this.image = scene.add.image(0, 0, name)
    this.add(this.image)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.allies.add(this)

    this.hp = 10
  }

  preUpdate() {
    this.depth = this.y
  }

  get hp() {
    return this._hp
  }

  set hp(val) {
    this._hp = Math.max(0, val)

    if (this.hp === 0) {
      this.kill()
    }
  }

  get opponents() {
    if (this.faction === "humans") {
      return this.scene.undead
    } else {
      return this.scene.humans
    }
  }

  get allies() {
    if (this.faction === "humans") {
      return this.scene.humans
    } else {
      return this.scene.undead
    }
  }

  kill() {
    this.destroy()
  }
}
