class Midi {
  constructor() {
    this.playheadIndex = 0;
    this.prevPlayheadIndex = 0;

    this.countDiff = 0;

    this.data = [0];
    this.tickLength = 1
    this.speed = 1;
    this.usingGlobalSpeed = false;
    this.speedMultiplier = 1;

    this.currentCommand = undefined;
    this.prevCommand = undefined;

    // panel stuff

    this.panelx = width / 2;
    this.panely = height / 2;
    this.panelWidth = 100;
    this.panelHeight = 100;
    this.panelBarSize = 15;
    this.dragging = false;

    this.nodeMidiOutputX = 0;
    this.nodeMidiOutputY = 0;

    this.creatingConnection = false;
    this.connections = [];

    // GUI variables

    this.mWidth = 10;
    this.mHeight = 10;

    this.scrollY = 32;
    this.maxScrollY = 0;
    this.scrollX = 0;
    this.maxScrollX = 0;
    this.mainBarSize = 80;
    this.playheadSize = 20;
    this.mainBarSizeReal = this.mainBarSize - this.playheadSize
    this.offsetX = 0;
    this.offsetY = this.mainBarSize;
    this.scrollbarSize = 15;
    this.scrollDragX = false;
    this.scrollDragY = false;
    this.viewWidth = width - this.scrollbarSize;
    this.viewHeight = height - this.scrollbarSize - this.offsetY;
    this.noteAnchorX = 0;
    this.noteAnchorY = 0;
    this.noteDrag = false;
    this.noteDeleting = false;
    
    this.speedAdjPlace = 250
    
    this.ticksAdj = new Adjustable(8)
    this.ticksAdj.bounds(1,0)
    this.ticksAdj.size = 35
    this.ticksAdj.position(140,this.mainBarSizeReal/2)
    
    this.speedAdj = new Adjustable(10)
    this.speedAdj.bounds(0.1,99)
    this.speedAdj.size = 35
    this.speedAdj.decimals = true
    this.speedAdj.position(this.speedAdjPlace,this.mainBarSizeReal/2)
    
    this.multAdj = new Adjustable(1)
    this.multAdj.bounds(1,99)
    this.multAdj.size = 35
    this.multAdj.position(this.speedAdjPlace + 120,this.mainBarSizeReal/2)
    
    this.usingGlobalSpeedAdj = createCheckbox('Use global speed', true)
    this.usingGlobalSpeedAdj.position(500,this.mainBarSizeReal/3)
  }

  update() {
    if (this.tickLength > this.data.length) {
      for (let i = 0; i < this.tickLength; i++) {
        if (this.data[i] === undefined) {
          this.data[i] = 0;
        }
      }
    }
    if (this.usingGlobalSpeed == true) {
      this.playheadIndex =
        floor(globalTime / (1 / (globalSpeed * this.speedMultiplier))) %
        this.tickLength;
    } else {
      this.playheadIndex =
        floor(globalTime / (1 / (this.speed * this.speedMultiplier))) %
        this.tickLength;
    }

    if (this.playheadIndex != this.prevPlayheadIndex && playbackState == 1) {
      this.currentCommand = this.data[this.playheadIndex];
    }

    if (playbackState == 1) {
      if (prevPlaybackState == 0 || prevPlaybackState == 2) {
        this.currentCommand = this.data[this.playheadIndex];
      }
    }

    if (playbackState == 2) {
      this.currentCommand = -1;
    }

    if (playbackState == 0) {
      this.currentCommand = -1;
      this.playheadIndex = 0;
      this.countDiff = 0;
    }

    this.prevPlayheadIndex = this.playheadIndex;
    this.prevCommand = this.currentCommand;
  }
  tabRender() {
    let w;
    let h;

    let scrollbarWidth = width - this.scrollbarSize;
    let scrollbarHeight = height - this.scrollbarSize;

    if (this.viewWidth / this.tickLength > this.mWidth) {
      w = this.viewWidth / this.tickLength;
    } else {
      w = this.mWidth;
    }

    if (this.viewHeight / 128 > this.mHeight) {
      h = this.viewHeight / 128;
    } else {
      h = this.mHeight;
    }

    if (this.scrollDragX) {
      this.scrollX +=
        map(mouseX, 0, scrollbarWidth, 0, this.tickLength) -
        map(pmouseX, 0, scrollbarWidth, 0, this.tickLength);
    }
    if (this.scrollDragY) {
      this.scrollY +=
        map(mouseY, 0, scrollbarHeight, 0, 128) -
        map(pmouseY, 0, scrollbarHeight, 0, 128);
    }
    if (mouseIsReleased) {
      this.scrollDragX = false;
      this.scrollDragY = false;
    }

    this.maxScrollX = (w * this.tickLength - this.viewWidth) / w;
    this.scrollX = max(min(this.scrollX, this.maxScrollX), 0);

    this.maxScrollY = (h * 128 - this.viewHeight) / h;
    this.scrollY = max(min(this.scrollY, this.maxScrollY), 0);

    let scrollOffsetX;
    let scrollOffsetY;

    scrollOffsetX = this.scrollX * w;
    scrollOffsetY = this.scrollY * h;

    //noStroke();

    background(150);

    // Playhead

    noStroke();
    fill(0, 0, 0, 30);
    rect(
      w * this.playheadIndex - scrollOffsetX + this.offsetX,
      this.offsetY,
      w,
      this.viewHeight
    );

    stroke(100);
    fill(100);

    // Vertical Lines and Notes

    let wScaled;

    for (let k = 0; k < midiArray.length; k++) {
      if (midiArray[k] === undefined) continue;
      if (this.usingGlobalSpeed == true) {
        wScaled =
          (w * (globalSpeed * this.speedMultiplier)) /
          (globalSpeed * midiArray[k].speedMultiplier);
      } else {
        wScaled =
          (w * (this.speed * this.speedMultiplier)) /
          (midiArray[k].speed * midiArray[k].speedMultiplier);
      }
      let fullWidth = w * this.tickLength;
      if (ghostNotes || midiArray[k].data == this.data) {
        for (let j = 0; j < fullWidth / wScaled; j++) {
          let posX = wScaled * j - scrollOffsetX + this.offsetX;
          let modIndex = j % midiArray[k].data.length;
          let notePosY =
            h * map(midiArray[k].data[modIndex], 0, 128, 128, 0) -
            scrollOffsetY +
            this.offsetY;
          let noteLength = 1;
          let jMod = j % midiArray[k].data.length;
          for (let o = 0; jMod + o < fullWidth / wScaled; o++) {
            if (o + jMod == jMod) continue;
            if (midiArray[k].data[jMod + o] != "0") break;
            noteLength++;
          }
          if (
            posX <= this.viewWidth + this.offsetX &&
            posX + wScaled * noteLength > 0 + this.offsetX - wScaled
          ) {
            fill(100);
            if (midiArray[k].data == this.data) {
              fill(0);
              line(posX, this.offsetY, posX, this.viewHeight + this.offsetY);
              //text(j, posX, h + this.offsetY);
            }
            if (
              notePosY <= this.viewHeight + this.offsetY &&
              notePosY >= 0 + this.offsetY
            ) {
              rect(posX, notePosY, wScaled * noteLength, h); //wScaled, h);
            }
          }
        }
      }
    }

    // Horizontal lines

    for (let j = 0; j < 128; j++) {
      let posY = h * j - scrollOffsetY + this.offsetY;
      if (posY < height + this.offsetY && posY > 0 + this.offsetY) {
        stroke(100);
        line(this.offsetX, posY, width + this.offsetX, posY);
        stroke(0, 0, 0, 0);
        fill(0);
        //text(map(j, 0, 128, 128, 0), this.offsetX, posY + h - 2);
      }
    }

    // Scrollbars

    fill(150);
    rect(this.offsetX, scrollbarHeight, scrollbarWidth, this.scrollbarSize);
    rect(scrollbarWidth, this.offsetY, this.scrollbarSize, height);

    fill(100);
    rect(
      scrollbarWidth,
      scrollbarHeight,
      this.scrollbarSize,
      this.scrollbarSize
    );

    // X
    rect(
      (scrollbarWidth / this.tickLength) * this.scrollX + this.offsetX,
      scrollbarHeight,
      ((scrollbarWidth / this.tickLength) * scrollbarWidth) / w,
      this.scrollbarSize
    );
    // Hitbox
    if (
      clickedAt(
        (scrollbarWidth / this.tickLength) * this.scrollX + this.offsetX,
        scrollbarHeight,
        ((scrollbarWidth / this.tickLength) * scrollbarWidth) / w,
        this.scrollbarSize
      )
    ) {
      this.scrollDragX = true;
    }
    // Y
    rect(
      scrollbarWidth,
      (scrollbarHeight / 128) * this.scrollY + this.offsetY,
      this.scrollbarSize,
      ((scrollbarHeight / 128) * scrollbarHeight) / h
    );
    // Hitbox
    if (
      clickedAt(
        scrollbarWidth,
        ((scrollbarHeight - this.offsetY) / 128) * this.scrollY + this.offsetY,
        this.scrollbarSize,
        ((scrollbarHeight / 128) * scrollbarHeight) / h
      )
    ) {
      this.scrollDragY = true;
    }

    // Main bar
    
    this.usingGlobalSpeedAdj.position(500,this.mainBarSizeReal/3)

    fill(100);
    rect(0, 0, width, this.mainBarSize);
    for (let i = 0; i < this.tickLength; i++) {
      fill(150);
      if (i == this.playheadIndex) {
        fill(100);
      }
      circle(w * (i - this.scrollX) + w / 2, this.mainBarSize - this.playheadSize/2, 5);
    }
    fill(60);
    stroke(0);
    circle(this.mainBarSizeReal/2, this.mainBarSizeReal/2, 40);
    if (doubleClickedAt(15, 15, 40, 40)) {
      currentFocus = 0;
    }
    fill(100);
    //line(0,this.mainBarSizeReal,width,this.mainBarSizeReal)
    
    textAlign(LEFT, CENTER);
    textSize(35)
    fill(0)
    //noStroke()
    //text('Length:',80,this.mainBarSizeReal/2)
    this.ticksAdj.render()
    this.tickLength = this.ticksAdj.value
    
    //noStroke()
    //text('Speed:',240,this.mainBarSizeReal/2)
    
    this.speedAdj.render()
    this.speed = this.speedAdj.value
    
    textSize(20)
    text('*',this.speedAdjPlace + 103,this.mainBarSizeReal/2)
    
    this.multAdj.render()
    this.speedMultiplier = this.multAdj.value
    
    this.usingGlobalSpeed = this.usingGlobalSpeedAdj.checked()

    // Note input

    let xOver = floor((mouseX - this.offsetX + w * this.scrollX) / w);
    let yOver = floor((mouseY - this.offsetY + h * this.scrollY) / h);

    if (this.noteDrag == true && mouseIsReleased) {
      for (
        let u = this.noteAnchorX;
        u <= xOver + 1 && u < this.tickLength;
        u++
      ) {
        if (this.noteDeleting) {
          if (u == this.noteAnchorX) {
            this.data[u] = -1;
          } else if (u <= xOver) {
            this.data[u] = 0;
          }
        } else {
          if (u == this.noteAnchorX) {
            this.data[u] = map(this.noteAnchorY, 0, 128, 128, 0);
          } else if (u == xOver + 1) {
            if (this.data[u] == 0) {
              this.data[u] = -1;
            }
          } else {
            this.data[u] = 0;
          }
        }
      }
    }

    if (
      mouseIsClicked &&
      mouseX <= this.viewWidth &&
      mouseX >= this.offsetX &&
      mouseY <= this.viewHeight &&
      mouseY >= this.offsetY
    ) {
      if (mouseButton === LEFT) {
        this.noteDeleting = false;
      } else if (mouseButton === RIGHT) {
        this.noteDeleting = true;
      }
      this.noteDrag = true;
    } else if (mouseIsReleased) {
      this.noteDrag = false;
    }

    if (this.noteDrag == true) {
      xOver = max(
        floor((mouseX - this.offsetX + w * this.scrollX) / w),
        this.noteAnchorX
      );
    }

    if (this.noteDrag == false) {
      this.noteAnchorX = xOver;
      this.noteAnchorY = yOver;
    } else {
      stroke(0, 0, 0, 0);
      rect(
        (this.noteAnchorX - this.scrollX) * w + this.offsetX,
        (this.noteAnchorY - this.scrollY) * h + this.offsetY,
        w + (xOver - this.noteAnchorX) * w,
        h
      );
    }
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

    this.nodeMidiOutputX = rightX + nodeLineLength;
    this.nodeMidiOutputY = this.panely + this.panelHeight / 2;

    stroke(0);
    // osc output
    line(
      rightX,
      this.nodeMidiOutputY,
      this.nodeMidiOutputX,
      this.nodeMidiOutputY
    );
    fill(midiInputOutputC);
    circle(this.nodeMidiOutputX, this.nodeMidiOutputY, nodeSize);
    fill(150);
    rect(this.panelx, this.panely, this.panelWidth, this.panelHeight);
    rect(this.panelx, this.panely, this.panelWidth, this.panelBarSize);

    fill(60);
    stroke(0);
    circle(rightX - 40, windowy + windowh / 2, 40);
    if (doubleClickedAt(rightX - 60, -20 + windowy + windowh / 2, 40, 40)) {
      currentFocus = this;
    }

    // node stuff

    for (let i = 0; i < this.connections.length; i++) {
      if (this.connections[i] === undefined) continue;
      line(
        // drawing line
        this.nodeMidiOutputX,
        this.nodeMidiOutputY,
        this.connections[i].nodeMidiInputPosX,
        this.connections[i].nodeMidiInputPosY
      );
    }

    // looking for clicks at nodes it's connected to

    if (mouseIsClicked) {
      for (let i = 0; i < this.connections.length; i++) {
        if (this.connections[i] === undefined) continue;
        if (
          mouseIsAt(
            this.connections[i].nodeMidiInputPosX - nodeHitbox / 2,
            this.connections[i].nodeMidiInputPosY - nodeHitbox / 2,
            nodeHitbox,
            nodeHitbox
          )
        ) {
          // look for osc in main array that matches this connection
          for (let j = 0; j < oscArray.length; j++) {
            if (oscArray[j] == this.connections[i]) {
              // setting osc volume to be on now
              oscArray[j].carriers[oscArray[j].modLevel].amp(
                oscArray[j].volume
              );
              for (let k = 0; k < oscArray[j].midi.length; k++) {
                if (oscArray[j].midi[k] == this) {
                  oscArray[j].midi.splice(k,1);
                }
              }
            }
          }
          // remove from personal connections array
          this.connections.splice(i,1);
          // start creatingConnection
          this.creatingConnection = true;
        }
      }
    }

    // getting mouse click on node and setting creatingConnection variable to true
    if (
      clickedAt(
        this.nodeMidiOutputX - nodeHitbox / 2,
        this.nodeMidiOutputY - nodeHitbox / 2,
        nodeHitbox,
        nodeHitbox
      ) &&
      mouseInUse == false
    ) {
      this.creatingConnection = true;
      mouseInUse = true;
    }

    // logic based on creatingConnection variable
    if (this.creatingConnection) {
      line(
        // drawing line
        this.nodeMidiOutputX,
        this.nodeMidiOutputY,
        mouseX,
        mouseY
      );
      if (mouseIsReleased) {
        // what to do when mouse is released
        for (let i = 0; i < oscArray.length; i++) {
          if (oscArray[i] === undefined) continue;
          // prevent connection to self
          if (oscArray[i] != this) {
            if (
              // look for connection to midi input node
              mouseIsAt(
                oscArray[i].nodeMidiInputPosX - nodeHitbox / 2,
                oscArray[i].nodeMidiInputPosY - nodeHitbox / 2,
                nodeHitbox,
                nodeHitbox
              )
            ) {
              // cut oscillator tone
              oscArray[i].carriers[oscArray[i].modLevel].amp(0);
              // add midi panel to osc midi array
              oscArray[i].midi.push(this);
              // add to personal connections
              this.connections.push(oscArray[i]);
            }
          }
        }
      }
    }
    if (mouseIsReleased) {
      this.creatingConnection = false;
    }
  }
  unRender(){
    this.usingGlobalSpeedAdj.position(-500,-500)
  }
}
