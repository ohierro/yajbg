(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Game = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Operations = {
  NONE: 'none',
  MOVE: 'move',
  ROTATE: 'rotate',
  SHOOT: 'shoot'
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

  shoot() {
    this.operation = Operations.SHOOT
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
const GameSnapshot = require('./GameSnapshot.js')

class Game {
  constructor(drawer, logger) {
    this.players = []
    this.board = Utils.createMultiArray(8,5)
    this.objects = []

    this.drawer = drawer
    this.logger = logger
    this.paused = false
    this.ended = false
    this.turnNumber = 0
  }

  addPlayer(player) {
    this.players.push(
      new InternalPlayer(player, this.board[0].length, this.board.length, this.logger)
    )
  }

  init() {
    this.logger.info('GAME INIT')

    this.players.forEach(p => p.doInit(
      Utils.randomInt(this.board.length),
      Utils.randomInt(this.board.length),
      100
    ))

    this.drawer.init(this.players, this.board, this.objects)
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

  nextTick() {
    this.logger.debug(`TURN ${this.turnNumber}`)

    this.turn()

    this.logger.debug(`OBJECTS ${this.objects}`)

    this.turnNumber++
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
    this.objects = []

    this.players.forEach(p => {
      let result = p.doTurn()

      if (result !== null) {
        this.objects.push(result)
      }
    })

    this.drawer.draw2(new GameSnapshot(this.players, this.board, this.objects))
  }
}

module.exports = Game
},{"../players/sample-player":8,"../utils/Utils":9,"./GameSnapshot.js":3,"./InternalPlayer":4}],3:[function(require,module,exports){
class GameSnapshot {
  constructor(players, board, objects) {
    this.players = players
    this.board = board
    this.objects = objects
  }
}

module.exports = GameSnapshot
},{}],4:[function(require,module,exports){
const { Control, Operations } = require('./Control')
const Utils = require('../utils/Utils')
const Misile = require('./Misile')

class InternalPlayer {
  constructor(player, width, height, logger) {
    this.x = 0
    this.y = 0
    this.angle = 0
    this.life = 100
    this.width = width
    this.height = height
    this.player = player
    this.logger = logger
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

    this.logger.debug(`CONTROL ${JSON.stringify(control)}`)
    this.logger.debug(`PLAYER ${JSON.stringify(this)}`)

    switch(control.operation) {
      case Operations.NONE:
        this.logger.debug('NONE operation');
        break;
      case Operations.MOVE:
        this.logger.debug('MOVE operation');
        this.move(control)
        break;
      case Operations.ROTATE:
        this.logger.debug('ROTATE operation');
        this.rotate(control)
        break;
      case Operations.SHOOT:
        debugger
        this.logger.debug('SHOOT operation')
        return new Misile(this.x, this.y, this.angle, 1, this.width, this.height)
      default:
        this.logger.debug('NOOP')
    }

    return null;
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
},{"../utils/Utils":9,"./Control":1,"./Misile":5}],5:[function(require,module,exports){
class Misile {
  constructor(x, y, angle, velocity, width, height) {
    this.x = x
    this.y = y
    this.angle = angle
    this.velocity = velocity
    this.width = width
    this.height = height
  }

  calculatePath() {
    let path = []

    if (this.angle === 0) {
      let currentX = this.x

      while (currentX < width) {
        path.push({ x: currentX, y })
        currentX++
      }
    }
    if (this.angle === 90) {
      let currentY = this.y

      while (currentY > 0) {
        path.push({ x, y: currentY })
        currentY--
      }
    }
    if (this.angle === 180) {
      let currentX = this.x

      while (currentX > 0) {
        path.push({ x: currentX, y })
        currentX--
      }
    }
    if (this.angle === 270) {
      let currentY = this.y

      while (currentY < height) {
        path.push({ x, y: currentY })
        currentY++
      }
    }


  }
}

module.exports = Misile
},{}],6:[function(require,module,exports){
const GameSnapshot = require('../core/GameSnapshot.js')

class WebDrawer {
  constructor(players, board) {
    this.board = null
    this.players = null
    this.objects = null

    // TODO: externalize this
    this.c = document.getElementById("myCanvas");
    this.ctx = this.c.getContext("2d");
  }

  init(players, board, objects) {
    this.board = board
    this.players = players
    this.objects = objects
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)

    if (this.objects !== null) {
      this.objects.forEach(object => {
        if (typeof object === 'Misile') {
          console.log('FOUND MISILE!!')
        }
      })
    }

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
            this.ctx.drawImage(drawing,j*70+1, i*70+1, 20, 20);
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

  draw2(gameSnapshot) {
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)

    if (gameSnapshot.objects !== null && gameSnapshot.objects.length > 0) {
      gameSnapshot.objects.forEach(object => {
        if (typeof object === 'Misile') {
          console.log('FOUND MISILE!!')
        }
      })
    }

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
            this.ctx.drawImage(drawing,j*70+1, i*70+1, 20, 20);
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
},{"../core/GameSnapshot.js":3}],7:[function(require,module,exports){
const INFO = 3
const DEBUG = 2

class Logger {
  constructor(idHtmlLog, level) {
    this.el = document.getElementById(idHtmlLog)
    this.level = level
    this.msgs = []
  }

  info(msg) {
    this.msgs.push({ level: INFO, msg: msg })
    this.flush()
  }

  debug(msg) {
    this.msgs.push({ level: DEBUG, msg: msg })
    this.flush()
  }

  flush() {
    this.msgs.forEach(msg => this.el.innerHTML += `${msg.level}: ${msg.msg}\n`)
    this.el.scrollTop = this.el.scrollHeight;
    this.msgs = []
  }
}

module.exports = Logger
},{}],8:[function(require,module,exports){
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
      control.shoot()
    }

    this.turnNumber++
  }
}

module.exports = SamplePlayer
},{"../utils/Utils":9}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
const Game = require('./core/Game.js')
const WebDrawer = require('./drawers/WebDrawer.js')
const SamplePlayer = require('./players/sample-player.js')
const Logger = require('./log/Logger.js')

// console.log('Started...')

// let game = new Game(new WebDrawer())

// // add players
// game.addPlayer(new SamplePlayer())
// game.addPlayer(new SamplePlayer())

// // init
// game.init()

// // start
// game.start()

module.exports = { Game, WebDrawer, SamplePlayer, Logger }

// module.exports = {
//   Game: require('./core/Game.js')
// }

// exports.Game = require('./core/Game.js')


},{"./core/Game.js":2,"./drawers/WebDrawer.js":6,"./log/Logger.js":7,"./players/sample-player.js":8}]},{},[10])(10)
});

//# sourceMappingURL=bundle.js.map
