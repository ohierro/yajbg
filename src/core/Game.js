// import { SamplePlayer } from "../players/sample-player"
const InternalPlayer = require('./InternalPlayer')
const Utils = require('../utils/Utils')
const SamplePlayer = require('../players/sample-player')
const GameSnapshot = require('./GameSnapshot.js')
const Misile = require('./Misile')
const Explossion = require('./objects/Explossion')

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

    this.objects = []

    this.players.forEach(p => {
      // p.doInit(
      // Utils.randomInt(this.board.length),
      // Utils.randomInt(this.board.length),
      // 100)
      if (p.player instanceof SamplePlayer) {
        p.doInit(3,3,100)
      } else {
        p.doInit(1,3,100)
      }
    })

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
    // some previous shuffle??
    this.players.forEach(p => {
      let result = p.doTurn()

      if (result !== null) {
        this.objects.push(result)
      }
    })

    // objects iterations
    let nextGenObjects = []
    for (let i = 0; i<this.objects.length; i++) {

      if (this.objects[i].doTurn(this) != -1) {
        nextGenObjects.push(this.objects[i])
      }
    }
    this.objects = nextGenObjects

    // check players health
    for (let i = 0; i<this.players.length; i++) {
      let player = this.players[i]

      if (player.life <= 0) {
        this.logger.info(`Player ${player.name} has DIED!!`)
        this.objects.push(new Explossion(player.x, player.y))
      }
    }

    this.drawer.draw2(new GameSnapshot(this.players, this.board, this.objects))
  }
}

module.exports = Game