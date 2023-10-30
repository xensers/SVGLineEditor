const canvasElements = []
let currentAction = null

const canvas = document.querySelector('#canvas')
const addLineBtn = document.querySelector('#addLine')

class LineDot {
  _x = 0
  _y = 0

  constructor (target) {
    this.target = target
    this.el = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    this.el.classList.add('dot')
  }

  set x (val) {
    this._x = val
    this.el.setAttribute('cx', val)
  }
  get x() {
    return this._x
  }
  set y (val) {
    this._y = val
    this.el.setAttribute('cy', val)
  }
  get y() {
    return this._y
  }
  append() {
    canvas.append(this.el)
  }
  remove() {
    this.el.remove()
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
  addLine: {
    _currentLine: null,
    _clickCount: 0,
    _moveListener(e) {
      if (this._currentLine) {
        this._currentLine.x2 = e.offsetX
        this._currentLine.y2 = e.offsetY
      }
    },
    _addLineClickListener (e) {
      this._clickCount++
      switch (this._clickCount) {
        case 1:
          this._currentLine = new Line()
          this._currentLine.x1 = e.offsetX
          this._currentLine.y1 = e.offsetY
          this._currentLine.x2 = e.offsetX
          this._currentLine.y2 = e.offsetY
          this._currentLine.append()
          canvas.addEventListener('mousemove', this._moveListener.bind(this))
          break;
        case 2:
          if (this._currentLine) {
            this._currentLine.x2 = e.offsetX
            this._currentLine.y2 = e.offsetY
            this._clickCount = 0
            canvas.removeEventListener('mousemove', this._moveListener.bind(this))
            canvasElements.push(this._currentLine)
            this._currentLine = null
          }
          break;
      }
    },
    start() {
      this._currentLine = null
      this._clickCount = 0
      canvas.addEventListener('click', this._addLineClickListener.bind(this))
    },
    end() {
      this._currentLine = null
      this._clickCount = 0
      canvas.removeEventListener('click', this._addLineClickListener.bind(this))
    }
  }
}

addLineBtn.onclick = () => {
  if (currentAction) {
    currentAction.end()
  }
  currentAction = actions.addLine
  actions.addLine.start()
}
