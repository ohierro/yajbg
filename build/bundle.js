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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db250cm9sLmpzIiwic3JjL2NvcmUvR2FtZS5qcyIsInNyYy9jb3JlL0ludGVybmFsUGxheWVyLmpzIiwic3JjL2RyYXdlcnMvV2ViRHJhd2VyLmpzIiwic3JjL3BsYXllcnMvc2FtcGxlLXBsYXllci5qcyIsInNyYy91dGlscy9VdGlscy5qcyIsInNyYy93ZWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBPcGVyYXRpb25zID0ge1xuICBOT05FOiAnbm9uZScsXG4gIE1PVkU6ICdtb3ZlJyxcbiAgUk9UQVRFOiAncm90YXRlJ1xufVxuXG5jbGFzcyBDb250cm9sIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFuZ2xlID0gMFxuICAgIHRoaXMudmVsb2NpdHkgPSAwXG4gICAgdGhpcy5vcGVyYXRpb24gPSBPcGVyYXRpb25zLk5PTkVcbiAgfVxuXG4gIG1vdmUodmVsb2NpdHkpIHtcbiAgICB0aGlzLnZlbG9jaXR5ID0gdmVsb2NpdHlcbiAgICB0aGlzLm9wZXJhdGlvbiA9IE9wZXJhdGlvbnMuTU9WRVxuICB9XG5cbiAgcm90YXRlKGFuZ2xlKSB7XG4gICAgdGhpcy5hbmdsZSArPSBhbmdsZVxuICAgIHRoaXMub3BlcmF0aW9uID0gT3BlcmF0aW9ucy5ST1RBVEVcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ29udHJvbCwgT3BlcmF0aW9uc1xufSIsIi8vIGltcG9ydCB7IFNhbXBsZVBsYXllciB9IGZyb20gXCIuLi9wbGF5ZXJzL3NhbXBsZS1wbGF5ZXJcIlxuY29uc3QgSW50ZXJuYWxQbGF5ZXIgPSByZXF1aXJlKCcuL0ludGVybmFsUGxheWVyJylcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvVXRpbHMnKVxuY29uc3QgU2FtcGxlUGxheWVyID0gcmVxdWlyZSgnLi4vcGxheWVycy9zYW1wbGUtcGxheWVyJylcblxuY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKGRyYXdlcikge1xuICAgIHRoaXMucGxheWVycyA9IFtdXG4gICAgdGhpcy5ib2FyZCA9IFV0aWxzLmNyZWF0ZU11bHRpQXJyYXkoOCw1KVxuICAgIHRoaXMuZHJhd2VyID0gZHJhd2VyXG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZVxuICAgIHRoaXMuZW5kZWQgPSBmYWxzZVxuICAgIHRoaXMudHVybk51bWJlciA9IDBcbiAgfVxuXG4gIGFkZFBsYXllcihwbGF5ZXIpIHtcbiAgICB0aGlzLnBsYXllcnMucHVzaChcbiAgICAgIG5ldyBJbnRlcm5hbFBsYXllcihwbGF5ZXIsIHRoaXMuYm9hcmRbMF0ubGVuZ3RoLCB0aGlzLmJvYXJkLmxlbmd0aClcbiAgICApXG4gIH1cblxuICBpbml0KCkge1xuICAgIGNvbnNvbGUubG9nKCdHQU1FIElOSVQnKVxuXG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocCA9PiBwLmRvSW5pdChcbiAgICAgIFV0aWxzLnJhbmRvbUludCh0aGlzLmJvYXJkLmxlbmd0aCksXG4gICAgICBVdGlscy5yYW5kb21JbnQodGhpcy5ib2FyZC5sZW5ndGgpLFxuICAgICAgMTAwXG4gICAgKSlcblxuICAgIHRoaXMuZHJhd2VyLmluaXQodGhpcy5wbGF5ZXJzLCB0aGlzLmJvYXJkKVxuICB9XG5cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgY29uc29sZS5sb2coJ0dBTUUgU1RBUlQnKVxuXG4gICAgd2hpbGUgKCF0aGlzLmVuZGVkKSB7XG4gICAgICB0aGlzLnR1cm4oKVxuXG4gICAgICB0aGlzLnR1cm5OdW1iZXIrK1xuICAgICAgLy8gaWYgKHRoaXMudHVybk51bWJlciA+IDEwKSB7XG4gICAgICAvLyAgIHRoaXMuZW5kZWQgPSB0cnVlXG4gICAgICAvLyB9XG4gICAgICBhd2FpdCB0aGlzLnNsZWVwKDEwMDApXG4gICAgfVxuICB9XG5cbiAgc2xlZXAobXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xuICAgIH0pO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5wYXVzZWQgPSB0cnVlXG4gIH1cblxuICB0dXJuKCkge1xuICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHAgPT4gcC5kb1R1cm4oKSlcblxuICAgIHRoaXMuZHJhd2VyLmRyYXcoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZSIsImNvbnN0IHsgQ29udHJvbCwgT3BlcmF0aW9ucyB9ID0gcmVxdWlyZSgnLi9Db250cm9sJylcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvVXRpbHMnKVxuXG5jbGFzcyBJbnRlcm5hbFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKHBsYXllciwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMueCA9IDBcbiAgICB0aGlzLnkgPSAwXG4gICAgdGhpcy5hbmdsZSA9IDBcbiAgICB0aGlzLmxpZmUgPSAxMDBcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIHRoaXMucGxheWVyID0gcGxheWVyXG4gIH1cblxuICBkb0luaXQoeCwgeSwgbGlmZSkge1xuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gICAgdGhpcy5saWZlID0gbGlmZVxuICAgIHRoaXMucGxheWVyLmluaXQoKVxuICB9XG5cbiAgZG9UdXJuKCkge1xuICAgIGxldCBjb250cm9sID0gbmV3IENvbnRyb2woKVxuICAgIHRoaXMucGxheWVyLnR1cm4oY29udHJvbClcblxuICAgIGNvbnNvbGUubG9nKGBDT05UUk9MICR7SlNPTi5zdHJpbmdpZnkoY29udHJvbCl9YClcbiAgICBjb25zb2xlLmxvZyhgUExBWUVSICR7SlNPTi5zdHJpbmdpZnkodGhpcyl9YClcblxuICAgIHN3aXRjaChjb250cm9sLm9wZXJhdGlvbikge1xuICAgICAgY2FzZSBPcGVyYXRpb25zLk5PTkU6XG4gICAgICAgIGNvbnNvbGUubG9nKCdOT05FIG9wZXJhdGlvbicpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT3BlcmF0aW9ucy5NT1ZFOlxuICAgICAgICBjb25zb2xlLmxvZygnTU9WRSBvcGVyYXRpb24nKTtcbiAgICAgICAgdGhpcy5tb3ZlKGNvbnRyb2wpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPcGVyYXRpb25zLlJPVEFURTpcbiAgICAgICAgY29uc29sZS5sb2coJ1JPVEFURSBvcGVyYXRpb24nKTtcbiAgICAgICAgdGhpcy5yb3RhdGUoY29udHJvbClcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnTk9PUCcpXG4gICAgfVxuICB9XG5cbiAgcm90YXRlKGNvbnRyb2wpIHtcbiAgICBpZiAoY29udHJvbC5hbmdsZSAhPT0gOTAgJiYgY29udHJvbC5hbmdsZSAhPT0gMTgwICYmIGNvbnRyb2wuYW5nbGUgIT09IDI3MCAmJlxuICAgICAgICBjb250cm9sLmFuZ2xlICE9PSAtOTAgJiYgY29udHJvbC5hbmdsZSAhPT0gLTE4MCAmJiBjb250cm9sLmFuZ2xlICE9PSAtMjcwKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignYW5nbGUgc2hvdWxkIGJlICstKDkwLDE4MCwyNzApJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hbmdsZSArPSBjb250cm9sLmFuZ2xlXG4gICAgICB0aGlzLmFuZ2xlID0gVXRpbHMubm9ybWFsaXplQW5nbGUodGhpcy5hbmdsZSlcbiAgICB9XG4gIH1cblxuICBtb3ZlKGNvbnRyb2wpIHtcbiAgICBzd2l0Y2godGhpcy5hbmdsZSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBpZiAodGhpcy54ICsgY29udHJvbC52ZWxvY2l0eSA8IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICB0aGlzLnggKz0gY29udHJvbC52ZWxvY2l0eVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE4MDpcbiAgICAgICAgaWYgKHRoaXMueCAtIGNvbnRyb2wudmVsb2NpdHkgPj0gMCkge1xuICAgICAgICAgIHRoaXMueCAtPSBjb250cm9sLnZlbG9jaXR5XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgOTA6XG4gICAgICAgIGlmICh0aGlzLnkgLSBjb250cm9sLnZlbG9jaXR5ID49IDApIHtcbiAgICAgICAgICB0aGlzLnkgLT0gY29udHJvbC52ZWxvY2l0eVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI3MDpcbiAgICAgICAgaWYgKHRoaXMueSArIGNvbnRyb2wudmVsb2NpdHkgPCB0aGlzLmhlaWdodCkge1xuICAgICAgICAgIHRoaXMueSArPSBjb250cm9sLnZlbG9jaXR5XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcm5hbFBsYXllciIsImNsYXNzIFdlYkRyYXdlciB7XG4gIGNvbnN0cnVjdG9yKHBsYXllcnMsIGJvYXJkKSB7XG4gICAgdGhpcy5ib2FyZCA9IG51bGxcbiAgICB0aGlzLnBsYXllcnMgPSBudWxsXG5cbiAgICAvLyBUT0RPOiBleHRlcm5hbGl6ZSB0aGlzXG4gICAgdGhpcy5jID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuYy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIH1cblxuICBpbml0KHBsYXllcnMsIGJvYXJkKSB7XG4gICAgdGhpcy5ib2FyZCA9IGJvYXJkXG4gICAgdGhpcy5wbGF5ZXJzID0gcGxheWVyc1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICAvLyBjb25zb2xlLmNsZWFyKClcbiAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLmJvYXJkWzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZSgnICcgKyBpKVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnJylcbiAgICAvLyBsZXQgZHJhd2luZyA9IG5ldyBJbWFnZSgpXG4gICAgLy8gZHJhd2luZy5zcmMgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9zYW5kL3NsaWNlMzNfMzMucG5nXCJcbiAgICAvLyB0aGlzLmN0eC5kcmF3SW1hZ2UoZHJhd2luZywgMCwgMCwgNzAsIDcwKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMuYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqPHRoaXMuYm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAjICcpXG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmFueVBsYXllcihqLCBpKVxuICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMDBGRjAwXCJcbiAgICAgICAgICAvLyB0aGlzLmN0eC5maWxsUmVjdChqKjEwKzEsIGkqMTArMSwgOCwgOCApXG4gICAgICAgICAgLy8gdGhpcy5jdHguZHJhd0ltYWdlKGRyYXdpbmcsaio3MCwgaSo3MCwgNzAsIDcwKTtcblxuICAgICAgICAgIGxldCBkcmF3aW5nID0gbmV3IEltYWdlKClcbiAgICAgICAgICBkcmF3aW5nLnNyYyA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2ltZy9wbGF5ZXJzL3RhbmsucG5nXCJcbiAgICAgICAgICBkcmF3aW5nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShkcmF3aW5nLGoqNzArMSwgaSo3MCsxLCA1MCwgNTApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwbGF5ZXIuYW5nbGUgPT09IDApIHtcbiAgICAgICAgICAgIC8vIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCcgPiAnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGxheWVyLmFuZ2xlID09PSA5MCkge1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyBeICcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwbGF5ZXIuYW5nbGUgPT09IDE4MCkge1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyA8ICcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwbGF5ZXIuYW5nbGUgPT09IDI3MCkge1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyB2ICcpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiI0ZGMDAwMFwiXG4gICAgICAgICAgLy8gdGhpcy5jdHguZmlsbFJlY3QoaioxMCsxLCBpKjEwKzEsIDgsIDggKVxuICAgICAgICAgIGxldCBkcmF3aW5nID0gbmV3IEltYWdlKClcbiAgICAgICAgICBkcmF3aW5nLnNyYyA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2ltZy9zYW5kL3NsaWNlMzNfMzMucG5nXCJcbiAgICAgICAgICBkcmF3aW5nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShkcmF3aW5nLGoqNzArMSwgaSo3MCsxLCA1MCwgNTApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCcgIyAnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBjb25zb2xlLmxvZygnJylcbiAgICB9XG4gIH1cblxuICBhbnlQbGF5ZXIoeCwgeSkge1xuICAgIHJldHVybiB0aGlzLnBsYXllcnMuZmluZChwID0+IHAueCA9PSB4ICYmIHAueSA9PSB5KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViRHJhd2VyIiwiY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9VdGlscycpXG5cbmNsYXNzIFNhbXBsZVBsYXllciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudHVybk51bWJlciA9IDBcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc29sZS5sb2coYGluaXRgKVxuICB9XG5cbiAgdHVybihjb250cm9sKSB7XG4gICAgY29uc29sZS5sb2coYHR1cm5gKVxuXG4gICAgaWYgKHRoaXMudHVybk51bWJlciAlIDQgPT09IDApIHtcbiAgICAgIGNvbnRyb2wucm90YXRlKDkwKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb250cm9sLm1vdmUoMSlcbiAgICB9XG5cbiAgICB0aGlzLnR1cm5OdW1iZXIrK1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlUGxheWVyIiwiZnVuY3Rpb24gcmFuZG9tSW50KG1heCkge1xuICByZXR1cm4gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQW5nbGUoYW5nbGUpIHtcbiAgaWYgKGFuZ2xlID49IDM2MCkge1xuICAgIHJldHVybiBhbmdsZSAtIDM2MFxuICB9XG4gIGlmIChhbmdsZSA8IDApIHtcbiAgICByZXR1cm4gMzYwIC0gYW5nbGVcbiAgfVxuXG4gIHJldHVybiBhbmdsZVxufVxuXG5mdW5jdGlvbiBjcmVhdGVNdWx0aUFycmF5KHdpZHRoLCBoZWlnaHQpIHtcbiAgbGV0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCkuZmlsbCgwKVxuICBsZXQgYXJyYXkgPSBuZXcgQXJyYXkoaGVpZ2h0KS5maWxsKHJvdylcblxuICByZXR1cm4gYXJyYXlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHJhbmRvbUludCwgbm9ybWFsaXplQW5nbGUsIGNyZWF0ZU11bHRpQXJyYXkgfSIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2NvcmUvR2FtZS5qcycpXG5jb25zdCBXZWJEcmF3ZXIgPSByZXF1aXJlKCcuL2RyYXdlcnMvV2ViRHJhd2VyLmpzJylcbmNvbnN0IFNhbXBsZVBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVycy9zYW1wbGUtcGxheWVyLmpzJylcblxuLy8gY29uc29sZS5sb2coJ1N0YXJ0ZWQuLi4nKVxuXG4vLyBsZXQgZ2FtZSA9IG5ldyBHYW1lKG5ldyBXZWJEcmF3ZXIoKSlcblxuLy8gLy8gYWRkIHBsYXllcnNcbi8vIGdhbWUuYWRkUGxheWVyKG5ldyBTYW1wbGVQbGF5ZXIoKSlcbi8vIGdhbWUuYWRkUGxheWVyKG5ldyBTYW1wbGVQbGF5ZXIoKSlcblxuLy8gLy8gaW5pdFxuLy8gZ2FtZS5pbml0KClcblxuLy8gLy8gc3RhcnRcbi8vIGdhbWUuc3RhcnQoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgR2FtZSwgV2ViRHJhd2VyLCBTYW1wbGVQbGF5ZXIgfVxuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vICAgR2FtZTogcmVxdWlyZSgnLi9jb3JlL0dhbWUuanMnKVxuLy8gfVxuXG4vLyBleHBvcnRzLkdhbWUgPSByZXF1aXJlKCcuL2NvcmUvR2FtZS5qcycpXG5cbiJdfQ==
