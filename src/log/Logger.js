const INFO = 3
const DEBUG = 2

class Logger {
  constructor(idHtmlLog, level) {
    this.el = document.getElementById(idHtmlLog)
    this.level = level
    this.msgs = []
  }

  info(msg) {
    this.msgs.push({ level: INFO, msg: msg })
    this.flush()
  }

  debug(msg) {
    this.msgs.push({ level: DEBUG, msg: msg })
    this.flush()
  }

  flush() {
    this.msgs.forEach(msg => this.el.innerHTML += `${msg.level}: ${msg.msg}\n`)
    this.el.scrollTop = this.el.scrollHeight;
    this.msgs = []
  }
}

module.exports = Logger