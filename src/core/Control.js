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