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