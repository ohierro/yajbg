class StaticPlayer {
  constructor(name) {
    this.name = name
  }

  init() {
    console.log(`init`)
  }

  turn() {
    // if (this.turnNumber % 4 === 0) {
    //   control.rotate(90)
    // } else {
    //   control.move(1)
    // }
  }
}

module.exports = StaticPlayer