var playbackState = 0;
var prevPlaybackState = 0;
var globalSpeed = 10;
var globalTime = 0;
var globalStart = 0;
var ghostNotes = true;
var debugView = false;
var mode = 0;

var creationPicker = false

var currentFocus = 0; // 0 = focus is on the main screen

var mouseInUse = false;

var midiArray = [];
var oscArray = [];

let audioStarted = false;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  initGUIVariables()
  splash = new Splash();
  editSetup();
  canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault())
  getAudioContext().suspend();

}

function draw() {

  if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  if (mode == 1) {
    splash.hide();
    background(mainL1);

    if (playbackState == 1) {
      globalTime += 1 / frameRate();
    }
    if (playbackState == 0) {
      globalTime = globalStart;
    }
    
    
    if (debugView) {
      renderDebugView();
    } else if (currentFocus !== 0) {
      currentFocus.tabRender();
      
    } else {
      editRender();
    }

    for (let i = 0; i < midiArray.length; i++) {
      if (midiArray[i] === undefined) continue;
      midiArray[i].update();
      if(midiArray[i] != currentFocus) {
        midiArray[i].unrender()
      }
    }
    for (let i = 0; i < oscArray.length; i++) {
      if (oscArray[i] === undefined) continue;
      oscArray[i].update();
      if(oscArray[i] != currentFocus) {
        oscArray[i].unrender()
      }
    }
    prevPlaybackState = playbackState;
    // MOUSE INPUT STUFF
    
    mouseIsClicked = false;
    mouseIsReleased = false;
    mouseIsDoubleClicked = false;
    
  }
}
