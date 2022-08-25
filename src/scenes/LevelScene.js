import Phaser from "phaser"

import tileset from "images/tileset16.png"
import skeleton from "images/skeleton.png"
import grave from "images/grave.png"
import peasant from "images/peasant.png"
import helloWorldLevel from "raw/helloWorldLevel.json"

import { Skeleton } from "../entities/Skeleton"
import { Peasant } from "../entities/Peasant"
import { Chance } from "chance"
import { Grave } from "../entities/Grave"

const chance = new Chance()

export class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: "Level" })
    window.scene = this
    this.chance = new Chance()
  }

  preload() {
    this.load.image("tileset16", tileset)
    this.load.image("skeleton", skeleton)
    this.load.image("grave", grave)
    this.load.image("peasant", peasant)
    this.load.tilemapTiledJSON("tilemap", helloWorldLevel)
  }

  create() {
    this.map = this.make.tilemap({ key: "tilemap" })
    const tileset = this.map.addTilesetImage("tileset16", "tileset16")
    this.worldLayer = this.map.createStaticLayer("layer1", tileset)
    this.worldLayer.setCollisionBetween(3, 4)

    this.units = this.physics.add.group()
    this.humans = this.physics.add.group()
    this.undead = this.physics.add.group()
    this.buildings = this.physics.add.group()

    this.physics.add.collider(
      this.units,
      this.worldLayer,
      this.collisionHandler
    )
    this.physics.add.collider(this.units, this.units, this.collisionHandler)

    for (let i = 0; i < 10; i++) {
      this.spawn("peasant")
    }
    this.spawn("grave")

    this.map
      .getTilesWithinWorldXY(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      )
      .forEach((tile) => {
        tile.passable = tile.index === 1 || tile.index === 2

        if (tile.passable && this.game.config.physics.arcade.debug) {
          tile.debugText = this.add.text(tile.pixelX, tile.pixelY, "", {
            fontSize: 8,
            fontFamily: "monospace",
          })
          tile.debugText.x += tile.width / 2
          tile.debugText.y += tile.height / 2
          tile.debugText.setOrigin(0.5)
        }
      })
  }

  update() {
    this.generateDistanceMap()
  }

  collisionHandler(a, b) {
    chance.pickone([a, b]).onCollide?.()
    // a.onCollide?.()
    // b.onCollide?.()
  }

  spawn(name, x, y) {
    switch (name) {
      case "peasant":
        new Peasant(
          this,
          chance.integer({ min: 400, max: 450 }),
          chance.integer({ min: 150, max: 200 })
        )
        break
      case "skeleton":
        new Skeleton(this, x, y)
        break
      case "grave":
        new Grave(this, 16 * 5 + 8, 16 * 7 + 8)
        break
    }
  }

  generateDistanceMap() {
    const tiles = this.map.getTilesWithinWorldXY(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    )

    const humans = this.humans.children.entries

    if (humans.length === 0) {
      tiles.forEach((tile) => (tile.distance = 99))
    } else {
      tiles.forEach((tile) => (tile.distance = Infinity))

      const list = []

      humans.forEach((human) => {
        const tile = this.map.getTileAtWorldXY(human.x, human.y)
        if (tile && tile.distance === Infinity && tile.passable) {
          tile.distance = 0
          list.push(tile)
        }
      })

      while (list.length > 0) {
        const tile = list.shift()

        const x = tile.x
        const y = tile.y

        const neighbors = [
          this.map.getTileAt(x, y - 1),
          this.map.getTileAt(x + 1, y),
          this.map.getTileAt(x, y + 1),
          this.map.getTileAt(x - 1, y),
        ]

        neighbors.forEach((neighbor) => {
          if (neighbor && neighbor.distance === Infinity) {
            if (neighbor.passable) {
              neighbor.distance = tile.distance + 1
              list.push(neighbor)
            }
          }
        })
      }
    }

    if (this.game.config.physics.arcade.debug) {
      tiles.forEach((tile) => tile.debugText?.setText(tile.distance))
    }
  }
}
