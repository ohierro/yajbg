// import { SamplePlayer } from "../players/sample-player"
const InternalPlayer = require('./InternalPlayer')
const Utils = require('../utils/Utils')
const SamplePlayer = require('../players/sample-player')

class Game {
  constructor(drawer, logger) {
    this.players = []
    this.board = Utils.createMultiArray(8,5)
    this.drawer = drawer
    this.logger = logger
    this.paused = false
    this.ended = false
    this.turnNumber = 0
  }

  addPlayer(player) {
    this.players.push(
      new InternalPlayer(player, this.board[0].length, this.board.length, this.logger)
    )
  }

  init() {
    console.log('GAME INIT')

    this.players.forEach(p => p.doInit(
      Utils.randomInt(this.board.length),
      Utils.randomInt(this.board.length),
      100
    ))

    this.drawer.init(this.players, this.board)
  }

  async start() {
    console.log('GAME START')

    while (!this.ended) {
      this.turn()

      this.turnNumber++
      // if (this.turnNumber > 10) {
      //   this.ended = true
      // }
      await this.sleep(1000)
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  pause() {
    this.paused = true
  }

  turn() {
    this.players.forEach(p => p.doTurn())

    this.drawer.draw()
  }
}

module.exports = Game