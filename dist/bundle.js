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
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
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
    let drawing = new Image()
    drawing.src = "http://localhost:8080/sand/slice33_33.png"
    this.ctx.drawImage(drawing, 0, 0, 70, 70);

    for (let i = 0; i<this.board.length; i++) {
      for (let j = 0; j<this.board[i].length; j++) {
        // console.log(' # ')
        let player = this.anyPlayer(j, i)
        if (player) {
          this.ctx.fillStyle = "#00FF00"
          // this.ctx.fillRect(j*10+1, i*10+1, 8, 8 )
          // this.ctx.drawImage(drawing,j*70, i*70, 70, 70);

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
          drawing.src = "http://localhost:8080/sand/slice33_33.png"
          drawing.onload = () => {
            this.ctx.drawImage(drawing,j*70+1, i*70+1, 70, 70);
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
// class Utils {
//   random(max) {
//     return Math.random() * max
//   }
// }

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

module.exports = { randomInt, normalizeAngle }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db250cm9sLmpzIiwic3JjL2NvcmUvR2FtZS5qcyIsInNyYy9jb3JlL0ludGVybmFsUGxheWVyLmpzIiwic3JjL2RyYXdlcnMvV2ViRHJhd2VyLmpzIiwic3JjL3BsYXllcnMvc2FtcGxlLXBsYXllci5qcyIsInNyYy91dGlscy9VdGlscy5qcyIsInNyYy93ZWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IE9wZXJhdGlvbnMgPSB7XG4gIE5PTkU6ICdub25lJyxcbiAgTU9WRTogJ21vdmUnLFxuICBST1RBVEU6ICdyb3RhdGUnXG59XG5cbmNsYXNzIENvbnRyb2wge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYW5nbGUgPSAwXG4gICAgdGhpcy52ZWxvY2l0eSA9IDBcbiAgICB0aGlzLm9wZXJhdGlvbiA9IE9wZXJhdGlvbnMuTk9ORVxuICB9XG5cbiAgbW92ZSh2ZWxvY2l0eSkge1xuICAgIHRoaXMudmVsb2NpdHkgPSB2ZWxvY2l0eVxuICAgIHRoaXMub3BlcmF0aW9uID0gT3BlcmF0aW9ucy5NT1ZFXG4gIH1cblxuICByb3RhdGUoYW5nbGUpIHtcbiAgICB0aGlzLmFuZ2xlICs9IGFuZ2xlXG4gICAgdGhpcy5vcGVyYXRpb24gPSBPcGVyYXRpb25zLlJPVEFURVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDb250cm9sLCBPcGVyYXRpb25zXG59IiwiLy8gaW1wb3J0IHsgU2FtcGxlUGxheWVyIH0gZnJvbSBcIi4uL3BsYXllcnMvc2FtcGxlLXBsYXllclwiXG5jb25zdCBJbnRlcm5hbFBsYXllciA9IHJlcXVpcmUoJy4vSW50ZXJuYWxQbGF5ZXInKVxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9VdGlscycpXG5jb25zdCBTYW1wbGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9wbGF5ZXJzL3NhbXBsZS1wbGF5ZXInKVxuXG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoZHJhd2VyKSB7XG4gICAgdGhpcy5wbGF5ZXJzID0gW11cbiAgICB0aGlzLmJvYXJkID0gW1xuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdXG4gICAgXVxuICAgIHRoaXMuZHJhd2VyID0gZHJhd2VyXG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZVxuICAgIHRoaXMuZW5kZWQgPSBmYWxzZVxuICAgIHRoaXMudHVybk51bWJlciA9IDBcbiAgfVxuXG4gIGFkZFBsYXllcihwbGF5ZXIpIHtcbiAgICB0aGlzLnBsYXllcnMucHVzaChcbiAgICAgIG5ldyBJbnRlcm5hbFBsYXllcihwbGF5ZXIsIHRoaXMuYm9hcmRbMF0ubGVuZ3RoLCB0aGlzLmJvYXJkLmxlbmd0aClcbiAgICApXG4gIH1cblxuICBpbml0KCkge1xuICAgIGNvbnNvbGUubG9nKCdHQU1FIElOSVQnKVxuXG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocCA9PiBwLmRvSW5pdChcbiAgICAgIFV0aWxzLnJhbmRvbUludCh0aGlzLmJvYXJkLmxlbmd0aCksXG4gICAgICBVdGlscy5yYW5kb21JbnQodGhpcy5ib2FyZC5sZW5ndGgpLFxuICAgICAgMTAwXG4gICAgKSlcblxuICAgIHRoaXMuZHJhd2VyLmluaXQodGhpcy5wbGF5ZXJzLCB0aGlzLmJvYXJkKVxuICB9XG5cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgY29uc29sZS5sb2coJ0dBTUUgU1RBUlQnKVxuXG4gICAgd2hpbGUgKCF0aGlzLmVuZGVkKSB7XG4gICAgICB0aGlzLnR1cm4oKVxuXG4gICAgICB0aGlzLnR1cm5OdW1iZXIrK1xuICAgICAgLy8gaWYgKHRoaXMudHVybk51bWJlciA+IDEwKSB7XG4gICAgICAvLyAgIHRoaXMuZW5kZWQgPSB0cnVlXG4gICAgICAvLyB9XG4gICAgICBhd2FpdCB0aGlzLnNsZWVwKDEwMDApXG4gICAgfVxuICB9XG5cbiAgc2xlZXAobXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xuICAgIH0pO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5wYXVzZWQgPSB0cnVlXG4gIH1cblxuICB0dXJuKCkge1xuICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHAgPT4gcC5kb1R1cm4oKSlcblxuICAgIHRoaXMuZHJhd2VyLmRyYXcoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZSIsImNvbnN0IHsgQ29udHJvbCwgT3BlcmF0aW9ucyB9ID0gcmVxdWlyZSgnLi9Db250cm9sJylcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvVXRpbHMnKVxuXG5jbGFzcyBJbnRlcm5hbFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKHBsYXllciwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMueCA9IDBcbiAgICB0aGlzLnkgPSAwXG4gICAgdGhpcy5hbmdsZSA9IDBcbiAgICB0aGlzLmxpZmUgPSAxMDBcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIHRoaXMucGxheWVyID0gcGxheWVyXG4gIH1cblxuICBkb0luaXQoeCwgeSwgbGlmZSkge1xuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gICAgdGhpcy5saWZlID0gbGlmZVxuICAgIHRoaXMucGxheWVyLmluaXQoKVxuICB9XG5cbiAgZG9UdXJuKCkge1xuICAgIGxldCBjb250cm9sID0gbmV3IENvbnRyb2woKVxuICAgIHRoaXMucGxheWVyLnR1cm4oY29udHJvbClcblxuICAgIGNvbnNvbGUubG9nKGBDT05UUk9MICR7SlNPTi5zdHJpbmdpZnkoY29udHJvbCl9YClcbiAgICBjb25zb2xlLmxvZyhgUExBWUVSICR7SlNPTi5zdHJpbmdpZnkodGhpcyl9YClcblxuICAgIHN3aXRjaChjb250cm9sLm9wZXJhdGlvbikge1xuICAgICAgY2FzZSBPcGVyYXRpb25zLk5PTkU6XG4gICAgICAgIGNvbnNvbGUubG9nKCdOT05FIG9wZXJhdGlvbicpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT3BlcmF0aW9ucy5NT1ZFOlxuICAgICAgICBjb25zb2xlLmxvZygnTU9WRSBvcGVyYXRpb24nKTtcbiAgICAgICAgdGhpcy5tb3ZlKGNvbnRyb2wpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPcGVyYXRpb25zLlJPVEFURTpcbiAgICAgICAgY29uc29sZS5sb2coJ1JPVEFURSBvcGVyYXRpb24nKTtcbiAgICAgICAgdGhpcy5yb3RhdGUoY29udHJvbClcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnTk9PUCcpXG4gICAgfVxuICB9XG5cbiAgcm90YXRlKGNvbnRyb2wpIHtcbiAgICBpZiAoY29udHJvbC5hbmdsZSAhPT0gOTAgJiYgY29udHJvbC5hbmdsZSAhPT0gMTgwICYmIGNvbnRyb2wuYW5nbGUgIT09IDI3MCAmJlxuICAgICAgICBjb250cm9sLmFuZ2xlICE9PSAtOTAgJiYgY29udHJvbC5hbmdsZSAhPT0gLTE4MCAmJiBjb250cm9sLmFuZ2xlICE9PSAtMjcwKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignYW5nbGUgc2hvdWxkIGJlICstKDkwLDE4MCwyNzApJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hbmdsZSArPSBjb250cm9sLmFuZ2xlXG4gICAgICB0aGlzLmFuZ2xlID0gVXRpbHMubm9ybWFsaXplQW5nbGUodGhpcy5hbmdsZSlcbiAgICB9XG4gIH1cblxuICBtb3ZlKGNvbnRyb2wpIHtcbiAgICBzd2l0Y2godGhpcy5hbmdsZSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBpZiAodGhpcy54ICsgY29udHJvbC52ZWxvY2l0eSA8IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICB0aGlzLnggKz0gY29udHJvbC52ZWxvY2l0eVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE4MDpcbiAgICAgICAgaWYgKHRoaXMueCAtIGNvbnRyb2wudmVsb2NpdHkgPj0gMCkge1xuICAgICAgICAgIHRoaXMueCAtPSBjb250cm9sLnZlbG9jaXR5XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgOTA6XG4gICAgICAgIGlmICh0aGlzLnkgLSBjb250cm9sLnZlbG9jaXR5ID49IDApIHtcbiAgICAgICAgICB0aGlzLnkgLT0gY29udHJvbC52ZWxvY2l0eVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI3MDpcbiAgICAgICAgaWYgKHRoaXMueSArIGNvbnRyb2wudmVsb2NpdHkgPCB0aGlzLmhlaWdodCkge1xuICAgICAgICAgIHRoaXMueSArPSBjb250cm9sLnZlbG9jaXR5XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcm5hbFBsYXllciIsImNsYXNzIFdlYkRyYXdlciB7XG4gIGNvbnN0cnVjdG9yKHBsYXllcnMsIGJvYXJkKSB7XG4gICAgdGhpcy5ib2FyZCA9IG51bGxcbiAgICB0aGlzLnBsYXllcnMgPSBudWxsXG5cbiAgICAvLyBUT0RPOiBleHRlcm5hbGl6ZSB0aGlzXG4gICAgdGhpcy5jID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuYy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIH1cblxuICBpbml0KHBsYXllcnMsIGJvYXJkKSB7XG4gICAgdGhpcy5ib2FyZCA9IGJvYXJkXG4gICAgdGhpcy5wbGF5ZXJzID0gcGxheWVyc1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICAvLyBjb25zb2xlLmNsZWFyKClcbiAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLmJvYXJkWzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZSgnICcgKyBpKVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnJylcbiAgICBsZXQgZHJhd2luZyA9IG5ldyBJbWFnZSgpXG4gICAgZHJhd2luZy5zcmMgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9zYW5kL3NsaWNlMzNfMzMucG5nXCJcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoZHJhd2luZywgMCwgMCwgNzAsIDcwKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMuYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqPHRoaXMuYm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAjICcpXG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmFueVBsYXllcihqLCBpKVxuICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMDBGRjAwXCJcbiAgICAgICAgICAvLyB0aGlzLmN0eC5maWxsUmVjdChqKjEwKzEsIGkqMTArMSwgOCwgOCApXG4gICAgICAgICAgLy8gdGhpcy5jdHguZHJhd0ltYWdlKGRyYXdpbmcsaio3MCwgaSo3MCwgNzAsIDcwKTtcblxuICAgICAgICAgIGlmIChwbGF5ZXIuYW5nbGUgPT09IDApIHtcbiAgICAgICAgICAgIC8vIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCcgPiAnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGxheWVyLmFuZ2xlID09PSA5MCkge1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyBeICcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwbGF5ZXIuYW5nbGUgPT09IDE4MCkge1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyA8ICcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwbGF5ZXIuYW5nbGUgPT09IDI3MCkge1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyB2ICcpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiI0ZGMDAwMFwiXG4gICAgICAgICAgLy8gdGhpcy5jdHguZmlsbFJlY3QoaioxMCsxLCBpKjEwKzEsIDgsIDggKVxuICAgICAgICAgIGxldCBkcmF3aW5nID0gbmV3IEltYWdlKClcbiAgICAgICAgICBkcmF3aW5nLnNyYyA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3NhbmQvc2xpY2UzM18zMy5wbmdcIlxuICAgICAgICAgIGRyYXdpbmcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGRyYXdpbmcsaio3MCsxLCBpKjcwKzEsIDcwLCA3MCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyAjICcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNvbnNvbGUubG9nKCcnKVxuICAgIH1cbiAgfVxuXG4gIGFueVBsYXllcih4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVycy5maW5kKHAgPT4gcC54ID09IHggJiYgcC55ID09IHkpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXZWJEcmF3ZXIiLCJjb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL1V0aWxzJylcblxuY2xhc3MgU2FtcGxlUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50dXJuTnVtYmVyID0gMFxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZyhgaW5pdGApXG4gIH1cblxuICB0dXJuKGNvbnRyb2wpIHtcbiAgICBjb25zb2xlLmxvZyhgdHVybmApXG5cbiAgICBpZiAodGhpcy50dXJuTnVtYmVyICUgNCA9PT0gMCkge1xuICAgICAgY29udHJvbC5yb3RhdGUoOTApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRyb2wubW92ZSgxKVxuICAgIH1cblxuICAgIHRoaXMudHVybk51bWJlcisrXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW1wbGVQbGF5ZXIiLCIvLyBjbGFzcyBVdGlscyB7XG4vLyAgIHJhbmRvbShtYXgpIHtcbi8vICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIG1heFxuLy8gICB9XG4vLyB9XG5cbmZ1bmN0aW9uIHJhbmRvbUludChtYXgpIHtcbiAgcmV0dXJuIHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFuZ2xlKGFuZ2xlKSB7XG4gIGlmIChhbmdsZSA+PSAzNjApIHtcbiAgICByZXR1cm4gYW5nbGUgLSAzNjBcbiAgfVxuICBpZiAoYW5nbGUgPCAwKSB7XG4gICAgcmV0dXJuIDM2MCAtIGFuZ2xlXG4gIH1cblxuICByZXR1cm4gYW5nbGVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHJhbmRvbUludCwgbm9ybWFsaXplQW5nbGUgfSIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2NvcmUvR2FtZS5qcycpXG5jb25zdCBXZWJEcmF3ZXIgPSByZXF1aXJlKCcuL2RyYXdlcnMvV2ViRHJhd2VyLmpzJylcbmNvbnN0IFNhbXBsZVBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVycy9zYW1wbGUtcGxheWVyLmpzJylcblxuLy8gY29uc29sZS5sb2coJ1N0YXJ0ZWQuLi4nKVxuXG4vLyBsZXQgZ2FtZSA9IG5ldyBHYW1lKG5ldyBXZWJEcmF3ZXIoKSlcblxuLy8gLy8gYWRkIHBsYXllcnNcbi8vIGdhbWUuYWRkUGxheWVyKG5ldyBTYW1wbGVQbGF5ZXIoKSlcbi8vIGdhbWUuYWRkUGxheWVyKG5ldyBTYW1wbGVQbGF5ZXIoKSlcblxuLy8gLy8gaW5pdFxuLy8gZ2FtZS5pbml0KClcblxuLy8gLy8gc3RhcnRcbi8vIGdhbWUuc3RhcnQoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgR2FtZSwgV2ViRHJhd2VyLCBTYW1wbGVQbGF5ZXIgfVxuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vICAgR2FtZTogcmVxdWlyZSgnLi9jb3JlL0dhbWUuanMnKVxuLy8gfVxuXG4vLyBleHBvcnRzLkdhbWUgPSByZXF1aXJlKCcuL2NvcmUvR2FtZS5qcycpXG5cbiJdfQ==
