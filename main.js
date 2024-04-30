// 0 = Stopped
// 1 = Playing
// 2 = Paused
var playbackState = 0;
var prevPlaybackState = 0;
var globalSpeed = 10;
var globalTime = 0;
var ghostNotes = true;
var debugView = false;
var mode = 0;

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
  
  // important stuff ^^^^^^^^^^^^^^^^^
  
  
  midiArray[0] = new Midi();
  //midiArray[1] = new Midi();
  oscArray[0] = new Oscillator();
  oscArray[1] = new Oscillator();
  oscArray[2] = new Oscillator();
  oscArray[0].freq = 1000;
  oscArray[0].volume = 1000;
  /*
  oscArray[2].freq = 2000;
  oscArray[2].volume = 2000;
  oscArray[2].output = false
  //midiArray[0].oscillator = oscArray[0];*/
  //oscArray[1].midi.push(midiArray[0])
  //oscArray[1].midi.push(midiArray[1])
  //oscArray[0].freqModulator = oscArray[1]
  
  //console.log(oscArray[0].freqModulator.carriers[0])
  midiArray[0].data = [65,-1,63,-1,65,-1,65,-1,63,-1,63,-1,-1,-1,               65,-1,65,-1,66,-1,68,-1,68,-1,66,-1,65,-1,63,-1,61,-1,61,-1,63,-1,65,-1,63,-1,61,-1,61,-1,-1,-1]
  
  //midiArray[0].data = [65,-1,65,-1,66,-1,68,-1,68,-1,66,-1,65,-1,63,-1,61,-1,61,-1,63,-1,65,-1,65,-1,63,-1,63,-1,-1,-1,               65,-1,65,-1,66,-1,68,-1,68,-1,66,-1,65,-1,63,-1,61,-1,61,-1,63,-1,65,-1,63,-1,61,-1,61,-1,-1,-1]
  //midiArray[0].data = [60,67,72,74,79,74,72,67]
  
  //midiArray[0].data = [60,61]
  //midiArray[0].data = [1+(7*1),1+(7*2),1+(7*3),1+(7*4),1+(7*5),1+(7*6),1+(7*7),1+(7*8),1+(7*9),1+(7*10),1+(7*11),1+(7*12)]
  //midiArray[0].data = [60,67,72,74,79]
  //midiArray[0].data = [72,74,76,77,-1,0,0,0]
  
  
  //midiArray[1] = new Midi();
  //oscArray[1] = new Oscillator();
  //oscArray[1].midi = midiArray[1];
  /*midiArray[1].data = [36,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,34,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,
                        32,0,0,0,0,0,0,0,34,0,0,0,0,0,0,-1,36,0,0,0,0,0,0,0,0,0,0,0,43,0,48,-1]*/
  
  //midiArray[1].data = [72,73,71]
  
  //midiArray[1].data = [0]
  /*midiArray[1].data = [37,-1,49,-1, 37,-1,49,-1, 37,-1,49,-1, 37,-1,49,-1, 37,-1,49,-1, 37,-1,49,-1, 32,-1,44,-1,32,-1,44,-1,37,-1,49,-1,37,-1,49,-1,37,-1,49,-1,37,-1,49,-1,37,-1,49,-1,37,-1,49,-1,32,-1,44,-1,37,-1,0,0]*/
 // midiArray[1].data = [60,62,64,65,-1,0,0,0]
  
  /*midiArray[2] = new Midi();
  oscArray[2] = new Oscillator();
  midiArray[2].oscillator = oscArray[2];
  midiArray[2].data = [0,0,0,0,52,0,0,-1,53,0,0,-1,52,0,0,-1,52,0,0,-1,50,0,0,0,0,0,0,0,0,0,0,-1,
 0,0,0,0,48,0,0,-1,50,0,52,50,48,0,50,0,52,0,-1,0,40,0,0,0,0,0,0,0,0,0,0,-1]*/
  
  //midiArray[2].data = [58,59,57,59]
  
  /*slider6 = createSlider(0, 2, 0, 1);
  
  slider7 = createSlider(0, 1, 0.1, 0.01);
  
  slider2 = createSlider(0.5, 40, 10, 0.1);
  //slider22 = createSlider(0.5, 40, 10, 0.1);
  //slider222 = createSlider(0.5, 40, 10, 0.1);
  
  
  slider5 = createSlider(1, width/5, 30, 1);
  slider55 = createSlider(1, height/20, 10, 1);
  
  button1 = createCheckbox('ghost notes',true)
  
  //currentFocus = oscArray[0]
  */
}

function draw() {
  
  //console.log(midiArray[1].currentCommand)
  
  if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  if (mode == 1) {
    splash.hide();
    background(220);

    

    /*currentFocus.mWidth = slider5.value();
    currentFocus.mHeight = slider55.value();
    
    midiArray[0].speed = slider2.value()
    //midiArray[1].speed = slider22.value();
    //midiArray[2].speed = slider222.value();

    ghostNotes = button1.checked();
    
    if(slider6.value() == 0) {
      oscArray[0].waveType = 'sine'
    }
    if(slider6.value() == 1) {
      oscArray[0].waveType = 'sawtooth'
    }
    if(slider6.value() == 2) {
      oscArray[0].waveType = 'square'
    }
    
    oscArray[0].volume = slider7.value()*/
    

    // IMPORTANT STUFF vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    if (playbackState == 1) {
      globalTime += 1 / frameRate();
    }
    if (playbackState == 0) {
      globalTime = 0;
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
    }
    for (let i = 0; i < oscArray.length; i++) {
      if (oscArray[i] === undefined) continue;
      oscArray[i].update();
    }
    prevPlaybackState = playbackState;
    
    // MOUSE INPUT STUFF
    
    mouseIsClicked = false;
    mouseIsReleased = false;
    mouseIsDoubleClicked = false;
  }
}
