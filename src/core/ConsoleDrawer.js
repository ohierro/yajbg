class ConsoleDrawer {
  constructor(players, board) {
    this.board = null
    this.players = null
  }

  init(players, board) {
    this.board = board
    this.players = players
  }

  draw() {
    console.clear()
    for (let i = 0; i<this.board[0].length; i++) {
      process.stdout.write(' ' + i)
    }
    console.log('')

    for (let i = 0; i<this.board.length; i++) {
      for (let j = 0; j<this.board[i].length; j++) {
        // console.log(' # ')
        let player = this.anyPlayer(j, i)
        if (player) {
          if (player.angle === 0) {
            process.stdout.write(' > ')
          }
          if (player.angle === 90) {
            process.stdout.write(' ^ ')
          }
          if (player.angle === 180) {
            process.stdout.write(' < ')
          }
          if (player.angle === 270) {
            process.stdout.write(' v ')
          }
        } else {
          process.stdout.write(' # ')
        }
      }
      console.log('')
    }
  }

  anyPlayer(x, y) {
    return this.players.find(p => p.x == x && p.y == y)
  }
}

module.exports = ConsoleDrawer