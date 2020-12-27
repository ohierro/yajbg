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