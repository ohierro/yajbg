class Misile {
  constructor(x, y, angle, velocity, width, height) {
    this.x = x
    this.y = y
    this.angle = angle
    this.velocity = velocity
    this.width = width
    this.height = height
  }

  doTurn(game) {
    let path = this.calculatePath()

    if (path.length === 0) {
      return -1
    }
    let steps = this.velocity < path.length ? this.velocity : path.length

    for (let i = 0; i<steps; i++) {
      // game.players.forEach(player => {
      //   if (player.x === path[i].x && player.y === path[i].y) {
      //     console.log('PLAYER HIT!!')
      //     player.life -= 10
      //     return -1
      //   }
      // })
      for (let j = 0; j<game.players.length; j++) {
        let player = game.players[j]

        if (player.x === path[i].x && player.y === path[i].y) {
          console.log('PLAYER HIT!!')
          player.life -= 10
          return -1
        }
      }
    }

    this.x = path[steps-1].x
    this.y = path[steps-1].y
    return 1
  }

  calculatePath() {
    let path = []

    if (this.angle === 0) {
      let currentX = this.x

      currentX++
      while (currentX < this.width) {
        path.push({ x: currentX, y: this.y })
        currentX++
      }
    }
    if (this.angle === 90) {
      let currentY = this.y

      currentY--
      while (currentY >= 0) {
        path.push({ x: this.x, y: currentY })
        currentY--
      }
    }
    if (this.angle === 180) {
      let currentX = this.x

      currentX--
      while (currentX >= 0) {
        path.push({ x: currentX, y: this.y })
        currentX--
      }
    }
    if (this.angle === 270) {
      let currentY = this.y

      currentY++
      while (currentY < this.height) {
        path.push({ x: this.x, y: currentY })
        currentY++
      }
    }

    return path
  }
}

module.exports = Misile