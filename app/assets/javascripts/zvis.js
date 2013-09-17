(function() {
CanvasRenderingContext2D.prototype.line = function(x1, y1, x2, y2) {
  this.lineCap = 'round';
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.closePath();
  this.stroke();
}
CanvasRenderingContext2D.prototype.circle = function(x, y, r, fill_opt) {
  this.beginPath();
  this.arc(x, y, r, 0, Math.PI * 2, true);
  this.closePath();
  if (fill_opt) {
    this.fillStyle = 'rgba(0,0,0,1)';
    this.fill();
    this.stroke();
  } else {
    this.stroke();
  }
}
CanvasRenderingContext2D.prototype.rectangle = function(x, y, w, h, fill_opt) {
  this.beginPath();
  this.rect(x, y, w, h);
  this.closePath();
  if (fill_opt) {
    this.fillStyle = 'rgba(0,0,0,1)';
    this.fill();
  } else {
    this.stroke();
  }
}
CanvasRenderingContext2D.prototype.triangle = function(p1, p2, p3, fill_opt) {
  // Stroked triangle.
  this.beginPath();
  this.moveTo(p1.x, p1.y);
  this.lineTo(p2.x, p2.y);
  this.lineTo(p3.x, p3.y);
  this.closePath();
  if (fill_opt) {
    this.fillStyle = 'rgba(0,0,0,1)';
    this.fill();
  } else {
    this.stroke();
  }
}
CanvasRenderingContext2D.prototype.clear = function() {
  this.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
}


})();

(function() {
var majorAnalyser = audio.createAnalyser();
var minorAnalyser = audio.createAnalyser();
$(document).ready(function() {
  var canvas = document.getElementById('fft');
  var ctx = canvas.getContext('2d');
  canvas.width = document.body.clientWidth / 1.4;

  var canvas2 = document.getElementById('fft2');
  var ctx2 = canvas2.getContext('2d');
  canvas2.width = canvas.width;

  const CANVAS_HEIGHT = canvas.height;
  const CANVAS_WIDTH = canvas.width;


function rafCallback(time) {
  window.webkitRequestAnimationFrame(rafCallback, canvas);

  var majorFreqByteData = new Uint8Array(majorAnalyser.frequencyBinCount);
  var minorFreqByteData = new Uint8Array(minorAnalyser.frequencyBinCount);
  majorAnalyser.getByteFrequencyData(majorFreqByteData); //analyser.getByteTimeDomainData(freqByteData);
  minorAnalyser.getByteFrequencyData(minorFreqByteData); //analyser.getByteTimeDomainData(freqByteData);

  var SPACER_WIDTH = 10;
  var BAR_WIDTH = 5;
  var OFFSET = 100;
  var CUTOFF = 23;
  var numBars = Math.round(CANVAS_WIDTH / SPACER_WIDTH);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#d6d6d6';
  ctx.lineCap = 'round';

  ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx2.fillStyle = '#3A5E8C';
  ctx2.lineCap = 'round';

  for (var i = 0; i < numBars; ++i) {
    var majorMagnitude = majorFreqByteData[i + OFFSET];
    var minorMagnitude = minorFreqByteData[i + OFFSET];
    ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -majorMagnitude);
    ctx2.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -minorMagnitude);
  }
}

minorGain.connect(minorAnalyser);
majorGain.connect(majorAnalyser);
majorAnalyser.connect(audio.destination);
minorAnalyser.connect(audio.destination);

rafCallback();
});

// Need window.onload to fire first. See crbug.com/112368.
})();
window.addEventListener('keydown', function(e) {
  if (e.keyCode == 32) { // space
    // Simulate link click on an element.
    var evt = document.createEvent('Event');
    evt.initEvent('click', false, false);
    window.playButton.dispatchEvent(evt);
  }
}, false);
