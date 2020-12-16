// class Utils {
//   random(max) {
//     return Math.random() * max
//   }
// }

function randomInt(max) {
  return parseInt(Math.random() * max)
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

module.exports = { randomInt, normalizeAngle }