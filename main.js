const canvasElements = []
const canvasDots = []
let currentAction = null

const canvas = document.querySelector('#canvas')
const addEditBtn = document.querySelector('#editing')
const addLineBtn = document.querySelector('#addLine')

class LineDot {
  _x = 0
  _y = 0
  _listeners = {
    change: []
  }

  constructor () {
    this.el = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    this.el.classList.add('dot')
    canvasDots.push(this)
  }

  set x (val) {
    this._x = val
    this.el.setAttribute('cx', val)

    this._listeners.change.forEach(listener => {
      listener(this)
    })
  }
  get x() {
    return this._x
  }
  set y (val) {
    this._y = val
    this.el.setAttribute('cy', val)

    this._listeners.change.forEach(listener => {
      listener(this)
    })
  }
  get y() {
    return this._y
  }
  addEventListener(type, listener) {
    this._listeners[type].push(listener)
  }
  removeEventListener(type, listener) {
    const index = this._listeners[type].findIndex(l => listener === l)
    this._listeners[type].splice(index, 1);
  }
  append() {
    canvas.append(this.el)
  }
  remove() {
    this.el.remove()
  }
  activeMovable () {
    this._moveListener = (e) => {
      this.x = e.offsetX
      this.y = e.offsetY
    }

    this._startListener = () => {
      this.el.addEventListener('mousemove', this._moveListener)
    }
    this._endListener = () => {
      this.el.removeEventListener('mousemove', this._moveListener)
    }

    this.el.addEventListener('mousedown', this._startListener)
    this.el.addEventListener('mouseup', this._endListener)
    this.el.addEventListener('mouseout', this._endListener)
  }
  deactivateMovable () {
    this.el.removeEventListener('mousedown', this._startListener)
    this.el.removeEventListener('mouseup', this._endListener)
    this.el.removeEventListener('mouseout', this._endListener)
  }
}

class Line {
  _x1 = 0
  _x2 = 0
  _y1 = 0
  _y2 = 0

  constructor () {
    this.el = document.createElementNS("http://www.w3.org/2000/svg", 'line')
    this.dot1 = new LineDot()
    this.dot2 = new LineDot()
    canvasElements.push(this)

    this.dot1.addEventListener('change', (e) => {
      if (this.x1 !== e.x) this.x1 = e.x
      if (this.y1 !== e.y) this.y1 = e.y
    })

    this.dot2.addEventListener('change', (e) => {
      if (this.x2 !== e.x) this.x2 = e.x
      if (this.y2 !== e.y) this.y2 = e.y
    })
  }

  set x1(val) {
    this._x1 = val
    this.dot1.x = val
    this.el.setAttribute('x1', val)
  }
  get x1() {
    return this._x1
  }
  set x2(val) {
    this._x2 = val
    this.dot2.x = val
    this.el.setAttribute('x2', val)
  }
  get x2() {
    return this._x2
  }

  set y1(val) {
    this._y1 = val
    this.dot1.y = val
    this.el.setAttribute('y1', val)
  }
  get y1() {
    return this._y1
  }
  set y2(val) {
    this._y2 = val
    this.dot2.y = val
    this.el.setAttribute('y2', val)
  }
  get y2() {
    return this._y2
  }

  append() {
    canvas.append(this.el)
    this.dot1.append()
    this.dot2.append()
  }
  remove() {
    this.el.remove()
    this.dot1.remove()
    this.dot2.remove()
  }
}

const actions = {
  editing: {
    btnEl: addEditBtn,
    start () {
      canvasDots.forEach(dot => {
        dot.activeMovable()
      })
    },
    end () {
      canvasDots.forEach(dot => {
        dot.deactivateMovable()
      })
    }
  },
  addLine: {
    _currentLine: null,
    _clickCount: 0,
    btnEl: addLineBtn,
    start() {
      this._currentLine = null
      this._clickCount = 0
      const _moveListener = (e) => {
        if (this._currentLine) {
          this._currentLine.x2 = e.offsetX
          this._currentLine.y2 = e.offsetY
        }
      }
      this._addLineClickListener = (e) => {
        this._clickCount++
        switch (this._clickCount) {
          case 1:
            this._currentLine = new Line()
            this._currentLine.x1 = e.offsetX
            this._currentLine.y1 = e.offsetY
            this._currentLine.x2 = e.offsetX
            this._currentLine.y2 = e.offsetY
            this._currentLine.append()
            canvas.addEventListener('mousemove', _moveListener)
            break;
          case 2:
            if (this._currentLine) {
              this._currentLine.x2 = e.offsetX
              this._currentLine.y2 = e.offsetY
              this._clickCount = 0
              canvas.removeEventListener('mousemove', _moveListener)
              this._currentLine = null
            }
            break;
        }
      }
      canvas.addEventListener('click', this._addLineClickListener)
    },
    end() {
      this._currentLine = null
      this._clickCount = 0
      canvas.removeEventListener('click', this._addLineClickListener)
    }
  }
}

function activateAction(actionName) {
  if (currentAction) {
    currentAction.btnEl.classList.remove('active')
    currentAction.end()
  }


  if (actions[actionName]) {
    currentAction = actions[actionName]
    currentAction.start()
    currentAction.btnEl.classList.add('active')
  } else {
    currentAction = null
  }
}

addEditBtn.onclick = () => activateAction('editing')
addLineBtn.onclick = () => activateAction('addLine')
