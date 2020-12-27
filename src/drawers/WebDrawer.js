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
            this.ctx.drawImage(drawing,j*70+1, i*70+1, 20, 20);
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