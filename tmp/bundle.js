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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db250cm9sLmpzIiwic3JjL2NvcmUvR2FtZS5qcyIsInNyYy9jb3JlL0ludGVybmFsUGxheWVyLmpzIiwic3JjL2RyYXdlcnMvV2ViRHJhd2VyLmpzIiwic3JjL3BsYXllcnMvc2FtcGxlLXBsYXllci5qcyIsInNyYy91dGlscy9VdGlscy5qcyIsInNyYy93ZWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IE9wZXJhdGlvbnMgPSB7XG4gIE5PTkU6ICdub25lJyxcbiAgTU9WRTogJ21vdmUnLFxuICBST1RBVEU6ICdyb3RhdGUnXG59XG5cbmNsYXNzIENvbnRyb2wge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYW5nbGUgPSAwXG4gICAgdGhpcy52ZWxvY2l0eSA9IDBcbiAgICB0aGlzLm9wZXJhdGlvbiA9IE9wZXJhdGlvbnMuTk9ORVxuICB9XG5cbiAgbW92ZSh2ZWxvY2l0eSkge1xuICAgIHRoaXMudmVsb2NpdHkgPSB2ZWxvY2l0eVxuICAgIHRoaXMub3BlcmF0aW9uID0gT3BlcmF0aW9ucy5NT1ZFXG4gIH1cblxuICByb3RhdGUoYW5nbGUpIHtcbiAgICB0aGlzLmFuZ2xlICs9IGFuZ2xlXG4gICAgdGhpcy5vcGVyYXRpb24gPSBPcGVyYXRpb25zLlJPVEFURVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDb250cm9sLCBPcGVyYXRpb25zXG59IiwiLy8gaW1wb3J0IHsgU2FtcGxlUGxheWVyIH0gZnJvbSBcIi4uL3BsYXllcnMvc2FtcGxlLXBsYXllclwiXG5jb25zdCBJbnRlcm5hbFBsYXllciA9IHJlcXVpcmUoJy4vSW50ZXJuYWxQbGF5ZXInKVxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9VdGlscycpXG5jb25zdCBTYW1wbGVQbGF5ZXIgPSByZXF1aXJlKCcuLi9wbGF5ZXJzL3NhbXBsZS1wbGF5ZXInKVxuXG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoZHJhd2VyKSB7XG4gICAgdGhpcy5wbGF5ZXJzID0gW11cbiAgICB0aGlzLmJvYXJkID0gVXRpbHMuY3JlYXRlTXVsdGlBcnJheSg4LDUpXG4gICAgdGhpcy5kcmF3ZXIgPSBkcmF3ZXJcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlXG4gICAgdGhpcy5lbmRlZCA9IGZhbHNlXG4gICAgdGhpcy50dXJuTnVtYmVyID0gMFxuICB9XG5cbiAgYWRkUGxheWVyKHBsYXllcikge1xuICAgIHRoaXMucGxheWVycy5wdXNoKFxuICAgICAgbmV3IEludGVybmFsUGxheWVyKHBsYXllciwgdGhpcy5ib2FyZFswXS5sZW5ndGgsIHRoaXMuYm9hcmQubGVuZ3RoKVxuICAgIClcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ0dBTUUgSU5JVCcpXG5cbiAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChwID0+IHAuZG9Jbml0KFxuICAgICAgVXRpbHMucmFuZG9tSW50KHRoaXMuYm9hcmQubGVuZ3RoKSxcbiAgICAgIFV0aWxzLnJhbmRvbUludCh0aGlzLmJvYXJkLmxlbmd0aCksXG4gICAgICAxMDBcbiAgICApKVxuXG4gICAgdGhpcy5kcmF3ZXIuaW5pdCh0aGlzLnBsYXllcnMsIHRoaXMuYm9hcmQpXG4gIH1cblxuICBhc3luYyBzdGFydCgpIHtcbiAgICBjb25zb2xlLmxvZygnR0FNRSBTVEFSVCcpXG5cbiAgICB3aGlsZSAoIXRoaXMuZW5kZWQpIHtcbiAgICAgIHRoaXMudHVybigpXG5cbiAgICAgIHRoaXMudHVybk51bWJlcisrXG4gICAgICAvLyBpZiAodGhpcy50dXJuTnVtYmVyID4gMTApIHtcbiAgICAgIC8vICAgdGhpcy5lbmRlZCA9IHRydWVcbiAgICAgIC8vIH1cbiAgICAgIGF3YWl0IHRoaXMuc2xlZXAoMTAwMClcbiAgICB9XG4gIH1cblxuICBzbGVlcChtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gICAgfSk7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnBhdXNlZCA9IHRydWVcbiAgfVxuXG4gIHR1cm4oKSB7XG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocCA9PiBwLmRvVHVybigpKVxuXG4gICAgdGhpcy5kcmF3ZXIuZHJhdygpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lIiwiY29uc3QgeyBDb250cm9sLCBPcGVyYXRpb25zIH0gPSByZXF1aXJlKCcuL0NvbnRyb2wnKVxuY29uc3QgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9VdGlscycpXG5cbmNsYXNzIEludGVybmFsUGxheWVyIHtcbiAgY29uc3RydWN0b3IocGxheWVyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy54ID0gMFxuICAgIHRoaXMueSA9IDBcbiAgICB0aGlzLmFuZ2xlID0gMFxuICAgIHRoaXMubGlmZSA9IDEwMFxuICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXJcbiAgfVxuXG4gIGRvSW5pdCh4LCB5LCBsaWZlKSB7XG4gICAgdGhpcy54ID0geFxuICAgIHRoaXMueSA9IHlcbiAgICB0aGlzLmxpZmUgPSBsaWZlXG4gICAgdGhpcy5wbGF5ZXIuaW5pdCgpXG4gIH1cblxuICBkb1R1cm4oKSB7XG4gICAgbGV0IGNvbnRyb2wgPSBuZXcgQ29udHJvbCgpXG4gICAgdGhpcy5wbGF5ZXIudHVybihjb250cm9sKVxuXG4gICAgY29uc29sZS5sb2coYENPTlRST0wgJHtKU09OLnN0cmluZ2lmeShjb250cm9sKX1gKVxuICAgIGNvbnNvbGUubG9nKGBQTEFZRVIgJHtKU09OLnN0cmluZ2lmeSh0aGlzKX1gKVxuXG4gICAgc3dpdGNoKGNvbnRyb2wub3BlcmF0aW9uKSB7XG4gICAgICBjYXNlIE9wZXJhdGlvbnMuTk9ORTpcbiAgICAgICAgY29uc29sZS5sb2coJ05PTkUgb3BlcmF0aW9uJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPcGVyYXRpb25zLk1PVkU6XG4gICAgICAgIGNvbnNvbGUubG9nKCdNT1ZFIG9wZXJhdGlvbicpO1xuICAgICAgICB0aGlzLm1vdmUoY29udHJvbClcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE9wZXJhdGlvbnMuUk9UQVRFOlxuICAgICAgICBjb25zb2xlLmxvZygnUk9UQVRFIG9wZXJhdGlvbicpO1xuICAgICAgICB0aGlzLnJvdGF0ZShjb250cm9sKVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUubG9nKCdOT09QJylcbiAgICB9XG4gIH1cblxuICByb3RhdGUoY29udHJvbCkge1xuICAgIGlmIChjb250cm9sLmFuZ2xlICE9PSA5MCAmJiBjb250cm9sLmFuZ2xlICE9PSAxODAgJiYgY29udHJvbC5hbmdsZSAhPT0gMjcwICYmXG4gICAgICAgIGNvbnRyb2wuYW5nbGUgIT09IC05MCAmJiBjb250cm9sLmFuZ2xlICE9PSAtMTgwICYmIGNvbnRyb2wuYW5nbGUgIT09IC0yNzApIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdhbmdsZSBzaG91bGQgYmUgKy0oOTAsMTgwLDI3MCknKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFuZ2xlICs9IGNvbnRyb2wuYW5nbGVcbiAgICAgIHRoaXMuYW5nbGUgPSBVdGlscy5ub3JtYWxpemVBbmdsZSh0aGlzLmFuZ2xlKVxuICAgIH1cbiAgfVxuXG4gIG1vdmUoY29udHJvbCkge1xuICAgIHN3aXRjaCh0aGlzLmFuZ2xlKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGlmICh0aGlzLnggKyBjb250cm9sLnZlbG9jaXR5IDwgdGhpcy53aWR0aCkge1xuICAgICAgICAgIHRoaXMueCArPSBjb250cm9sLnZlbG9jaXR5XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTgwOlxuICAgICAgICBpZiAodGhpcy54IC0gY29udHJvbC52ZWxvY2l0eSA+PSAwKSB7XG4gICAgICAgICAgdGhpcy54IC09IGNvbnRyb2wudmVsb2NpdHlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSA5MDpcbiAgICAgICAgaWYgKHRoaXMueSAtIGNvbnRyb2wudmVsb2NpdHkgPj0gMCkge1xuICAgICAgICAgIHRoaXMueSAtPSBjb250cm9sLnZlbG9jaXR5XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjcwOlxuICAgICAgICBpZiAodGhpcy55ICsgY29udHJvbC52ZWxvY2l0eSA8IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgdGhpcy55ICs9IGNvbnRyb2wudmVsb2NpdHlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVybmFsUGxheWVyIiwiY2xhc3MgV2ViRHJhd2VyIHtcbiAgY29uc3RydWN0b3IocGxheWVycywgYm9hcmQpIHtcbiAgICB0aGlzLmJvYXJkID0gbnVsbFxuICAgIHRoaXMucGxheWVycyA9IG51bGxcblxuICAgIC8vIFRPRE86IGV4dGVybmFsaXplIHRoaXNcbiAgICB0aGlzLmMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Q2FudmFzXCIpO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jLmdldENvbnRleHQoXCIyZFwiKTtcbiAgfVxuXG4gIGluaXQocGxheWVycywgYm9hcmQpIHtcbiAgICB0aGlzLmJvYXJkID0gYm9hcmRcbiAgICB0aGlzLnBsYXllcnMgPSBwbGF5ZXJzXG4gIH1cblxuICBkcmF3KCkge1xuICAgIC8vIGNvbnNvbGUuY2xlYXIoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMuYm9hcmRbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCcgJyArIGkpXG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCcnKVxuICAgIC8vIGxldCBkcmF3aW5nID0gbmV3IEltYWdlKClcbiAgICAvLyBkcmF3aW5nLnNyYyA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3NhbmQvc2xpY2UzM18zMy5wbmdcIlxuICAgIC8vIHRoaXMuY3R4LmRyYXdJbWFnZShkcmF3aW5nLCAwLCAwLCA3MCwgNzApO1xuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmN0eC53aWR0aCwgdGhpcy5jdHguaGVpZ2h0KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5ib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGo8dGhpcy5ib2FyZFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnICMgJylcbiAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuYW55UGxheWVyKGosIGkpXG4gICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcIiMwMEZGMDBcIlxuICAgICAgICAgIC8vIHRoaXMuY3R4LmZpbGxSZWN0KGoqMTArMSwgaSoxMCsxLCA4LCA4IClcbiAgICAgICAgICAvLyB0aGlzLmN0eC5kcmF3SW1hZ2UoZHJhd2luZyxqKjcwLCBpKjcwLCA3MCwgNzApO1xuXG4gICAgICAgICAgbGV0IGRyYXdpbmcgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgIGRyYXdpbmcuc3JjID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvaW1nL3BsYXllcnMvdGFuay5wbmdcIlxuICAgICAgICAgIGRyYXdpbmcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGRyYXdpbmcsaio3MCsxLCBpKjcwKzEsIDUwLCA1MCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBsYXllci5hbmdsZSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyA+ICcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwbGF5ZXIuYW5nbGUgPT09IDkwKSB7XG4gICAgICAgICAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZSgnIF4gJylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBsYXllci5hbmdsZSA9PT0gMTgwKSB7XG4gICAgICAgICAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZSgnIDwgJylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBsYXllci5hbmdsZSA9PT0gMjcwKSB7XG4gICAgICAgICAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZSgnIHYgJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjRkYwMDAwXCJcbiAgICAgICAgICAvLyB0aGlzLmN0eC5maWxsUmVjdChqKjEwKzEsIGkqMTArMSwgOCwgOCApXG4gICAgICAgICAgbGV0IGRyYXdpbmcgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgIGRyYXdpbmcuc3JjID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvaW1nL3NhbmQvc2xpY2UzM18zMy5wbmdcIlxuICAgICAgICAgIGRyYXdpbmcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGRyYXdpbmcsaio3MCsxLCBpKjcwKzEsIDUwLCA1MCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyAjICcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNvbnNvbGUubG9nKCcnKVxuICAgIH1cbiAgfVxuXG4gIGFueVBsYXllcih4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVycy5maW5kKHAgPT4gcC54ID09IHggJiYgcC55ID09IHkpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXZWJEcmF3ZXIiLCJjb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL1V0aWxzJylcblxuY2xhc3MgU2FtcGxlUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50dXJuTnVtYmVyID0gMFxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZyhgaW5pdGApXG4gIH1cblxuICB0dXJuKGNvbnRyb2wpIHtcbiAgICBjb25zb2xlLmxvZyhgdHVybmApXG5cbiAgICBpZiAodGhpcy50dXJuTnVtYmVyICUgNCA9PT0gMCkge1xuICAgICAgY29udHJvbC5yb3RhdGUoOTApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRyb2wubW92ZSgxKVxuICAgIH1cblxuICAgIHRoaXMudHVybk51bWJlcisrXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW1wbGVQbGF5ZXIiLCJmdW5jdGlvbiByYW5kb21JbnQobWF4KSB7XG4gIHJldHVybiBwYXJzZUludChNYXRoLnJhbmRvbSgpICogbWF4KVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVBbmdsZShhbmdsZSkge1xuICBpZiAoYW5nbGUgPj0gMzYwKSB7XG4gICAgcmV0dXJuIGFuZ2xlIC0gMzYwXG4gIH1cbiAgaWYgKGFuZ2xlIDwgMCkge1xuICAgIHJldHVybiAzNjAgLSBhbmdsZVxuICB9XG5cbiAgcmV0dXJuIGFuZ2xlXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU11bHRpQXJyYXkod2lkdGgsIGhlaWdodCkge1xuICBsZXQgcm93ID0gbmV3IEFycmF5KHdpZHRoKS5maWxsKDApXG4gIGxldCBhcnJheSA9IG5ldyBBcnJheShoZWlnaHQpLmZpbGwocm93KVxuXG4gIHJldHVybiBhcnJheVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgcmFuZG9tSW50LCBub3JtYWxpemVBbmdsZSwgY3JlYXRlTXVsdGlBcnJheSB9IiwiY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vY29yZS9HYW1lLmpzJylcbmNvbnN0IFdlYkRyYXdlciA9IHJlcXVpcmUoJy4vZHJhd2Vycy9XZWJEcmF3ZXIuanMnKVxuY29uc3QgU2FtcGxlUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXJzL3NhbXBsZS1wbGF5ZXIuanMnKVxuXG4vLyBjb25zb2xlLmxvZygnU3RhcnRlZC4uLicpXG5cbi8vIGxldCBnYW1lID0gbmV3IEdhbWUobmV3IFdlYkRyYXdlcigpKVxuXG4vLyAvLyBhZGQgcGxheWVyc1xuLy8gZ2FtZS5hZGRQbGF5ZXIobmV3IFNhbXBsZVBsYXllcigpKVxuLy8gZ2FtZS5hZGRQbGF5ZXIobmV3IFNhbXBsZVBsYXllcigpKVxuXG4vLyAvLyBpbml0XG4vLyBnYW1lLmluaXQoKVxuXG4vLyAvLyBzdGFydFxuLy8gZ2FtZS5zdGFydCgpXG5cbm1vZHVsZS5leHBvcnRzID0geyBHYW1lLCBXZWJEcmF3ZXIsIFNhbXBsZVBsYXllciB9XG5cbi8vIG1vZHVsZS5leHBvcnRzID0ge1xuLy8gICBHYW1lOiByZXF1aXJlKCcuL2NvcmUvR2FtZS5qcycpXG4vLyB9XG5cbi8vIGV4cG9ydHMuR2FtZSA9IHJlcXVpcmUoJy4vY29yZS9HYW1lLmpzJylcblxuIl19
