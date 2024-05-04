var mouseIsClicked = false;
var mouseIsReleased = false;
var mouseIsDoubleClicked = false;

function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
  }
  mouseIsClicked = true;
}

function mouseReleased() {
  mouseIsReleased = true;
  mouseInUse = false;
}

function doubleClicked() {
  mouseIsDoubleClicked = true;
}

function clickedAt(x, y, w, h) {
  if (
    mouseIsClicked &&
    mouseX >= x &&
    mouseX <= x + w &&
    mouseY >= y &&
    mouseY <= y + h
  ) {
    return true;
  } else {
    return false;
  }
}

function releasedAt(x, y, w, h) {
  if (
    mouseIsReleased &&
    mouseX >= x &&
    mouseX <= x + w &&
    mouseY >= y &&
    mouseY <= y + h
  ) {
    return true;
  } else {
    return false;
  }
}

function doubleClickedAt(x, y, w, h) {
  if (
    mouseIsDoubleClicked &&
    mouseX >= x &&
    mouseX <= x + w &&
    mouseY >= y &&
    mouseY <= y + h
  ) {
    return true;
  } else {
    return false;
  }
}

function mouseIsAt(x, y, w, h) {
  if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
    return true;
  } else {
    return false;
  }
}

function keyPressed() {
  if (keyCode === 49) {
    mainL0 = color(255);
    mainL1 = color(200);
    mainL2 = color(150);
    mainL3 = color(100);
    mainL4 = color(80);
    mainL5 = color(30);
    pianoC1 = lerpColor(mainL1, color(255, 255, 255), 0.5);
    pianoC2 = lerpColor(mainL2, color(255, 255, 255), 0.5);
    createC = color(150, 150, 180);
    deleteC = color(160, 110, 110);
    soundInputOutputC = color(100, 100, 255);
    midiInputOutputC = color(230, 230, 0);
  }
  if (keyCode === 50) {
    mainL0 = color(0);
    mainL1 = color(30);
    mainL2 = color(80);
    mainL3 = color(100);
    mainL4 = color(150);
    mainL5 = color(200);
    pianoC1 = lerpColor(mainL1, color(0, 0, 0), 0.5);
    pianoC2 = lerpColor(mainL2, color(0, 0, 0), 0.5);
    createC = color(105, 105, 75);
    deleteC = color(95, 145, 145);
    soundInputOutputC = color(155, 155, 0);
    midiInputOutputC = color(25, 25, 225);
  }
  if (keyCode === 51) {
    mainL0 = color(100,100,255);
    mainL1 = color(200,100,100);
    mainL2 = color(150,50,50);
    mainL3 = color(100,20,20);
    mainL4 = color(80,20,20);
    mainL5 = color(20,255,255);
    pianoC1 = lerpColor(mainL1, color(255, 255, 255), 0.5);
    pianoC2 = lerpColor(mainL2, color(255, 255, 255), 0.5);
    createC = color(200, 150, 180);
    deleteC = color(200, 110, 110);
    soundInputOutputC = color(100, 100, 255);
    midiInputOutputC = color(230, 230, 0);
  }
  if (keyCode === 52) {
    mainL0 = color(0,0,0);
    mainL1 = color(100,200,100);
    mainL2 = color(50,150,50);
    mainL3 = color(20,100,20);
    mainL4 = color(20,80,20);
    mainL5 = color(255,255,255);
    pianoC1 = lerpColor(mainL1, color(255, 255, 255), 0.5);
    pianoC2 = lerpColor(mainL2, color(255, 255, 255), 0.5);
    createC = color(150, 200, 180);
    deleteC = color(160, 200, 110);
    soundInputOutputC = color(100, 100, 255);
    midiInputOutputC = color(230, 230, 0);
  }
  if (keyCode === 53) {
    mainL0 = color(0,0,0);
    mainL1 = color(100,100,200);
    mainL2 = color(50,50,150);
    mainL3 = color(20,20,100);
    mainL4 = color(20,20,80);
    mainL5 = color(255,255,20);
    pianoC1 = lerpColor(mainL1, color(255, 255, 255), 0.5);
    pianoC2 = lerpColor(mainL2, color(255, 255, 255), 0.5);
    createC = color(150, 150, 200);
    deleteC = color(160, 110, 200);
    soundInputOutputC = color(100, 100, 255);
    midiInputOutputC = color(230, 230, 0);
  }

  if (keyCode === 68) {
    if (debugView) {
      debugView = false;
    } else {
      debugView = true;
    }
  }

  if (keyCode === 32) {
    if (playbackState == 0 || playbackState == 2) {
      playbackState = 1;
    } else {
      playbackState = 0;
    }
  }
}

function mouseWheel() {
  if (currentFocus.scrollX !== undefined) {
    if (keyIsPressed && keyCode === SHIFT) {
      currentFocus.scrollX += event.delta / currentFocus.mWidth;
    } else {
      currentFocus.scrollY += event.delta / currentFocus.mHeight;
    }
  }
}
