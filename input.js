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
  if (
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

function keyPressed() {
  
  
  
  if(keyCode === 68) {
    if (debugView) {
      debugView = false
    } else {
      debugView = true
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
  if (currentFocus.scrollX !== undefined){
  if (keyIsPressed && keyCode === SHIFT) {
    currentFocus.scrollX += event.delta /currentFocus.mWidth
  } else {
    currentFocus.scrollY += event.delta /currentFocus.mHeight
  }
  }
  
}