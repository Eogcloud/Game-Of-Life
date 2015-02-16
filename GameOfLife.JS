var gridWidth = 50;
var gridHeight = 50;
var running = false;
var vendors = ['webkit', 'moz'];

for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

var canvas = document.getElementById('myCanvas'),
    cw = canvas.width,
    ch = canvas.height,
    cx = null,
    fps = 30,
    bX = 30,
    bY = 30,
    mX = 150,
    mY = 300,
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    delta = 0;

var context = canvas.getContext('2d');

canvas.addEventListener('mouseup', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    setGrid(mousePos.x, mousePos.y);
    },

    false);

//change declaration to variable values
var grid = new Array(gridWidth);

for (var i = 0; i < gridWidth; i++) {
    grid[i] = new Array(gridHeight);
    for (var j = 0; j < gridHeight; j++) {
        grid[i][j] = [0,0];
    }
}


if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext('2d');
    gameLoop();
}

function setSquare(x,y){
    grid[x][y][0] = grid[x][y][1];
    grid[x][y][1] = 0;
}

function checkBounds(value, bounds){

    if(value < 0){
        return bounds - 1
    }

    if(value >= bounds){
        return 0;
    }

    return value;
}

function pause(){
    running = !running;
}

function getGrid(x,y){
    if(document.getElementById("wrap").checked){
        return grid[checkBounds(x, gridWidth)][checkBounds(y, gridHeight)][0];
    }
    else{

        if((checkBounds(x, gridWidth) != x) || checkBounds(y, gridHeight) != y){
            return 0;
        }

        else{
            return grid[x][y][0];
        }
    }

}

function checkSquare(x, y){

    var adjacent =

            getGrid(x-1,y-1) +
            getGrid(x-1,y) +
            getGrid(x-1,y+1) +
            getGrid(x,y-1) +
            getGrid(x,y+1) +
            getGrid(x+1,y-1) +
            getGrid(x+1,y) +
            getGrid(x+1,y+1);

    if(adjacent == 2){
        grid[x][y][1] = grid[x][y][0];
    }

    else if(adjacent == 3){
        grid[x][y][1] = 1;
    }

    else{
        grid[x][y][1] = 0;
    }
}

function runGrid(job){
    for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridHeight; y++) {
            job(x,y);
        }
    }
}

function drawGrid(x,y){
    if(grid[x][y][0]==1){

        cx.beginPath()
        cx.fillStyle = 'red';
        cx.fillRect(x*20+2,y*20+2,16,16);
        cx.rect(x*20+2,y*20+2,16,16);
        cx.stroke();
    }
}

function gameLoop(){

    window.requestAnimationFrame(gameLoop);
    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;
    cx.clearRect(0, 0, cw, cw);
    runGrid(drawGrid);

    if(running == true && currentTime- lastTime > 200){
        runGrid(checkSquare);
        runGrid(setSquare);
        lastTime = currentTime;
    }

}

function setGrid(x,y){
    grid[x][y][0] = !grid[x][y][0];
}

function getMousePos(canvas, evt){

    var rect = canvas.getBoundingClientRect();

    return {
        x: Math.trunc((evt.clientX - rect.left)/20),
        y: Math.trunc((evt.clientY - rect.top)/20)
    };

}




