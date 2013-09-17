audio = new(window.AudioContext || window.webkitAudioContext)();
proc = audio.createScriptProcessor(4096);
proc.onaudioprocess = function (e) {
  // Get the audio data
  var inp0 = e.inputBuffer.getChannelData(0);
  var inp1 = e.inputBuffer.getChannelData(1);
  var out0 = e.outputBuffer.getChannelData(0);
  var out1 = e.outputBuffer.getChannelData(1);

  for (var i = 0; i < inp0.length; i++) {
    out0[i] = (inp0[i] - inp1[i]) / 2;
    out1[i] = (inp1[i] - inp0[i]) / 2;
  }
};


