// get canvas related references
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var PW = 16;
var PH = 16;
var Ratio = 1;

// drag related variables
var dragok = false;
var startX;
var startY;

// an array of objects that define different rectangles
var rects = [];

function set_rects(x1, y1, x2, y2, x3, y3, x4, y4){
    rects = []
    rects.push({
        x: x1 || 103,
        y: y1  || 43,
        fill: "#444444",
        isDragging: false
    });
    rects.push({
        x: x2 || 357,
        y: y2 || 64,
        fill: "#ff550d",
        isDragging: false
    });
    rects.push({
        x: x3 || 386,
        y: y3 || 332,
        fill: "#800080",
        isDragging: false
    });
    rects.push({
        x: x4 || 110,
        y: y4 || 300,
        fill: "#0c64e8",
        isDragging: false
    });
}

// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

function start(with_draw) {
    var txt_table_corners = document.getElementById('coordinates').value;
    
    const points = txt_table_corners.split('\n');
    x1 = parseInt(points[0].split(',')[0]);
    y1 = parseInt(points[0].split(',')[1]);
    x2 = parseInt(points[1].split(',')[0]);
    y2 = parseInt(points[1].split(',')[1]);
    x3 = parseInt(points[2].split(',')[0]);
    y3 = parseInt(points[2].split(',')[1]);
    x4 = parseInt(points[3].split(',')[0]);
    y4 = parseInt(points[3].split(',')[1]);
    
    set_rects(x1, y1, x2, y2, x3, y3, x4, y4)
    
    console.log('value: ', x1, y1, x2, y2, x3, y3, x4, y4)

    var img = new Image();
    img.src = canvas.getAttribute('data-imgsrc');

    img.onload = function(){
        ctx = canvas.getContext("2d");

        w = img.width;
        h = img.height;

        if (img.width > 640) {
            Ratio = img.width/640
            w = 640;
            h = Math.floor(img.height/Ratio);
            
            x1 = Math.floor(x1/Ratio);
            x2 = Math.floor(x2/Ratio);
            x3 = Math.floor(x3/Ratio);
            x4 = Math.floor(x4/Ratio);
            y1 = Math.floor(y1/Ratio);
            y2 = Math.floor(y2/Ratio);
            y3 = Math.floor(y3/Ratio);
            y4 = Math.floor(y4/Ratio);
            
            set_rects(x1, y1, x2, y2, x3, y3, x4, y4)
        }
        ctx.canvas.width = w;
        ctx.canvas.height = h;

        // call to draw the scene
        draw();
    }

    
}

// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {

    clear();

    var img = new Image();
    img.src = canvas.getAttribute('data-imgsrc');

    w = img.width;
    h = img.height;

    if (img.width > 640) {
        w = 640;
        h = Math.floor(img.height/Ratio);
    }
    
    ctx.drawImage(img, 0, 0, w, h);

    // redraw each rect in the rects[] array
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        ctx.fillStyle = r.fill;
        rect(r.x - Math.floor(PW/2), r.y - Math.floor(PH/2), PW, PH);
    }

    // print coordinates
    if(rects.length == 0){
        document.getElementById('coordinates').value = '';
    } else {
        var v = ''
        for (var i = 0; i < rects.length; i++) {
            var p = rects[i];
            v += '' + parseInt(p.x*Ratio) + ',' + parseInt(p.y*Ratio) + '\n';
        }
        document.getElementById('coordinates').value = v;
        document.getElementById('txt_table_corners').value = v;
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.lineCap = "square";
    ctx.beginPath();

    for(var i=0; i<rects.length; i++){
        if(i==0){
            ctx.moveTo(rects[i]['x'],rects[i]['y']);
        } else {
            ctx.lineTo(rects[i]['x'],rects[i]['y']);
        }
    }

    ctx.lineTo(rects[0]['x'],rects[0]['y']);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
    ctx.fill();
    ctx.strokeStyle = 'blue';
    complete = true;
    
    ctx.stroke();
    
}


// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
//     var mx = parseInt(e.clientX - offsetX);
//     var my = parseInt(e.clientY - offsetY);
    
    var cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
    var mx = Math.round(e.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
    var my = Math.round(e.clientY - cRect.top);

    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        var left = r.x-Math.floor(PW/2)
        var right = r.x+Math.floor(PW/2)
        var top = r.y-Math.floor(PH/2)
        var bottom = r.y+Math.floor(PH/2)
        if (mx >  left && mx < right && my > top && my < bottom) {
            // if yes, set that rects isDragging=true
            dragok = true;
            r.isDragging = true;
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {  

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        rects[i].isDragging = false;
    }


    
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
//         var mx = parseInt(e.clientX - offsetX);
//         var my = parseInt(e.clientY - offsetY);
        
        var cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
        var mx = Math.round(e.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
        var my = Math.round(e.clientY - cRect.top);


        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}


function clear_canvas(){
    ctx = undefined;
    start();
}