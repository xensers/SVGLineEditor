// <line x1="10" x2="50" y1="110" y2="150" stroke="orange" fill="transparent" stroke-width="5"/>

// <circle cx="10" cy="110" r="10" stroke="#ccc" fill="transparent" stroke-width="1"/>

const canvasElements = []
let currentAction = null

const canvas = document.querySelector('#canvas')
const addLineBtn = document.querySelector('#addLine')


function oldCode () {
  const line = document.createElementNS("http://www.w3.org/2000/svg", 'line')
  let x1 = 10
  let y1 = 110
  let x2 = 50
  let y2 = 150

  line.setAttribute('x1', x1)
  line.setAttribute('y1', y1)
  line.setAttribute('x2', x2)
  line.setAttribute('y2', y2)
  canvas.append(line)



  const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
  circle.classList.add('dot')
  circle.setAttribute('cx', x2)
  circle.setAttribute('cy', y2)
  canvas.append(circle)


  const moveListener = e => {
    console.log(e.movementX, e.movementY)
    x2 += e.movementX
    y2 += e.movementY

    circle.setAttribute('cx', x2)
    circle.setAttribute('cy', y2)

    line.setAttribute('x2', x2)
    line.setAttribute('y2', y2)
  }


  const downListener = (e) => {
    console.log('down')
    canvas.addEventListener('mousemove', moveListener)
  }
  const upListener = e => {
    console.log('up')
    canvas.removeEventListener('mousemove', moveListener)
  }

  circle.addEventListener('mousedown', downListener)
  canvas.addEventListener('mouseup', upListener)
  canvas.addEventListener('mouseout', upListener)
}

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
      console.log(this)
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
      console.log('start', this)
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
