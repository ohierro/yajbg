const Utils = require('../utils/Utils')

class SamplePlayer {
  constructor(name, x, y) {
    this.turnNumber = 0
    this.name = name
    this.x = 4
    this.y = 3
  }

  init() {
    console.log(`init`)
  }

  turn(control) {
    console.log(`turn`)

    if (this.turnNumber % 4 === 0) {
      control.rotate(90)
    // } else if (this.turnNumber % 3 === 0) {
    //   control.move(1)
    } else {
      control.shoot()
    }

    this.turnNumber++
  }
}

module.exports = SamplePlayer