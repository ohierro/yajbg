class Misile {
  constructor(x, y, angle, velocity, width, height) {
    this.x = x
    this.y = y
    this.angle = angle
    this.velocity = velocity
    this.width = width
    this.height = height
  }

  calculatePath() {
    let path = []

    if (this.angle === 0) {
      let currentX = this.x

      while (currentX < width) {
        path.push({ x: currentX, y })
        currentX++
      }
    }
    if (this.angle === 90) {
      let currentY = this.y

      while (currentY > 0) {
        path.push({ x, y: currentY })
        currentY--
      }
    }
    if (this.angle === 180) {
      let currentX = this.x

      while (currentX > 0) {
        path.push({ x: currentX, y })
        currentX--
      }
    }
    if (this.angle === 270) {
      let currentY = this.y

      while (currentY < height) {
        path.push({ x, y: currentY })
        currentY++
      }
    }


  }
}

module.exports = Misile