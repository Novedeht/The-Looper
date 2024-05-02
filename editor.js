var playX;
var playY;
var playR;

var nodeGlobalOutputX;
var nodeGlobalOutputY;
var nodeSize = 10;
var nodeHitbox = nodeSize*2;
var nodeLineLength = 15;

function editSetup() {
  playX = width / 2;
  playY = height - height / 20;
  playS = height / 10;
  
  nodeGlobalOutputX = width - nodeLineLength
  nodeGlobalOutputY = height /2
  
  
}

function editRender() {
  

  let leftX = playX - playS / 2;
  let rightX = playX + playS / 2;

  fill(150);
  stroke(0);
  square(playX - playS, playY - playS / 2, playS);
  square(playX, playY - playS / 2, playS);
  noStroke();

  fill(80);
  square(rightX - playS / 4, playY - playS / 4, playS / 2);

  if (clickedAt(rightX - playS / 2, playY - playS / 2, playS, playS)) {
    playbackState = 0;
  }

  if (playbackState == 0 || playbackState == 2) {
    triangle(
      leftX - playS / 4,
      playY + playS / 4,
      leftX - playS / 4,
      playY - playS / 4,
      leftX + playS / 4,
      playY
    );

    if (clickedAt(leftX - playS / 2, playY - playS / 2, playS, playS)) {
      playbackState = 1;
    }
  } else {
    rect(leftX - playS / 4, playY - playS / 4, playS / 6, playS / 2);
    rect(leftX + playS / 4, playY - playS / 4, -playS / 6, playS / 2);
    if (clickedAt(leftX - playS / 2, playY - playS / 2, playS, playS)) {
      playbackState = 2;
    }
  }
  
  stroke(0)
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
  
  
  globalSpeedAdj.render()
  globalSpeed = globalSpeedAdj.value

}
