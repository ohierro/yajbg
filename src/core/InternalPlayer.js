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