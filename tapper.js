var radius = 1,
    playing = true,
    timeToPlay = 10,
    width = window.innerWidth,
    height = window.innerHeight - 100,
    time = document.getElementById('time'),
    pixels = document.getElementById('pixels'),
    welcome = document.getElementById('welcome'),
    growBtn = document.getElementById('growBtn'),
    startBtn = document.getElementById('start'),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    best;

$(document).ready(function() {
  canvas.height = height;
  canvas.width = width;
  $.getJSON('http://localhost:7080/day8', function(data) {
    best = data;
    $('.best').text(data.size *2);
  });
});

function draw() {
  if(playing) {
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.arc(width/2, height/2, radius, 0, 2*Math.PI);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = '#003300';
    context.stroke();
    pixels.innerText = radius *2;
    requestAnimationFrame(draw);
  }
}

function start() {
  playing = true;
  draw();
  time.style.display = "block";
  var id = setInterval(function() {
    timeToPlay--;
    if(timeToPlay < 0) {
      clearInterval(id);
      finish();
    } else {
      time.innerText = 'You have ' + (timeToPlay +1).toString() + ' seconds left';
    }
  }, 1000);
}

function finish() {
  playing = false;
  time.innerText = 'Time\'s up!';
  console.log('radius: ' + radius, 'best: ' + best.size);
  var string = "Time's up!\n\nYour circle was " + (radius * 2).toString() + " pixels wide.\n\nThe server best is "+best.size * 2 +" pixels.";
  if(radius > best.size) {
    string+='\n\nYou set a new server record! Congrats, this will now be recorded.';
    update();
  } else {
    string+='\n\nSorry, that\'s not better than the server best! Refresh to try again.';
  }
  document.getElementById('msg').innerText = string;
  welcome.style.display = 'flex';
}

function update() {
  $.post('http://localhost:7080/day8/update/'+radius, function(data){
    if(data.success) {
      document.getElementById('msg').innerText += '\n\nYour record was successfully uploaded!';
    }
  });
}

document.addEventListener('keyup', function(e) {
  if(e.keyCode == 32 || e.which == 32) {
    if(playing) {
      growBtn.disabled = true;
      radius++;
    }
  }
});

growBtn.addEventListener('click', function(e) {
  if(playing) {
    radius++;
  }
});

startBtn.addEventListener('click', function(e) {
  welcome.style.display = "none";
  start();
});
