import { Entity } from "./_Entity"

export class Building extends Entity {
  constructor(scene, x, y, name, faction) {
    super(scene, x, y, name, faction)

    this.scene.buildings.add(this)

    this.body.setImmovable()
  }
}
