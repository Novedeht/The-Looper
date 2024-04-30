var topMargin = 80;
var middleMargin = topMargin + 250;

function renderDebugView() {
  stroke(0, 0, 0, 0);
  fill(0);

  for (let i = 0; i < oscArray.length; i++) {
    if (oscArray[i] === undefined) text("undefined", 170 * i, 20);
    textSize(22);
    // osc name
    text("oscillator " + i, 170 * i, topMargin);
    textSize(12);
    // mod level
    text("mod level: " + oscArray[i].modLevel, 170 * i, 20 + topMargin);
    // check if theres a frequency modulator
    if (Object.keys(oscArray[i].freqModulator).length !== 0) {
      // get number of frequency modulator in main array
      for (let j = 0; j < oscArray.length; j++) {
        if (oscArray[j] == oscArray[i].freqModulator) {
          text("frequency modulator: oscillator " + j, 170 * i, 40 + topMargin);
        }
      }
    } else {
      text("no frequency modulator", 170 * i, 40 + topMargin);
    }
    // check if theres an amp modulator
    if (Object.keys(oscArray[i].ampModulator).length !== 0) {
      // get number of amp modulator in main array
      for (let j = 0; j < oscArray.length; j++) {
        if (oscArray[j] == oscArray[i].ampModulator) {
          text("amplitude modulator: oscillator " + j, 170 * i, 60 + topMargin);
        }
      }
    } else {
      text("no amplitude modulator", 170 * i, 60 + 80);
    }
    if (oscArray[i].output) {
      text("output: true", 170 * i, 80 + 80);
    } else {
      text("output: false", 170 * i, 80 + 80);
    }
    textSize(15)
    text("midi connections:", 170 * i, 110 + 80);
    for (let j = 0; j < oscArray[i].midi.length; j++) {
      if (oscArray[i].midi[j] === undefined) {
        text("undefined", 170 * i, 130 + (20*j) + 80);
      } else {
        for (let k = 0; k < midiArray.length; k++) {
          if (oscArray[i].midi[j] == midiArray[k]) {
            text("midi " + j, 170 * i, 130 + (20*j) + 80);
          }
        }
      }
    }
    
  }

  for (let i = 0; i < midiArray.length; i++) {
    if (midiArray[i] === undefined)
      text("undefined", 170 * i, 20 + middleMargin);
    textSize(22);
    text("midi " + i, 170 * i, 20 + middleMargin);
    textSize(12);
    if (midiArray[i].currentCommand === undefined) {
    }
    text(
      "current command: " + midiArray[i].currentCommand,
      170 * i,
      40 + middleMargin
    );
  }
}
