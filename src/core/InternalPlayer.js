const { Control, Operations } = require('./Control')
const Utils = require('../utils/Utils')

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
      default:
        this.logger.debug('NOOP')
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