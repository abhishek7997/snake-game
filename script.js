// Constants used for things related to canvas drawing
const CANVAS_ID = "gameCanvas"
const CANVAS_HEIGHT = 300
const CANVAS_WIDTH = 300
const CTX_LINE_WIDTH = 2

let foodX, foodY // Variabled related to the position of the food item on the canvas
let changingDirection // Check if player is changing direction
let dx = 10 // Horizontal velocity
let dy = 0 // Vertical velocity
let prevdx = dx,
  prevdy = dy // Upon pausing (mouse click event) store the current velocity before setting dx,dy to zero
var paused = false // If game is paused or not
var score = 0 // Store the score for the current game
var highestScore = 0 // Store the highest score achieved by the player
var prevScore = 0 // ??
var randblock = 0 // Used to create different coloured food items with different scores

// Constants corresponding to the value of the arrow keys
const LEFT_KEY = 37
const UP_KEY = 38
const RIGHT_KEY = 39
const DOWN_KEY = 40

// using 'randblock' pick a color and the score for the food item to be drawn on the canvas
const colortoscore = [
  {
    color: "red",
    score: 10,
  },
  {
    color: "blue",
    score: 20,
  },
  {
    color: "green",
    score: 30,
  },
]

// Initial position of the body parts of the snake on the canvas
var snake = [
  { x: 150, y: 150 }, // Head of snake
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 }, // Tail of snake
]

// Standard functions to use the canvas
var canvas = document.getElementById(CANVAS_ID)
var context = canvas.getContext("2d")

// Allows the player to click on the canvas to pause/resume the game
canvas.addEventListener("click", pause)

// Allows the player to change the direction of the snake
document.addEventListener("keydown", changeDirection)
document.addEventListener("keyleft", changeDirection)
document.addEventListener("keyright", changeDirection)
document.addEventListener("keyup", changeDirection)

// Upon hovering over the 'i' button (info), some useful information is displayed alongside the button
document.getElementById("info-button").addEventListener("mouseenter", () => {
  var info = document.getElementById("info-button")
  var extrainfo = document.getElementsByClassName("extra-info")[0]
  extrainfo.style.top = info.offsetTop + info.offsetHeight / 2 - 28 + "px"
  extrainfo.style.left = info.offsetLeft + info.offsetWidth + 15 + "px"
  extrainfo.style.display = "block"
})

document.getElementById("info-button").addEventListener("mouseout", () => {
  document.getElementsByClassName("extra-info")[0].style.display = "none"
})

// Allows the player to reset the game entirely (set score and high score to zero)
resetbutton.addEventListener("click", reset)
resetbutton.addEventListener("click", mouseReset)

// reset the highest score also if resetted using mouse
function mouseReset() {
  document.getElementById("highestscore").innerHTML = 0
}

// Reset the game, set all variables to their initial values
function reset() {
  snake = [
    { x: 150, y: 150 }, // Head of snake
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 }, // Tail of snake
  ]
  changingDirection = false
  paused = false
  dx = 10
  dy = 0
  score = 0
  document.getElementById("score").innerHTML = 0
  // document.getElementById("highestscore").innerHTML = 0
  highestScore = 0
  prevScore = 0
  clearCanvas() // Upon reset, clear the entire canvas
  createFood() // Set the coordinates of the fruit item
  drawFood() // Actually draw the fruit item on the canvas with the set coordinates
}

// This will create the canvas, white with black border
function createCanvas() {
  context.fillStyle = "white"
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.lineWidth = CTX_LINE_WIDTH
  context.strokeStyle = "black"
  context.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

// Clear all things in the canvas
function clearCanvas() {
  context.fillStyle = "white"
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.strokeStyle = "black"
  context.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

// Draw each body part of our snake on the canvas based on their coordinates
function drawSnakePart(snakePart) {
  context.fillStyle = "lightgreen"
  context.fillRect(snakePart.x, snakePart.y, 10, 10)

  context.strokeStyle = "darkgreen"
  context.strokeRect(snakePart.x, snakePart.y, 10, 10)
}

// Call the above to draw each body part of snake
function drawSnake() {
  snake.forEach((s) => drawSnakePart(s))
}

// Move snake
function advanceSnake() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  }

  let didEatFood = snake[0].x === foodX && snake[0].y === foodY
  snake.unshift(head)
  if (didEatFood) {
    score += colortoscore[randblock].score
    document.getElementById("score").innerHTML = score
    createFood()
    return
  }
  snake.pop()
}

// Changes direction based on keyboard arrow input
function changeDirection(event) {
  if (changingDirection) return

  changingDirection = true

  const keyPressed = event.keyCode
  const goingUp = dy === -10
  const goingDown = dy === 10
  const goingRight = dx === 10
  const goingLeft = dx === -10

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10
    dy = 0
  } else if (keyPressed === UP_KEY && !goingDown) {
    dx = 0
    dy = -10
  } else if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10
    dy = 0
  } else if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0
    dy = 10
  }
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

// Set the coordinates of the food item to be drawn
function createFood() {
  randblock = Math.floor(Math.random() * 3)
  foodX = randomTen(0, canvas.width - 10)
  foodY = randomTen(0, canvas.height - 10)
}

snake.forEach(function isFoodOnSnake(part) {
  const foodIsOnSnake = part.x === foodX && part.y === foodY
  if (foodIsOnSnake) createFood()
})

// Draw the food item on the canvas based on set coordinates
function drawFood() {
  context.fillStyle = colortoscore[randblock].color
  context.fillRect(foodX, foodY, 10, 10)
  context.strokeStyle = "dark" + colortoscore[randblock].color
  context.strokeRect(foodX, foodY, 10, 10)
}

// Check if game has ended
function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
    if (didCollide) return true
  }

  const hitLeftWall = snake[0].x < 0
  const hitUpWall = snake[0].y < 0
  const hitRightWall = snake[0].x > CANVAS_WIDTH
  const hitDownWall = snake[0].y > CANVAS_HEIGHT
  return hitLeftWall || hitUpWall || hitRightWall || hitDownWall
}

// Pause the game
function pause() {
  paused = !paused
  if (paused) {
    prevdx = dx
    prevdy = dy
    dx = dy = 0
  } else {
    dx = prevdx
    dy = prevdy
  }
}

// Starting point
function main() {
  if (didGameEnd()) {
    // alert("Oh no! Game Over :(")
    prevScore = parseInt(document.getElementById("highestscore").innerHTML)
    document.getElementById("highestscore").innerHTML = Math.max(
      score,
      prevScore
    )
    document.getElementById("score").innerHTML = 0
    reset()
  }

  setTimeout(function onTick() {
    changingDirection = false
    if (!paused) {
      clearCanvas()
      drawFood()
      advanceSnake()
      drawSnake()
    }
    main()
  }, 100)
}

// Initial call
createFood()
main()
