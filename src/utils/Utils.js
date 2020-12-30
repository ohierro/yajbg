const { random } = require("lodash")

function randomInt(max) {
  return parseInt(Math.random() * max)
}

function randomItem(list) {
  index = randomInt(list.length)

  return list[index]
}

function normalizeAngle(angle) {
  if (angle >= 360) {
    return angle - 360
  }
  if (angle < 0) {
    return 360 - angle
  }

  return angle
}

function createMultiArray(width, height) {
  let row = new Array(width).fill(0)
  let array = new Array(height).fill(row)

  return array
}

module.exports = { randomInt, normalizeAngle, createMultiArray }