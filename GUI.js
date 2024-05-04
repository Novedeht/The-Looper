var soundInputOutputC;
var midiInputOutputC;

var mainL1;
var mainL2;
var mainL3;
var mainL4;

var pianoC;

var createC;
var deleteC;

function initGUIVariables() {
  soundInputOutputC = color(100, 100, 255);
  midiInputOutputC = color(230, 230, 0);

  mainL0 = color(255);
  mainL1 = color(200);
  mainL2 = color(150);
  mainL3 = color(100);
  mainL4 = color(80);
  mainL5 = color(30);

  if (brightness(mainL1) > 50) {
    pianoC1 = lerpColor(mainL1, color(255, 255, 255), 0.5);
    pianoC2 = lerpColor(mainL2, color(255, 255, 255), 0.5);
  } else {
    pianoC1 = lerpColor(mainL1, color(0, 0, 0), 0.5);
    pianoC2 = lerpColor(mainL2, color(0, 0, 0), 0.5);
  }

  createC = color(150, 150, 180);
  deleteC = color(160, 110, 110);
}
