class Midi {
  constructor() {
    this.name = "midi";

    this.playheadIndex = 0;
    this.prevPlayheadIndex = 0;

    this.countDiff = 0;

    this.data = [0];
    this.tickLength = 8;
    this.speed = 1;
    this.usingGlobalSpeed = true;
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
    this.mainBarSize = 100;
    this.playheadSize = 20;
    this.mainBarSizeReal = this.mainBarSize - this.playheadSize;
    this.offsetX = 0;
    this.offsetY = this.mainBarSize;
    this.scrollbarSize = 15;
    this.scrollDragX = false;
    this.scrollDragY = false;
    this.nubDrag = false;
    this.viewWidth = width - this.scrollbarSize;
    this.viewHeight = height - this.scrollbarSize - this.offsetY;
    this.noteAnchorX = 0;
    this.noteAnchorY = 0;
    this.noteDrag = false;
    this.noteDeleting = false;

    this.barMargin = 30;

    this.ticksAdj = new Adjustable(8);
    this.ticksAdj.bounds(1, 9999);
    this.ticksAdj.position(
      this.mainBarSizeReal + this.barMargin,
      this.mainBarSizeReal / 2
    );
    this.ticksAdj.h = this.mainBarSizeReal / 3;
    this.ticksAdj.w = (this.ticksAdj.h / 2) * 5;

    this.speedAdj = new Adjustable(5);
    this.speedAdj.bounds(0.1, 99);
    this.speedAdj.decimals = true;
    this.speedAdj.position(
      this.barMargin + this.mainBarSizeReal + this.ticksAdj.w + this.barMargin,
      this.mainBarSizeReal / 2
    );
    this.speedAdj.h = this.mainBarSizeReal / 3;
    this.speedAdj.w = (this.ticksAdj.h / 2) * 6;

    this.multAdj = new Adjustable(1);
    this.multAdj.bounds(1, 99);
    this.multAdj.position(
      this.barMargin +
        this.mainBarSizeReal +
        this.ticksAdj.w +
        this.barMargin +
        this.speedAdj.w +
        this.barMargin / 3 +
        13 +
        this.barMargin / 3,
      this.mainBarSizeReal / 2
    );
    this.multAdj.h = this.mainBarSizeReal / 3;
    this.multAdj.w = (this.ticksAdj.h / 2) * 2.5;

    this.usingGlobalSpeedAdj = createCheckbox("", true);
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
    if (this.playheadIndex == this.prevPlayheadIndex) {
      this.currentCommand = 0;
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
      //  this.playheadIndex = 0;
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

    background(mainL1);

    // Playhead

    noStroke();
    fill(0, 0, 0, 30);
    rect(
      w * this.playheadIndex - scrollOffsetX + this.offsetX,
      this.offsetY,
      w,
      this.viewHeight
    );

    stroke(mainL2);
    fill(mainL2);

    // Vertical Lines and Notes

    let wScaled;

    for (let k = 0; k < midiArray.length; k++) {
      if (midiArray[k] === undefined) continue;
      if (this.usingGlobalSpeed == true) {
        if (midiArray[k].data == this.data) {
          wScaled =
            (w * (globalSpeed * this.speedMultiplier)) /
            (globalSpeed * midiArray[k].speedMultiplier);
        } else {
          wScaled =
            (w * (globalSpeed * this.speedMultiplier)) /
            (midiArray[k].speed * midiArray[k].speedMultiplier);
        }
      } else {
        wScaled =
          (w * (this.speed * this.speedMultiplier)) /
          (midiArray[k].speed * midiArray[k].speedMultiplier);
      }
      let fullWidth = w * this.tickLength;
      if (ghostNotes || midiArray[k].data == this.data) {
        for (let j = 0; j < fullWidth / wScaled; j++) {
          let posX = wScaled * j - scrollOffsetX + this.offsetX;
          let modIndex = j % midiArray[k].tickLength;
          let notePosY =
            h * map(midiArray[k].data[modIndex], 0, 128, 128, 0) -
            scrollOffsetY +
            this.offsetY;
          let noteLength = 1;
          let jMod = j % midiArray[k].tickLength;
          for (let o = 0; jMod + o < fullWidth / wScaled; o++) {
            if (o + jMod == jMod) continue;
            if (midiArray[k].data[jMod + o] != "0") break;
            noteLength++;
          }
          if (
            posX <= this.viewWidth + this.offsetX &&
            posX + wScaled * noteLength > 0 + this.offsetX - wScaled
          ) {
            fill(mainL2);
            if (midiArray[k].data == this.data) {
              stroke(mainL2);
              line(posX, this.offsetY, posX, this.viewHeight + this.offsetY);
              fill(mainL5);
              //text(j, posX, h + this.offsetY);
            }
            if (
              notePosY <= this.viewHeight + this.offsetY &&
              notePosY >= 0 + this.offsetY
            ) {
              stroke(0, 0);
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
        fill(mainL5);
        //text(map(j, 0, 128, 128, 0), this.offsetX, posY + h - 2);
      }
    }

    // the nub

    if (
      clickedAt(
        scrollbarWidth,
        scrollbarHeight,
        this.scrollbarSize,
        this.scrollbarSize
      ) &&
      !mouseInUse
    ) {
      this.nubDrag = true;
      requestPointerLock();
    }
    if (mouseIsReleased) {
      this.nubDrag = false;
      exitPointerLock();
    }

    if (this.nubDrag == true) {
      this.mHeight = max(this.viewHeight / 128, this.mHeight + -movedY * 0.15);
      this.mWidth = max(
        this.viewWidth / this.tickLength,
        this.mWidth + -movedX * 0.4
      );
    }

    // Scrollbars

    fill(mainL1);
    rect(this.offsetX, scrollbarHeight, scrollbarWidth, this.scrollbarSize);
    rect(scrollbarWidth, this.offsetY, this.scrollbarSize, height);
    fill(mainL2);

    // X
    stroke(mainL5);
    rect(
      (scrollbarWidth / this.tickLength) * this.scrollX + this.offsetX,
      scrollbarHeight,
      ((scrollbarWidth / this.tickLength) * scrollbarWidth) / w,
      this.scrollbarSize
    );
    // Hitbox
    if (
      !mouseInUse &&
      clickedAt(
        (scrollbarWidth / this.tickLength) * this.scrollX + this.offsetX,
        scrollbarHeight,
        ((scrollbarWidth / this.tickLength) * scrollbarWidth) / w,
        this.scrollbarSize
      )
    ) {
      this.scrollDragX = true;
      mouseInUse = true;
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
      !mouseInUse &&
      clickedAt(
        scrollbarWidth,
        ((scrollbarHeight - this.offsetY) / 128) * this.scrollY + this.offsetY,
        this.scrollbarSize,
        ((scrollbarHeight / 128) * scrollbarHeight) / h
      )
    ) {
      this.scrollDragY = true;
      mouseInUse = true;
    }

    fill(mainL2); // the nub
    rect(
      scrollbarWidth,
      scrollbarHeight,
      this.scrollbarSize,
      this.scrollbarSize
    );
    fill(mainL1); // moving square inside

    rectMode(CORNERS);
    let mapY = min(
      //number 40 is arbitrary
      map(
        this.mHeight,
        this.viewHeight / 128,
        40,
        0,
        this.scrollbarSize / 2 - 5
      ),
      this.scrollbarSize / 2
    );
    let mapX = min(
      map(
        //number 250 is arbitrary
        this.mWidth,
        this.viewWidth / this.tickLength,
        250,
        0,
        this.scrollbarSize / 2 - 5
      ),
      this.scrollbarSize / 2
    );
    rect(
      scrollbarWidth + mapX,
      scrollbarHeight + mapY,
      scrollbarWidth + this.scrollbarSize - mapX,
      scrollbarHeight + this.scrollbarSize - mapY
    );
    rectMode(CORNER);
    noStroke();
    // Moving checkboxes back into place

    this.usingGlobalSpeedAdj.position(
      this.barMargin +
        this.mainBarSizeReal +
        this.ticksAdj.w +
        this.barMargin +
        this.speedAdj.w +
        this.barMargin / 3 +
        13 +
        this.barMargin / 3 +
        this.multAdj.w +
        this.barMargin +
        80,
      this.mainBarSizeReal / 1.7
    );

    // Main bar

    fill(mainL2);
    rect(0, 0, width, this.mainBarSize); // main bar bg
    fill(mainL3);
    stroke(mainL5);
    rect(0, this.mainBarSize, width, -this.playheadSize); //playhead bar
    noStroke();
    for (let i = 0; i < this.tickLength; i++) {
      fill(mainL2);
      if (i == this.playheadIndex) {
        fill(mainL5);
      }
      circle(
        w * (i - this.scrollX) + w / 2,
        this.mainBarSize - this.playheadSize / 2,
        8
      );
    }
    fill(mainL4);
    stroke(mainL5);
    let backButtonPos = this.mainBarSizeReal / 2;
    let backButtonSize = this.mainBarSizeReal - 20;
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

    // Adjustables

    noStroke();
    fill(mainL5);
    textSize(this.ticksAdj.h);
    text(
      "length:",
      this.barMargin + this.mainBarSizeReal,
      this.mainBarSizeReal / 6
    );
    fill(mainL3);
    this.ticksAdj.render();
    this.tickLength = this.ticksAdj.value;

    fill(mainL5);
    text(
      "speed:",
      this.barMargin + this.mainBarSizeReal + this.ticksAdj.w + this.barMargin,
      this.mainBarSizeReal / 6
    );
    fill(mainL3);
    if (this.usingGlobalSpeed) {
      this.speedAdj.render(globalSpeed.toFixed(3));
    } else {
      this.speedAdj.render();
    }
    this.speed = this.speedAdj.value;
    fill(mainL5);
    text(
      "*",
      this.barMargin +
        this.mainBarSizeReal +
        this.ticksAdj.w +
        this.barMargin +
        this.speedAdj.w +
        this.barMargin / 3,
      this.mainBarSizeReal / 2
    );
    fill(mainL3);
    this.multAdj.render();
    this.speedMultiplier = this.multAdj.value;
    text(
      "use global speed:",
      this.barMargin +
        this.mainBarSizeReal +
        this.ticksAdj.w +
        this.barMargin +
        this.speedAdj.w +
        this.barMargin / 3 +
        13 +
        this.barMargin / 3 +
        this.multAdj.w +
        this.barMargin,
      this.mainBarSizeReal / 6
    );

    stroke(mainL5);

    this.usingGlobalSpeed = this.usingGlobalSpeedAdj.checked();

    // Playhead adjusting logic

    let xOver = floor((mouseX - this.offsetX + w * this.scrollX) / w);
    let yOver = floor((mouseY - this.offsetY + h * this.scrollY) / h);

    if (mouseIsPressed && !mouseInUse) {
      if (mouseIsAt(0, this.mainBarSizeReal, width, this.playheadSize)) {
        if (!this.usingGlobalSpeed) {
          globalTime = xOver * (1 / (this.speed * this.speedMultiplier));
          globalStart = xOver * (1 / (this.speed * this.speedMultiplier));
        } else {
          globalTime = xOver * (1 / (globalSpeed * this.speedMultiplier));
          globalStart = xOver * (1 / (globalSpeed * this.speedMultiplier));
        }
      }
    }

    // Note input

    fill(mainL2);
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
      !mouseInUse &&
      mouseX <= this.viewWidth &&
      mouseX >= this.offsetX &&
      mouseY <= this.viewHeight + this.offsetY &&
      mouseY >= this.offsetY
    ) {
      if (mouseButton === LEFT) {
        // trying to get tone on adding midi note to work
        //this.currentCommand = map(yOver, 0, 128, 128, 0);

        this.noteDeleting = false;
        mouseInUse = true;
      } else if (mouseButton === RIGHT) {
        this.noteDeleting = true;
        mouseInUse = true;
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

    stroke(mainL5);
    // osc output
    line(
      rightX,
      this.nodeMidiOutputY,
      this.nodeMidiOutputX,
      this.nodeMidiOutputY
    );

    //actually drawing the box
    fill(midiInputOutputC);
    circle(this.nodeMidiOutputX, this.nodeMidiOutputY, nodeSize);
    fill(mainL2);
    rect(this.panelx, this.panely, this.panelWidth, this.panelHeight);
    rect(this.panelx, this.panely, this.panelWidth, this.panelBarSize);
    fill(mainL5);
    noStroke();
    textSize(this.panelBarSize);
    textAlign(LEFT, TOP);
    text(this.name, this.panelx + 2, this.panely);

    fill(mainL4);
    stroke(mainL5);
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
                  oscArray[j].midi.splice(k, 1);
                }
              }
            }
          }
          // remove from personal connections array
          this.connections.splice(i, 1);
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
    if (mouseIsReleased) {
      this.creatingConnection = false;
    }
  }
  unrender() {
    this.usingGlobalSpeedAdj.position(-500, -500);
  }
}
