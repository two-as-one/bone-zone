import Phaser from "phaser"
import { Unit } from "./_Unit"

export class Skeleton extends Unit {
  constructor(scene, x, y) {
    super(scene, x, y, "skeleton", "undead")

    this.moveSpeed = 20
    this.damage = 1
  }

  ai() {
    const map = this.scene.map
    const tile = map.getTileAtWorldXY(this.body.x, this.body.y)

    if (tile.distance === 0) {
      this.attack()
    } else {
      const n = map.getTileAt(tile.x, tile.y - 1)
      const ne = map.getTileAt(tile.x + 1, tile.y - 1)
      const e = map.getTileAt(tile.x + 1, tile.y)
      const se = map.getTileAt(tile.x + 1, tile.y + 1)
      const s = map.getTileAt(tile.x, tile.y + 1)
      const sw = map.getTileAt(tile.x - 1, tile.y + 1)
      const w = map.getTileAt(tile.x - 1, tile.y)
      const nw = map.getTileAt(tile.x - 1, tile.y - 1)

      const neighbors = [n, e, s, w, ne, se, sw, nw]

      neighbors.sort((a, b) => a?.distance - b?.distance)
      let closest = neighbors[0]

      // prevent going diagonal when there are impassable tiles
      if (closest === ne) {
        if (!n?.passable) {
          closest = e
        }
        if (!e?.passable) {
          closest = n
        }
      }

      if (closest === se) {
        if (!s?.passable) {
          closest = e
        }
        if (!e?.passable) {
          closest = s
        }
      }

      if (closest === sw) {
        if (!s?.passable) {
          closest = w
        }
        if (!w?.passable) {
          closest = s
        }
      }

      if (closest === nw) {
        if (!n?.passable) {
          closest = w
        }
        if (!w?.passable) {
          closest = n
        }
      }

      if (closest && closest.distance < tile.distance) {
        let x = closest.pixelX + closest.width / 2 + (Math.random() * 4 - 2)
        let y = closest.pixelY + closest.height / 2 + (Math.random() * 4 - 2)

        this.move(x, y)
      } else {
        const circle = new Phaser.Geom.Circle(this.x, this.y, 16)
        const target = circle.getRandomPoint()
        this.move(target.x, target.y)
      }
    }
  }
}
