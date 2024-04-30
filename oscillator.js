class Oscillator {
  constructor() {
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

    this.output = false;
    this.modLevel = 0;
    // 0 = no modulation
    // 1 = freq modulation
    // 2 = amp modulation
    // 3 = freq and amp modulation
    this.volume = 0.1;
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
  }
  update() {
    this.env.setADSR(this.attack, this.decay, this.sustain, this.release);
    this.env.setRange(this.volume, 0);

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
      this.carriers[this.modLevel].amp(this.volume);
      this.carriers[this.modLevel].freq(this.freq * this.freqMultiplier);
    } else {
      this.carriers[this.modLevel].amp(0)
      for (let i = 0; i < this.midi.length; i++) {
        if (this.midi[i] === undefined) continue;
        if (this.midi[i].currentCommand > 0) {
          this.carriers[this.modLevel].freq(
            midiToFreq(this.midi[i].currentCommand) * this.freqMultiplier
          );
          this.env.triggerAttack(this.carriers[this.modLevel]);
        } else if (this.midi[i].currentCommand == -1) {
          this.env.triggerRelease(this.carriers[this.modLevel]);
        }
      }
    }
  }
  tabRender() {
    text("wavetype: " + this.waveType, 50, 100);
    text("volume: " + this.volume, 50, 130);
    text("freq: " + this.freq, 50, 160);

    fill(60);
    stroke(0);
    strokeWeight(3);
    circle(30, 30, 40);
    if (doubleClickedAt(15, 15, 40, 40)) {
      currentFocus = 0;
    }
    strokeWeight(1);
    fill(100);
  }
  panelRender() {
    if (
      !mouseInUse &&
      clickedAt(this.panelx, this.panely, this.panelWidth, this.panelBarSize)
    ) {
      mouseInUse = true;
      this.dragging = true;
    }
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

    stroke(0);
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
    fill(150);
    rect(this.panelx, this.panely, this.panelWidth, this.panelHeight);
    rect(this.panelx, this.panely, this.panelWidth, this.panelBarSize);
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
            this.connections.splice(i,1);
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
            this.connections.splice(i,1);
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
          // prevent connection to self
          if (oscArray[i] != this) {
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

    fill(60);
    stroke(0);
    circle(rightX - 40, windowy + windowh / 2, 40);
    if (doubleClickedAt(rightX - 60, -20 + windowy + windowh / 2, 40, 40)) {
      currentFocus = this;
    }
  }
}
