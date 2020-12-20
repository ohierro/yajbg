(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Game = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Operations = {
  NONE: 'none',
  MOVE: 'move',
  ROTATE: 'rotate'
}

class Control {

  constructor() {
    this.angle = 0
    this.velocity = 0
    this.operation = Operations.NONE
  }

  move(velocity) {
    this.velocity = velocity
    this.operation = Operations.MOVE
  }

  rotate(angle) {
    this.angle += angle
    this.operation = Operations.ROTATE
  }
}

module.exports = {
  Control, Operations
}
},{}],2:[function(require,module,exports){
// import { SamplePlayer } from "../players/sample-player"
const InternalPlayer = require('./InternalPlayer')
const Utils = require('../utils/Utils')
const SamplePlayer = require('../players/sample-player')

class Game {
  constructor(drawer) {
    this.players = []
    this.board = Utils.createMultiArray(8,5)
    this.drawer = drawer
    this.paused = false
    this.ended = false
    this.turnNumber = 0
  }

  addPlayer(player) {
    this.players.push(
      new InternalPlayer(player, this.board[0].length, this.board.length)
    )
  }

  init() {
    console.log('GAME INIT')

    this.players.forEach(p => p.doInit(
      Utils.randomInt(this.board.length),
      Utils.randomInt(this.board.length),
      100
    ))

    this.drawer.init(this.players, this.board)
  }

  async start() {
    console.log('GAME START')

    while (!this.ended) {
      this.turn()

      this.turnNumber++
      // if (this.turnNumber > 10) {
      //   this.ended = true
      // }
      await this.sleep(1000)
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  pause() {
    this.paused = true
  }

  turn() {
    this.players.forEach(p => p.doTurn())

    this.drawer.draw()
  }
}

module.exports = Game
},{"../players/sample-player":5,"../utils/Utils":6,"./InternalPlayer":3}],3:[function(require,module,exports){
const { Control, Operations } = require('./Control')
const Utils = require('../utils/Utils')

class InternalPlayer {
  constructor(player, width, height) {
    this.x = 0
    this.y = 0
    this.angle = 0
    this.life = 100
    this.width = width
    this.height = height
    this.player = player
  }

  doInit(x, y, life) {
    this.x = x
    this.y = y
    this.life = life
    this.player.init()
  }

  doTurn() {
    let control = new Control()
    this.player.turn(control)

    console.log(`CONTROL ${JSON.stringify(control)}`)
    console.log(`PLAYER ${JSON.stringify(this)}`)

    switch(control.operation) {
      case Operations.NONE:
        console.log('NONE operation');
        break;
      case Operations.MOVE:
        console.log('MOVE operation');
        this.move(control)
        break;
      case Operations.ROTATE:
        console.log('ROTATE operation');
        this.rotate(control)
        break;
      default:
        console.log('NOOP')
    }
  }

  rotate(control) {
    if (control.angle !== 90 && control.angle !== 180 && control.angle !== 270 &&
        control.angle !== -90 && control.angle !== -180 && control.angle !== -270) {
          console.error('angle should be +-(90,180,270)')
    } else {
      this.angle += control.angle
      this.angle = Utils.normalizeAngle(this.angle)
    }
  }

  move(control) {
    switch(this.angle) {
      case 0:
        if (this.x + control.velocity < this.width) {
          this.x += control.velocity
        }
        break
      case 180:
        if (this.x - control.velocity >= 0) {
          this.x -= control.velocity
        }
        break
      case 90:
        if (this.y - control.velocity >= 0) {
          this.y -= control.velocity
        }
        break
      case 270:
        if (this.y + control.velocity < this.height) {
          this.y += control.velocity
        }
        break
    }
  }
}

module.exports = InternalPlayer
},{"../utils/Utils":6,"./Control":1}],4:[function(require,module,exports){
class WebDrawer {
  constructor(players, board) {
    this.board = null
    this.players = null

    // TODO: externalize this
    this.c = document.getElementById("myCanvas");
    this.ctx = this.c.getContext("2d");
  }

  init(players, board) {
    this.board = board
    this.players = players
  }

  draw() {
    // console.clear()
    for (let i = 0; i<this.board[0].length; i++) {
      // process.stdout.write(' ' + i)
    }
    // console.log('')
    // let drawing = new Image()
    // drawing.src = "http://localhost:8080/sand/slice33_33.png"
    // this.ctx.drawImage(drawing, 0, 0, 70, 70);
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)

    for (let i = 0; i<this.board.length; i++) {
      for (let j = 0; j<this.board[i].length; j++) {
        // console.log(' # ')
        let player = this.anyPlayer(j, i)
        if (player) {
          this.ctx.fillStyle = "#00FF00"
          // this.ctx.fillRect(j*10+1, i*10+1, 8, 8 )
          // this.ctx.drawImage(drawing,j*70, i*70, 70, 70);

          let drawing = new Image()
          drawing.src = "http://localhost:8080/img/players/tank.png"
          drawing.onload = () => {
            this.ctx.drawImage(drawing,j*70+1, i*70+1, 50, 50);
          }

          if (player.angle === 0) {
            // process.stdout.write(' > ')
          }
          if (player.angle === 90) {
            // process.stdout.write(' ^ ')
          }
          if (player.angle === 180) {
            // process.stdout.write(' < ')
          }
          if (player.angle === 270) {
            // process.stdout.write(' v ')
          }
        } else {
          this.ctx.fillStyle = "#FF0000"
          // this.ctx.fillRect(j*10+1, i*10+1, 8, 8 )
          let drawing = new Image()
          drawing.src = "http://localhost:8080/img/sand/slice33_33.png"
          drawing.onload = () => {
            this.ctx.drawImage(drawing,j*70+1, i*70+1, 50, 50);
          }

          // process.stdout.write(' # ')
        }
      }
      // console.log('')
    }
  }

  anyPlayer(x, y) {
    return this.players.find(p => p.x == x && p.y == y)
  }
}

module.exports = WebDrawer
},{}],5:[function(require,module,exports){
const Utils = require('../utils/Utils')

class SamplePlayer {
  constructor() {
    this.turnNumber = 0
  }

  init() {
    console.log(`init`)
  }

  turn(control) {
    console.log(`turn`)

    if (this.turnNumber % 4 === 0) {
      control.rotate(90)
    } else {
      control.move(1)
    }

    this.turnNumber++
  }
}

module.exports = SamplePlayer
},{"../utils/Utils":6}],6:[function(require,module,exports){
function randomInt(max) {
  return parseInt(Math.random() * max)
}

function normalizeAngle(angle) {
  if (angle >= 360) {
    return angle - 360
  }
  if (angle < 0) {
    return 360 - angle
  }

  return angle
}

function createMultiArray(width, height) {
  let row = new Array(width).fill(0)
  let array = new Array(height).fill(row)

  return array
}

module.exports = { randomInt, normalizeAngle, createMultiArray }
},{}],7:[function(require,module,exports){
const Game = require('./core/Game.js')
const WebDrawer = require('./drawers/WebDrawer.js')
const SamplePlayer = require('./players/sample-player.js')

// console.log('Started...')

// let game = new Game(new WebDrawer())

// // add players
// game.addPlayer(new SamplePlayer())
// game.addPlayer(new SamplePlayer())

// // init
// game.init()

// // start
// game.start()

module.exports = { Game, WebDrawer, SamplePlayer }

// module.exports = {
//   Game: require('./core/Game.js')
// }

// exports.Game = require('./core/Game.js')


},{"./core/Game.js":2,"./drawers/WebDrawer.js":4,"./players/sample-player.js":5}]},{},[7])(7)
});

//# sourceMappingURL=bundle.js.map
