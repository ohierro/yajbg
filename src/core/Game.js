// import { SamplePlayer } from "../players/sample-player"
const InternalPlayer = require('./InternalPlayer')
const Utils = require('../utils/Utils')
const SamplePlayer = require('../players/sample-player')
const GameSnapshot = require('./GameSnapshot.js')

class Game {
  constructor(drawer, logger) {
    this.players = []
    this.board = Utils.createMultiArray(8,5)
    this.objects = []

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
    this.logger.info('GAME INIT')

    this.players.forEach(p => p.doInit(
      Utils.randomInt(this.board.length),
      Utils.randomInt(this.board.length),
      100
    ))

    this.drawer.init(this.players, this.board, this.objects)
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

  nextTick() {
    this.logger.debug(`TURN ${this.turnNumber}`)

    this.turn()

    this.logger.debug(`OBJECTS ${this.objects}`)

    this.turnNumber++
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
    this.objects = []

    this.players.forEach(p => {
      let result = p.doTurn()

      if (result !== null) {
        this.objects.push(result)
      }
    })

    this.drawer.draw2(new GameSnapshot(this.players, this.board, this.objects))
  }
}

module.exports = Game