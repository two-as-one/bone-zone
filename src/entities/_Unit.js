import Phaser from "phaser"
import StateMachine from "javascript-state-machine"
import { Entity } from "./_Entity"

export class Unit extends Entity {
  constructor(scene, x, y, name, faction) {
    super(scene, x, y, name, faction)

    this.scene.units.add(this)

    this.image.setOrigin(0.5, 1)
    this.body.setCircle(2, -2, -2)

    this.moveSpeed = 10
    this.attackSpeed = 500
    this.damage = 1

    this.state = new StateMachine({
      init: "idle",
      transitions: [
        { name: "move", from: "idle", to: "moving" },
        { name: "attack", from: "idle", to: "attacking" },
        { name: "wait", from: "idle", to: "waiting" },
        { name: "stop", from: ["attacking", "moving", "waiting"], to: "idle" },
      ],
    })
  }

  preUpdate(time, delta) {
    super.preUpdate()
    const currentState = this.state.state

    if (this.state.is("moving")) {
      if (Phaser.Math.Distance.BetweenPoints(this, this.destination) <= 1) {
        this.stop()
      } else {
        this.scene.physics.moveTo(
          this,
          this.destination.x,
          this.destination.y,
          this.moveSpeed
        )
      }
    }

    if (this.state.is("waiting")) {
      this.waitTimer -= delta

      if (this.waitTimer <= 0) {
        this.stop()
      }
    }

    if (this.state.is("attacking")) {
      this.attackTimer -= delta

      if (this.attackTimer <= 0) {
        this.stop()
      }
    }

    if (this.state.is("idle")) {
      this.ai(currentState)
    }
  }

  ai() {}

  attack() {
    if (this.state.can("attack")) {
      const target = this.scene.physics.closest(
        this,
        this.opponents.children.entries
      )

      if (target) {
        target.hp -= this.damage
      }

      this.attackTimer = this.attackSpeed
      this.state.attack()
    }
  }

  stop() {
    if (this.state.can("stop")) {
      this.body.setVelocity(0, 0)
      this.state.stop()
    }
  }

  wait(duration = 1000) {
    if (this.state.can("wait")) {
      this.waitTimer = duration
      this.state.wait()
    }
  }

  move(x = 0, y = 0) {
    if (this.state.can("move")) {
      this.destination = new Phaser.Geom.Point(x, y)
      this.state.move()
    }
  }

  onCollide() {
    this.stop()
  }
}
