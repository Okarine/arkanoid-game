
var w=400, h=600, ballSize=10, brickW=30, brickH=20, batW=100, batH=20 //constants
var ballX, ballY, dx, dy, bricks=[], batX, batY, liveX, lives=[] //using variables
var score, isPause, animationId, livesCounter //display variables

var batSpeed, isMovingLeft, isMovingRight

var pausePlay = document.getElementById("pausePlay")
var info = document.getElementById("info")

var factor = 1
var timerInterval
var elapsedTime = 0
var isTimerRunning = false

var isPlaying = true
 
var c = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
c.width = w; c.height = h

function init() {
    //create all elements
    bricks=[], ballX=w/2, ballY=h-65, dx=2, dy=-2, batX=w/2, batY=h-50, batSpeed = 3, isMovingLeft = false, isMovingRight = false
    score=0, isPause = true, animationId = null, lives=[], liveX = 20, livesCounter = 2
    minutes = 0, seconds = 0
    max = 2, min = 0.6
    for (var y = 0; y < 4; y++){
        for (var x = y; x < 10-y; x++) {
            bricks.push({x: 50+x*brickW, y: 50+y*brickH, active: true})
        }
    }
    for (var l = 0; l < livesCounter; l++) {
        lives.push({x: liveX, active: true})
        liveX = liveX+20
    }
}

function drawRect(color, x, y, w, h) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()
}

function drawCircle(color, x, y, r ) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.fill() 
}

function drawScore() {
    ctx.fillStyle = "#000"
    ctx.font = "20px Verdana"
    ctx.fillText("Score: " + score, 10, 30)
}

function drawTime() {
    ctx.fillStyle = "#000"
    ctx.font = "20px Verdana"
    ctx.fillText(minutes + ":" + (seconds < 10 ? "0" : "") + seconds, w-60, 30)
}

function draw() {
    drawRect('#eee', 0, 0, w, h) //canva
    drawCircle('#f00', ballX, ballY, ballSize) //ball
    for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i]
        if (!b.active) continue
        drawRect('#0f0', b.x, b.y, brickW, brickH) //block
    }
    drawRect('#00f', batX-batW/2, batY, batW, batH) //platform
    drawScore()
    drawTime()
    //lives
    for (var i = 0; i < lives.length; i++) {
        var live = lives[i]
        if (!live.active) continue
        drawCircle('#DB7093', live.x, h-20, 7) //live
        //console.log(live.x)
    }
} 

function move() {
    if (ballX-ballSize+dx < 0 || ballX+ballSize+dx > w) dx = -dx
    if (ballY-ballSize+dy < 0) dy = -dy
    if (ballY >= batY) return false 
    if (ballY+ballSize > batY && ballX+ballSize > batX-batW/2 && ballX-ballSize < batX+batW/2) dy = -dy, factor = Math.random() * (max - min) + min
    
    if(isPlaying) {
        ballX += dx 
        ballY += dy * factor
        updateBatPosition()
    }

    //bricks clear
    for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i]
        if (!b.active) continue
        if (b.x < ballX+ballSize && ballX-ballSize < b.x+brickW && b.y < ballY+ballSize && ballY-ballSize < b.y+brickH) {
            b.active = false
            dy = -dy
            score++
            break
        }
    }
    return true
}

function loseLive(counter) {
    //console.log('Lose live')
    lives[counter-1].active = false
    ballX=w/2, ballY=h-65, batX=w/2, batY=h-50
    pausePlay.style.visibility = "visible"
    isPause = true
    draw()
}

function startTimer() {
    if (!isTimerRunning) {
      timerInterval = setInterval(updateTimer, 1000);
      isTimerRunning = true;
    }
}
  
function pauseTimer() {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
    }
}

function updateTimer() {
    elapsedTime++;
    minutes = Math.floor(elapsedTime / 60)
    seconds = elapsedTime % 60
}

function game() {
    if (!isPause) {
        info.style.visibility = "hidden"
        if (!move() && livesCounter === 0) {
            info.style.visibility = "visible"
            info.innerHTML = "<h3>Game over!</h3><h4>Use <span>enter</span> to restart</h4>"
            isPlaying = false
            pauseTimer()
        } else if (!move() && livesCounter != 0) {  
            loseLive(livesCounter)
            livesCounter--
            info.style.visibility = "visible"
            info.innerHTML = "<p>You lost your life!</p><p>Use <span>space</span> to continue</p>"
            pauseTimer()
            return
        } else if (score == bricks.length) {
            info.style.visibility = "visible"
            info.innerHTML = "<h3>You won!</h3><h4>Use <span>enter</span> to restart</h4>"
            isPlaying = false
        }
        draw()
    }
    animationId = requestAnimationFrame(game)
}

document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
        isMovingLeft = true
    } else if (event.code === "ArrowRight") {
        isMovingRight = true
    }
})
  
document.addEventListener("keyup", function(event) {
    if (event.code === "ArrowLeft") {
        isMovingLeft = false;
    } else if (event.code === "ArrowRight") {
        isMovingRight = false;
    }
})

function updateBatPosition() {
    if (isMovingLeft) {
      batX -= batSpeed
    } else if (isMovingRight) {
      batX += batSpeed
    }

    if (batX < 55) {
        batX = 55;
    } else if (batX + batW > w + 42) {
        batX = w + 42 - batW
    }
}
    
document.addEventListener("keydown", function(e) {
    if (e.key === " ") {
        if (isPlaying) {
            isPause = !isPause;
            if (isPause) {
                pausePlay.style.visibility = "visible"
                cancelAnimationFrame(animationId)
                pauseTimer()
            } else {
                pausePlay.style.visibility = "hidden"
                animationId = requestAnimationFrame(game)
                startTimer()
            }
        }
    } else if (e.key === "Enter") { 
        location.reload();
    }
});

init()
draw()
startTimer()
