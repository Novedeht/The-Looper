var playX;
var playY;
var playR;
var playOffset;

var nodeGlobalOutputX;
var nodeGlobalOutputY;
var nodeSize = 10;
var nodeHitbox = nodeSize * 2;
var nodeLineLength = 15;

var globalSpeedAdj;

var createPosX = 300;
var createPosY;
var createSize = 30;

var creationPicker = false;
var deleteMode = false;
var deleteFocus;

function editSetup() {
  playX = width / 2;
  playSize = height / 10;
  playY = height - playSize;
  playOffset = -(playSize * 3) / 2;
  playCX = playX + playSize / 2 + playOffset;
  playCY = playY + playSize / 2;

  nodeGlobalOutputX = width - nodeLineLength;
  nodeGlobalOutputY = height / 2;
  createPosY = playY - 60;

  globalSpeedAdj = new Adjustable(5);
  globalSpeedAdj.bounds(0.1, 99);
  globalSpeedAdj.decimals = true;
  globalSpeedAdj.h = 100 / 3;
  globalSpeedAdj.w = (globalSpeedAdj.h / 2) * 6;
  globalSpeedAdj.position(width / 2 - globalSpeedAdj.w / 2, globalSpeedAdj.h);
}

function editRender() {
  for (let i = 0; i < 4; i++) {
    playX = width / 2;
    playX += playSize * i + playOffset;
    playCX = playX + playSize / 2;
    switch (i) {
      case 0:
        stroke(mainL5);
        fill(mainL2);
        square(playCX - playSize / 2, playY, playSize);
        fill(mainL4);
        if (playbackState == 0 || playbackState == 2) {
          triangle(
            playCX - playSize / 4,
            playCY + playSize / 4,
            playCX - playSize / 4,
            playCY - playSize / 4,
            playCX + playSize / 4,
            playCY
          );
          if (
            clickedAt(
              playCX - playSize / 2,
              playCY - playSize / 2,
              playSize,
              playSize
            )
          ) {
            playbackState = 1;
          }
        } else {
          rect(
            playCX - playSize / 4,
            playCY - playSize / 4,
            playSize / 6,
            playSize / 2
          );
          rect(
            playCX + playSize / 4,
            playCY - playSize / 4,
            -playSize / 6,
            playSize / 2
          );
          if (
            clickedAt(
              playCX - playSize / 2,
              playCY - playSize / 2,
              playSize,
              playSize
            )
          ) {
            playbackState = 2;
          }
        }
        break;
      case 1:
        stroke(mainL5);
        fill(mainL2);
        square(playCX - playSize / 2, playY, playSize);
        fill(mainL4);
        square(playCX - playSize / 4, playCY - playSize / 4, playSize / 2);
        if (
          clickedAt(
            playCX - playSize / 2,
            playCY - playSize / 2,
            playSize,
            playSize
          )
        ) {
          globalStart = 0;
          playbackState = 0;
        }
        break;
      case 2:
        stroke(mainL5);
        fill(createC);
        circle(playCX, playCY, playSize);
        noStroke();
        fill(mainL3);
        //rectangle fills
        rect(
          playCX - playSize / 12,
          playCY - playSize / 4,
          playSize / 6,
          playSize / 2
        );
        rect(
          playCX - playSize / 4,
          playCY - playSize / 12,
          playSize / 2,
          playSize / 6
        );
        stroke(mainL5);
        //outline
        line(
          playCX - playSize / 12,
          playCY - playSize / 4,
          playCX + playSize / 12,
          playCY - playSize / 4
        );
        line(
          playCX + playSize / 12,
          playCY - playSize / 4,
          playCX + playSize / 12,
          playCY - playSize / 12
        );
        line(
          playCX + playSize / 12,
          playCY - playSize / 12,
          playCX + playSize / 4,
          playCY - playSize / 12
        );
        line(
          playCX + playSize / 4,
          playCY - playSize / 12,
          playCX + playSize / 4,
          playCY + playSize / 12
        );
        line(
          playCX + playSize / 4,
          playCY + playSize / 12,
          playCX + playSize / 12,
          playCY + playSize / 12
        );
        line(
          playCX + playSize / 12,
          playCY + playSize / 12,
          playCX + playSize / 12,
          playCY + playSize / 4
        );
        line(
          playCX + playSize / 12,
          playCY + playSize / 4,
          playCX - playSize / 12,
          playCY + playSize / 4
        );
        line(
          playCX - playSize / 12,
          playCY + playSize / 4,
          playCX - playSize / 12,
          playCY + playSize / 12
        );
        line(
          playCX - playSize / 12,
          playCY + playSize / 12,
          playCX - playSize / 4,
          playCY + playSize / 12
        );
        line(
          playCX - playSize / 4,
          playCY + playSize / 12,
          playCX - playSize / 4,
          playCY - playSize / 12
        );
        line(
          playCX - playSize / 4,
          playCY - playSize / 12,
          playCX - playSize / 12,
          playCY - playSize / 12
        );
        line(
          playCX - playSize / 12,
          playCY - playSize / 12,
          playCX - playSize / 12,
          playCY - playSize / 4
        );
        // hitbox
        if (!creationPicker) {
          if (
            clickedAt(
              playCX - playSize / 2,
              playCY - playSize / 2,
              playSize,
              playSize
            )
          ) {
            creationPicker = true;
          }
        } else {
          // open creating tab
          let selectsize = 20;

          if (mouseIsAt(playX, playY - selectsize, playSize, selectsize)) {
            stroke(mainL1);
            fill(mainL3);
            rect(playX, playY - selectsize, playSize, selectsize);
            textSize(selectsize);
            noStroke();
            fill(mainL1);
            text("oscillator", playX, playY - selectsize);
            if (mouseIsClicked && !mouseInUse) {
              let newOsc = new Oscillator();
              newOsc.name = "oscillator " + oscArray.length;
              oscArray.push(newOsc);
              creationPicker = false;
            }
          } else {
            stroke(mainL5);
            fill(mainL2);
            rect(playX, playY - selectsize, playSize, selectsize);
            textSize(selectsize);
            noStroke();
            fill(mainL5);
            text("oscillator", playX, playY - selectsize);
          }

          if (mouseIsAt(playX, playY - selectsize * 2, playSize, selectsize)) {
            stroke(mainL1);
            fill(mainL3);
            rect(playX, playY - selectsize * 2, playSize, selectsize);
            textSize(selectsize);
            noStroke();
            fill(mainL1);
            text("midi", playX, playY - selectsize * 2);
            if (mouseIsClicked && !mouseInUse) {
              let newMidi = new Midi();
              newMidi.name = "midi " + midiArray.length;
              midiArray.push(newMidi);
              creationPicker = false;
            }
          } else {
            stroke(mainL5);
            fill(mainL2);
            rect(playX, playY - selectsize * 2, playSize, selectsize);
            textSize(selectsize);
            noStroke();
            fill(mainL5);
            text("midi", playX, playY - selectsize * 2);
          }
          if (mouseIsClicked) {
            creationPicker = false;
          }
        }
        break;
      case 3:
        let deletesize = 25;
        let deletex = playX + deletesize / 2;
        let deletey = playY + playSize - deletesize / 2;
        stroke(mainL5);
        fill(deleteC);
        if (deleteMode) fill(mainL2);
        circle(deletex, deletey, deletesize);
        strokeWeight(1);
        if (!deleteMode) {
          line(
            deletex - deletesize / 5,
            deletey - deletesize / 5,
            deletex + deletesize / 5,
            deletey + deletesize / 5
          );
          line(
            deletex + deletesize / 5,
            deletey - deletesize / 5,
            deletex - deletesize / 5,
            deletey + deletesize / 5
          );
        } else {
          fill(mainL3);
          square(
            deletex - deletesize / 5,
            deletey - deletesize / 5,
            deletesize / 2.5
          );
        }
        strokeWeight(1);
        if (!deleteMode) {
          if (
            clickedAt(
              deletex - deletesize / 2,
              deletey - deletesize / 2,
              deletesize,
              deletesize
            )
          ) {
            deleteMode = true;
          }
        } else {
          if (mouseIsClicked) {
            if (deleteFocus !== undefined) {
              for (let i = 0; i < oscArray.length; i++) {
                if (deleteFocus == oscArray[i]) {
                  oscArray.splice(i, 1);
                  deleteFocus = undefined;
                }
              }
              for (let i = 0; i < midiArray.length; i++) {
                if (deleteFocus == midiArray[i]) {
                  midiArray.splice(i, 1);
                  deleteFocus = undefined;
                }
              }
            } else {
              deleteMode = false;
            }
          }
        }
        if (oscArray.length == 0 && midiArray.length == 0) {
          deleteMode = false
        }
        break;
    }
  }

  //master node
  stroke(mainL5);
  fill(soundInputOutputC);
  circle(nodeGlobalOutputX, nodeGlobalOutputY, nodeSize);

  for (let i = 0; i < midiArray.length; i++) {
    if (midiArray[i] === undefined) continue;
    midiArray[i].panelRender();
  }

  for (let i = 0; i < oscArray.length; i++) {
    if (oscArray[i] === undefined) continue;
    oscArray[i].panelRender();
  }
  noStroke();
  fill(mainL5);
  textAlign(CENTER, TOP);
  textSize(globalSpeedAdj.h);
  text("global speed:", width / 2, 0);
  fill(mainL2);
  globalSpeedAdj.render();
  globalSpeed = globalSpeedAdj.value;
}
