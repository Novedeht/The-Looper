class Oscillator {
  constructor() {
    this.name = "oscillator";

    this.carriers = [];

    for (let i = 0; i < 4; i++) {
      this.carriers[i] = new p5.Oscillator();
      this.carriers[i].start();
      this.carriers[i].disconnect();
      this.carriers[i].amp(0);
    }

    this.connectedCarriers = [0, 0, 0, 0];
    this.startedCarriers = [1, 1, 1, 1];

    this.env = new p5.Env();
    this.reverb = new p5.Reverb();
    this.reverb.amp(0);

    this.reverbAmp = 0;

    this.output = false;
    this.modLevel = 0;
    // 0 = no modulation
    // 1 = freq modulation
    // 2 = amp modulation
    // 3 = freq and amp modulation
    this.volume = 0.1;
    this.volMultiplier = 1;
    this.attack = 0.002;
    this.decay = 0;
    this.sustain = 1;
    this.release = 0.002;
    this.waveType = "sine";
    this.freq = 440;
    this.freqMultiplier = 1;
    this.midi = [];
    this.anyMidiConnected = false;
    this.ampModulator = {};
    this.freqModulator = {};

    // PANEL STUFF

    this.panelx = width / 2;
    this.panely = height / 2;
    this.panelWidth = 160;
    this.panelHeight = 100;
    this.panelBarSize = 15;
    this.dragging = false;

    this.creatingConnection = false;
    this.connections = [];

    this.nodeSoundOutputX = 0;
    this.nodeSoundOutputY = 0;
    this.nodeMidiInputPosX = 0;
    this.nodeMidiInputPosY = 0;
    this.nodeFreqModInputPosX = 0;
    this.nodeFreqModInputPosY = 0;
    this.nodeAmpModInputPosX = 0;
    this.nodeAmpModInputPosY = 0;

    // UI STUFF

    this.analyzer = new p5.FFT(0.8, 128);

    this.volumeAdj = createSlider(0, 1, 0.1, 0.001);
    this.reverbAmpAdj = createSlider(0, 1, 0, 0.001);

    this.A = createSlider(0.002, 5, 0.002, 0.001);
    this.D = createSlider(0.002, 5, 0.002, 0.001);
    this.S = createSlider(0, 1, 1, 0.001);
    this.R = createSlider(0.002, 5, 0.002, 0.001);

    this.freqAdj = new Adjustable(440);
    this.freqAdj.bounds(0, 20000);
    this.freqAdj.decimals = true;
    this.freqAdj.h = 100 / 5;
    this.freqAdj.w = (this.freqAdj.h / 2) * 9;
    this.freqAdj.sensitivity = 0.4;

    this.freqMultAdj = new Adjustable(1);
    this.freqMultAdj.bounds(1, 99);
    this.freqMultAdj.h = 100 / 5;
    this.freqMultAdj.w = (this.freqAdj.h / 2) * 2.5;

    this.volMultAdj = new Adjustable(1);
    this.volMultAdj.bounds(1, 9999);
    this.volMultAdj.h = 100 / 5;
    this.volMultAdj.sensitivity = 10;
    this.volMultAdj.w = (this.freqAdj.h / 2) * 4.5;

    for (let i = 0; i < this.carriers.length; i++) {
      this.reverb.process(this.carriers[i]);
    }
  }
  update() {
    if (this.output) {
      this.reverb.amp(this.reverbAmp);
    } else {
      this.reverb.amp(0);
    }
    for (let i = 0; i < this.carriers.length; i++) {
      this.reverb.process(this.carriers[i]);
    }
    this.analyzer.setInput(this.carriers[this.modLevel]);
    this.env.setADSR(this.attack, this.decay, this.sustain, this.release);
    this.env.setRange(this.volume * this.volMultiplier, 0);

    if (Object.keys(this.freqModulator).length === 0) {
      if (Object.keys(this.ampModulator).length === 0) {
        this.modLevel = 0; // no modulation
      } else {
        this.modLevel = 2; // amp modulation
        this.carriers[2].amp(
          this.ampModulator.carriers[this.ampModulator.modLevel]
        );
      }
    } else {
      if (Object.keys(this.ampModulator).length === 0) {
        this.modLevel = 1; // freq modulation
        this.carriers[1].freq(
          this.freqModulator.carriers[this.freqModulator.modLevel]
        );
      } else {
        this.modLevel = 3; // freq and amp modulation
        this.carriers[3].freq(
          this.freqModulator.carriers[this.freqModulator.modLevel]
        );
        this.carriers[3].amp(
          this.ampModulator.carriers[this.ampModulator.modLevel]
        );
      }
    }

    for (let i = 0; i < this.carriers.length; i++) {
      if (i == this.modLevel) {
        if (this.startedCarriers[i] != 1) {
          this.carriers[i].start();
          this.startedCarriers[i] = 1;
        }
        if (this.output) {
          if (this.connectedCarriers[i] != 1) {
            this.carriers[i].connect();
            this.connectedCarriers[i] = 1;
          }
        } else {
          if (this.connectedCarriers[i] != 0) {
            this.carriers[i].disconnect();
            this.connectedCarriers[i] = 0;
          }
        }
      } else {
        if (this.startedCarriers[i] != 0) {
          this.carriers[i].stop();
          this.startedCarriers[i] = 0;
        }
        if (this.connectedCarriers[i] != 0) {
          this.carriers[i].disconnect();
          this.connectedCarriers[i] = 0;
        }
      }
    }
    this.anyMidiConnected = false;
    this.carriers[this.modLevel].setType(this.waveType);

    for (let i = 0; i < this.midi.length; i++) {
      if (this.midi[i] !== undefined) {
        this.anyMidiConnected = true;
      }
    }

    if (!this.anyMidiConnected) {
      this.carriers[this.modLevel].amp(this.volume * this.volMultiplier);
      this.carriers[this.modLevel].freq(this.freq * this.freqMultiplier);
    } else {
      //this.carriers[this.modLevel].amp(0);
      for (let i = 0; i < this.midi.length; i++) {
        if (this.midi[i] === undefined) continue;
        if (this.midi[i].currentCommand > 0) {
          this.carriers[this.modLevel].freq(
            midiToFreq(this.midi[i].currentCommand) * this.freqMultiplier
          );
          if (this.volume > 0) {
            this.env.triggerAttack(this.carriers[this.modLevel]);
          }
        } else if (this.midi[i].currentCommand == -1) {
          this.env.triggerRelease(this.carriers[this.modLevel]);
        }
      }
    }
  }
  tabRender() {
    background(mainL1);

    let leftmargin = 10;
    let margin = 30;
    let textsize = 100 / 5;
    let backButtonPos = 80 / 2;
    let backButtonSize = 80 - 20;

    fill(mainL4);
    stroke(mainL5);
    circle(backButtonPos, backButtonPos, backButtonSize);
    if (
      doubleClickedAt(
        backButtonPos - backButtonSize / 2,
        backButtonPos - backButtonSize / 2,
        backButtonSize,
        backButtonSize
      )
    ) {
      currentFocus = 0;
    }

    fill(mainL5);
    noStroke();

    // info text
    textSize(textsize / 1.3);
    text(
      "Be careful about letting the volume go much higher than 10 (it can get loud).\nUse the volume multiplier if you're doing FM synthesis.",
      width / 4,
      backButtonSize + 20 + margin,
      width / 4
    );

    // values n variables
    textSize(textsize);
    text(
      "volume: " + (this.volume * this.volMultiplier * 100).toFixed(1),
      leftmargin + 2,
      backButtonSize + 20 + margin
    );
    let sliderwidth = 126;
    this.volumeAdj.position(
      leftmargin,
      textsize + backButtonSize + 20 + margin
    );
    this.volume = this.volumeAdj.value();

    fill(mainL5);
    text(
      "*",
      leftmargin + 2 + sliderwidth + margin / 5,
      textsize + backButtonSize + 20 + margin
    );
    fill(mainL2);
    stroke(mainL5);
    this.volMultAdj.position(
      leftmargin + 2 + sliderwidth + margin / 1.3,
      textsize + backButtonSize + 20 + margin
    );
    this.volMultAdj.render();
    this.volMultiplier = this.volMultAdj.value;

    text("frequency:", leftmargin + 2, backButtonSize + 20 + margin * 3);
    fill(mainL2);
    stroke(mainL5);

    this.freqAdj.position(
      leftmargin + 2,
      textsize + backButtonSize + 20 + margin * 3
    );

    if (this.anyMidiConnected) {
      this.freqAdj.render("midi");
    } else {
      this.freq = this.freqAdj.value;
      this.freqAdj.render();
    }

    fill(mainL5);
    text(
      "*",
      leftmargin + 2 + this.freqAdj.w + margin / 5,
      textsize + backButtonSize + 20 + margin * 3
    );
    fill(mainL2);
    stroke(mainL5);
    this.freqMultAdj.position(
      leftmargin + 2 + this.freqAdj.w + margin / 1.3,
      textsize + backButtonSize + 20 + margin * 3
    );
    this.freqMultAdj.render();
    this.freqMultiplier = this.freqMultAdj.value;

    text("wave type:", leftmargin + 2, backButtonSize + 20 + margin * 5.5);
    fill(mainL2);
    stroke(mainL5);

    let buttonwidth = 30;
    let buttonheight = 100 / 5;
    let wavemargin = 4;
    let buttony = textsize + backButtonSize + 20 + margin * 5.5;
    let x1 = leftmargin + 2;
    let x2 = leftmargin + 2 + buttonwidth + 10;
    let x3 = leftmargin + 2 + buttonwidth * 2 + 10 * 2;
    let x4 = leftmargin + 2 + buttonwidth * 3 + 10 * 3;

    if (clickedAt(x1, buttony, buttonwidth, buttonheight)) {
      this.waveType = "sine";
    }
    if (clickedAt(x2, buttony, buttonwidth, buttonheight)) {
      this.waveType = "sawtooth";
    }
    if (clickedAt(x3, buttony, buttonwidth, buttonheight)) {
      this.waveType = "square";
    }
    if (clickedAt(x4, buttony, buttonwidth, buttonheight)) {
      this.waveType = "triangle";
    }

    // frequency drawings

    //sine

    if (this.waveType == "sine") {
      // setting colors if setting is selected
      fill(mainL4);
      stroke(mainL1);
    } else {
      fill(mainL2);
      stroke(mainL5);
    }
    // draw box
    rect(x1, buttony, buttonwidth, buttonheight);
    // draw line
    fill(0, 0, 0, 0);
    beginShape();
    for (let i = 0; i < buttonwidth; i++) {
      vertex(
        x1 + i,
        buttony +
          buttonheight / 2 +
          sin(map(i, 0, buttonwidth, 0, TAU)) * (buttonheight / 2 - wavemargin)
      );
    }
    endShape();

    //sawtooth
    if (this.waveType == "sawtooth") {
      // setting colors if setting is selected
      fill(mainL4);
      stroke(mainL1);
    } else {
      fill(mainL2);
      stroke(mainL5);
    }
    // draw box
    rect(x2, buttony, buttonwidth, buttonheight);
    // draw line
    line(
      x2,
      buttony + buttonheight / 2,
      x2 + buttonwidth / 2,
      buttony + wavemargin
    );
    line(
      x2 + buttonwidth / 2,
      buttony + wavemargin,
      x2 + buttonwidth / 2,
      buttony + buttonheight - wavemargin
    );
    line(
      x2 + buttonwidth / 2,
      buttony + buttonheight - wavemargin,
      x2 + buttonwidth,
      buttony + buttonheight / 2
    );
    
    //square
    if (this.waveType == "square") {
      // setting colors if setting is selected
      fill(mainL4);
      stroke(mainL1);
    } else {
      fill(mainL2);
      stroke(mainL5);
    }
    // draw box
    rect(x3, buttony, buttonwidth, buttonheight);
    // draw line
    line(
      x3,
      buttony + buttonheight - wavemargin,
      x3 + buttonwidth / 2,
      buttony + buttonheight - wavemargin
    );
    line(
      x3 + buttonwidth / 2,
      buttony + buttonheight - wavemargin,
      x3 + buttonwidth / 2,
      buttony + wavemargin
    );
    line(
      x3 + buttonwidth / 2,
      buttony + wavemargin,
      x3 + buttonwidth,
      buttony + wavemargin
    );
    
    // triangle
    if (this.waveType == "triangle") {
      // setting colors if setting is selected
      fill(mainL4);
      stroke(mainL1);
    } else {
      fill(mainL2);
      stroke(mainL5);
    }
    // draw box
    rect(x4, buttony, buttonwidth, buttonheight);
    // draw line
    line(
      x4,
      buttony + buttonheight/2,
      x4 + buttonwidth / 4,
      buttony + wavemargin
    );
    line(
      x4 + buttonwidth / 4,
      buttony + wavemargin,
      x4+ buttonwidth / 1.33333333333333,
      buttony + buttonheight - wavemargin
    );
    line(
      x4+ buttonwidth / 1.33333333333333,
      buttony + buttonheight - wavemargin,
      x4 + buttonwidth,
      buttony + buttonheight/2
    );

    // back to values

    fill(mainL5);
    noStroke();

    text("a", leftmargin + 2, backButtonSize + 20 + margin * 8);
    this.A.position(leftmargin + 2 + 15, backButtonSize + 20 + margin * 8);
    this.attack = this.A.value();
    text("d", leftmargin + 2, backButtonSize + 20 + margin * 8 + textsize);
    this.D.position(
      leftmargin + 2 + 15,
      backButtonSize + 20 + margin * 8 + textsize
    );
    this.decay = this.D.value();
    text("s", leftmargin + 2, backButtonSize + 20 + margin * 8 + textsize * 2);
    this.S.position(
      leftmargin + 2 + 15,
      backButtonSize + 20 + margin * 8 + textsize * 2
    );
    this.sustain = this.S.value();
    text("r", leftmargin + 2, backButtonSize + 20 + margin * 8 + textsize * 3);
    this.R.position(
      leftmargin + 2 + 15,
      backButtonSize + 20 + margin * 8 + textsize * 3
    );
    this.release = this.R.value();

    text("reverb:", leftmargin + 2, backButtonSize + 20 + margin * 11.5);
    text(
      "amp:",
      leftmargin + 2,
      backButtonSize + 20 + margin * 11.5 + textsize
    );
    this.reverbAmpAdj.position(
      leftmargin + 2 + 43,
      backButtonSize + 20 + margin * 11.5 + textsize
    );
    this.reverbAmp = this.reverbAmpAdj.value();

    // big visualizer
    stroke(mainL5);
    fill(mainL5);
    rect(width / 2, 0, width / 2, height);

    let waveform = this.analyzer.waveform();

    fill(0, 0, 0, 0);
    stroke(mainL0);
    strokeWeight(5);
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      curveVertex(
        map(i, 0, waveform.length, width / 2, width),
        height / 2 + waveform[i] * (height / 3)
      );
    }
    endShape();
    strokeWeight(1);
    stroke(mainL5);
    fill(mainL3);
  }
  panelRender() {
    // dragging
    if (
      !mouseInUse &&
      clickedAt(this.panelx, this.panely, this.panelWidth, this.panelBarSize)
    ) {
      mouseInUse = true;
      this.dragging = true;
    }
    // letting go of drag
    if (mouseIsReleased) {
      mouseInUse = false;
      this.dragging = false;
    }
    if (this.dragging) {
      this.panelx += mouseX - pmouseX;
      this.panely += mouseY - pmouseY;
    }

    let rightX = this.panelx + this.panelWidth;
    let bottomY = this.panely + this.panelHeight;
    let windowy = this.panely + this.panelBarSize;
    let windowh = this.panelHeight - this.panelBarSize;

    this.nodeSoundOutputX = rightX + nodeLineLength;
    this.nodeSoundOutputY = windowy + windowh / 2;
    this.nodeMidiInputPosX = this.panelx - nodeLineLength;
    this.nodeMidiInputPosY = this.panely + this.panelBarSize * 2;
    this.nodeFreqModInputPosX = this.panelx - nodeLineLength;
    this.nodeFreqModInputPosY = this.panely + this.panelBarSize * 3.5;
    this.nodeAmpModInputPosX = this.panelx - nodeLineLength;
    this.nodeAmpModInputPosY = this.panely + this.panelBarSize * 5;

    stroke(mainL5);
    // osc output
    line(
      rightX,
      this.nodeSoundOutputY,
      this.nodeSoundOutputX,
      this.nodeSoundOutputY
    );
    // midi input
    line(
      this.panelx,
      this.nodeMidiInputPosY,
      this.nodeMidiInputPosX,
      this.nodeMidiInputPosY
    );
    // osc input
    line(
      this.panelx,
      this.nodeFreqModInputPosY,
      this.nodeFreqModInputPosX,
      this.nodeFreqModInputPosY
    );
    line(
      this.panelx,
      this.nodeAmpModInputPosY,
      this.nodeAmpModInputPosX,
      this.nodeAmpModInputPosY
    );
    fill(soundInputOutputC);
    circle(this.nodeSoundOutputX, this.nodeSoundOutputY, nodeSize);
    fill(midiInputOutputC);
    circle(this.nodeMidiInputPosX, this.nodeMidiInputPosY, nodeSize);
    fill(soundInputOutputC);
    circle(this.nodeFreqModInputPosX, this.nodeFreqModInputPosY, nodeSize);
    circle(this.nodeAmpModInputPosX, this.nodeAmpModInputPosY, nodeSize);
    fill(mainL2);
    rect(this.panelx, this.panely, this.panelWidth, this.panelHeight);
    rect(this.panelx, this.panely, this.panelWidth, this.panelBarSize);
    // draw name
    fill(mainL5);
    noStroke();
    textSize(this.panelBarSize);
    textAlign(LEFT, TOP);
    text(this.name, this.panelx + 2, this.panely);
    stroke(mainL5);
    if (this.output) {
      line(
        this.nodeSoundOutputX,
        this.nodeSoundOutputY,
        nodeGlobalOutputX,
        nodeGlobalOutputY
      );
    }

    // node stuff

    // getting mouse click on node and setting creatingConnection variable to true
    if (
      clickedAt(
        this.nodeSoundOutputX - nodeHitbox / 2,
        this.nodeSoundOutputY - nodeHitbox / 2,
        nodeHitbox,
        nodeHitbox
      ) &&
      mouseInUse == false
    ) {
      this.creatingConnection = true;
      mouseInUse = true;
    }

    // drawing lines to connections

    for (let i = 0; i < this.connections.length; i++) {
      if (this.connections[i] === undefined) continue;
      if (this.connections[i][1] == "freq") {
        line(
          // drawing line
          this.nodeSoundOutputX,
          this.nodeSoundOutputY,
          this.connections[i][0].nodeFreqModInputPosX,
          this.connections[i][0].nodeFreqModInputPosY
        );
      }
      if (this.connections[i][1] == "amp") {
        line(
          // drawing line
          this.nodeSoundOutputX,
          this.nodeSoundOutputY,
          this.connections[i][0].nodeAmpModInputPosX,
          this.connections[i][0].nodeAmpModInputPosY
        );
      }
    }

    // looking for clicks at nodes it's connected to

    if (mouseIsClicked) {
      if (this.output) {
        if (
          mouseIsAt(
            nodeGlobalOutputX - nodeHitbox / 2,
            nodeGlobalOutputY - nodeHitbox / 2,
            nodeHitbox,
            nodeHitbox
          )
        ) {
          this.output = false;
          // start creatingConnection
          this.creatingConnection = true;
        }
      }
      for (let i = 0; i < this.connections.length; i++) {
        if (this.connections[i] === undefined) continue;

        // FOR FREQ
        if (this.connections[i][1] == "freq") {
          // if mouse is at a connected node
          if (
            mouseIsAt(
              this.connections[i][0].nodeFreqModInputPosX - nodeHitbox / 2,
              this.connections[i][0].nodeFreqModInputPosY - nodeHitbox / 2,
              nodeHitbox,
              nodeHitbox
            )
          ) {
            // look for osc in main array that matches this connection
            for (let j = 0; j < oscArray.length; j++) {
              if (oscArray[j] == this.connections[i][0]) {
                oscArray[j].freqModulator = {};
              }
            }
            // remove from personal connections array
            this.connections.splice(i, 1);
            // start creatingConnection
            this.creatingConnection = true;
          }
        }

        // FOR AMP
        else if (this.connections[i][1] == "amp") {
          // if mouse is at a connected node
          if (
            mouseIsAt(
              this.connections[i][0].nodeAmpModInputPosX - nodeHitbox / 2,
              this.connections[i][0].nodeAmpModInputPosY - nodeHitbox / 2,
              nodeHitbox,
              nodeHitbox
            )
          ) {
            // look for osc in main array that matches this connection
            for (let j = 0; j < oscArray.length; j++) {
              if (oscArray[j] == this.connections[i][0]) {
                oscArray[j].ampModulator = {};
              }
            }
            // remove from personal connections array
            this.connections.splice(i, 1);
            // start creatingConnection
            this.creatingConnection = true;
          }
        }
      }
    }

    // logic based on creatingConnection variable
    if (this.creatingConnection) {
      line(
        // drawing line
        this.nodeSoundOutputX,
        this.nodeSoundOutputY,
        mouseX,
        mouseY
      );
      if (mouseIsReleased) {
        // what to do when mouse is released
        for (let i = 0; i < oscArray.length; i++) {
          if (
            // look for connection to master output
            mouseIsAt(
              nodeGlobalOutputX - nodeHitbox / 2,
              nodeGlobalOutputY - nodeHitbox / 2,
              nodeHitbox,
              nodeHitbox
            )
          ) {
            this.output = true;
          }
          // prevent connection to self
          if (oscArray[i] != this) {
            if (
              // look for connection to FREQ input node
              mouseIsAt(
                oscArray[i].nodeFreqModInputPosX - nodeHitbox / 2,
                oscArray[i].nodeFreqModInputPosY - nodeHitbox / 2,
                nodeHitbox,
                nodeHitbox
              )
            ) {
              // apply freq modulation to found connection
              oscArray[i].freqModulator = this;
              // add to personal connections
              this.connections.push([oscArray[i], "freq"]);
            }
            if (
              // look for connection to AMP input node
              mouseIsAt(
                oscArray[i].nodeAmpModInputPosX - nodeHitbox / 2,
                oscArray[i].nodeAmpModInputPosY - nodeHitbox / 2,
                nodeHitbox,
                nodeHitbox
              )
            ) {
              // apply amp modulation to found connection
              oscArray[i].ampModulator = this;
              // add to personal connections
              this.connections.push([oscArray[i], "amp"]);
            }
          }
        }
      }
    }
    if (mouseIsReleased) {
      this.creatingConnection = false;
    }

    fill(mainL4);
    stroke(mainL5);
    circle(rightX - 40, windowy + windowh / 2, 40);
    if (doubleClickedAt(rightX - 60, -20 + windowy + windowh / 2, 40, 40)) {
      currentFocus = this;
    }

    if (deleteMode) {
      fill(255, 0, 0, 100);
      if (
        mouseIsAt(this.panelx, this.panely, this.panelWidth, this.panelHeight)
      ) {
        if (deleteFocus === undefined || deleteFocus == this) {
          deleteFocus = this;
        }
      }
      if (deleteFocus == this) {
        if (
          mouseIsAt(this.panelx, this.panely, this.panelWidth, this.panelHeight)
        ) {
          fill(255, 100, 100, 100);
        } else {
          deleteFocus = undefined;
        }
      }

      noStroke();
      rect(this.panelx, this.panely, this.panelWidth, this.panelHeight);
      strokeWeight(3);
      stroke(255, 100, 100);
      line(
        this.panelx,
        this.panely,
        this.panelx + this.panelWidth,
        this.panely + this.panelHeight
      );
      line(
        this.panelx + this.panelWidth,
        this.panely,
        this.panelx,
        this.panely + this.panelHeight
      );
      strokeWeight(1);
    }
  }
  unrender() {
    this.volumeAdj.position(-500, -500);
    this.A.position(-500, -500);
    this.D.position(-500, -500);
    this.S.position(-500, -500);
    this.R.position(-500, -500);
    this.reverbAmpAdj.position(-500, -500);
  }
  valuecopy(source) {
    if (source === undefined) return;
  }
}
