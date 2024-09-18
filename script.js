const canvas = document.querySelector('canvas');
const cntx = canvas.getContext('2d');
const body = document.querySelector('body');
const tray = document.querySelector('.tray');
const color = document.querySelector('#colorField');
const clearCanvas = document.querySelector('#clearCanvas');
const erasure = document.querySelector('#erasure');
const cursorP = `url(./assets/pen.png) 0 24, default`;
const cursorE = `url(./assets/erasure.png) 16 0, default`;

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

canvas.style.cursor = cursorP;

cntx.lineWidth = 2;

let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;
const strokes = [...document.querySelectorAll('.stroke')];

strokes.forEach(stroke => {
    stroke.addEventListener('click', () => {
        const isActive = document.querySelector('.active');
        if (isActive) {
            isActive.classList.remove('active');
        }
        isErasing = false;
        canvas.style.cursor = cursorP;
        stroke.classList.add('active');
        cntx.lineWidth = stroke.id;
    })
})

function draw(e) {
    if (!isDrawing) return;
    console.log(e);
    cntx.beginPath();
    cntx.moveTo(lastX, lastY);
    cntx.lineTo(e.offsetX, e.offsetY);
    cntx.strokeStyle = isErasing ? `white` : `${color.value}`;
    cntx.stroke();
    [lastX, lastY]= [e.offsetX, e.offsetY];
    if(isErasing) {
        cntx.lineWidth = 50;
    }
}

canvas.addEventListener('mousedown', (e) => {
    cntx.lineJoin = "round";
    cntx.lineCap = "round";
    isDrawing = true;
    [lastX, lastY]= [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

clearCanvas.addEventListener('click', clear_canvas);

function clear_canvas() {
    cntx.fillStyle = 'white';
    cntx.clearRect(0, 0, canvas.width, canvas.height);
    cntx.fillRect(0, 0, canvas.width, canvas.height);
}

erasure.addEventListener('click', () => {
    canvas.style.cursor = cursorE;
    isErasing = true;
});

canvas.addEventListener('touchstart', handleStart, { passive: false });
canvas.addEventListener('touchmove', handleMove, { passive: false });
canvas.addEventListener('touchend', handleEnd);

function handleStart(e) {
    e.preventDefault();
    isDrawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    if(isErasing) {
        cntx.lineWidth = 50;
    }
    cntx.lineCap = 'round';
    cntx.lineJoin = 'round';
}

function drawTouch(e) {
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    cntx.beginPath();
    cntx.moveTo(lastX, lastY);
    cntx.lineTo(x, y);
    cntx.strokeStyle = isErasing ? 'white' : color.value;
    cntx.stroke();
    
    [lastX, lastY] = [x, y]; // Update the last position
}

function handleMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    drawTouch(e); // Pass the event to drawTouch
}

function handleEnd(e) {
    isDrawing = false;
}