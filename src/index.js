import "core-js/stable"
import "regenerator-runtime/runtime"

import { HelloWorld } from "HelloWorld"
import { Game } from "./game/Game"

const game = new Game()
window.game = game

customElements.define("hello-world", HelloWorld)
document.body.appendChild(document.createElement("hello-world"))
