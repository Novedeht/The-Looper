class Splash {
  constructor() {
    this.splashBorder = 100;
    fill(255);
    stroke(255, 0, 0);
    rect(
      this.splashBorder,
      this.splashBorder,
      width - this.splashBorder * 2,
      height - this.splashBorder * 2
    );
    // draw a rectangle like this in a 3D enviornment
    // rect(this.splashBorder-(windowWidth/2), this.splashBorder-(windowHeight/2), windowWidth-this.splashBorder*2, windowHeight-this.splashBorder*2);
    fill(0, 0, 222);
    strokeWeight(3);

    line(
      width - this.splashBorder - 40,
      this.splashBorder + 20,
      width - this.splashBorder - 20,
      this.splashBorder + 40
    );
    line(
      width - this.splashBorder - 20,
      this.splashBorder + 20,
      width - this.splashBorder - 40,
      this.splashBorder + 40
    );

    this.title = createDiv("The Looper");
    this.title.style("color:deeppink");
    this.title.style("font-family: Arial, Helvetica, sans-serif");
    this.title.position(this.splashBorder + 20, this.splashBorder + 20);

    this.name = createDiv("Louis Chavasse");
    this.name.position(this.splashBorder + 20, this.splashBorder + 60);

    this.info = createDiv(
      "This is a program you can use to write midi data and play it using an oscillator. <p> Click the + button to add a midi or oscillator panel, you can connect them to each other by clicking and dragging over the nodes.<p>Yellow nodes = MIDI input/output <p> Blue nodes = sound input/output<p> The blue dot all the way to the right is the master output.<p> You can connect the sound output of an oscillator to the sound input of another oscillator to do FM/AM modulation. Double click a panel to open up the editor for that panel.<p> Midi panels can have different beat lengths, as well as different tempos.<p> The speed multiplier can be used to make polyrhythms. <p>Try experimenting with it!<p> <a href=https://https://editor.p5js.org/louischavasse1/sketches/LJCAHD6Te>view code</a>"
    );
    this.info.position(this.splashBorder + 20, this.splashBorder + 100);
    this.info.size(
      width - this.splashBorder * 2 - 50,
      height - this.splashBorder * 2 - 50
    );
  }

  update() {
    if (
      mouseX > width - this.splashBorder - 40 &&
      mouseX < width - this.splashBorder - 20 &&
      mouseY < this.splashBorder + 40 &&
      mouseY > this.splashBorder + 20
    ) {
      return true;
    }
  }

  hide() {
    this.title.remove();
    this.name.remove();
    this.info.remove();
    strokeWeight(1);
  }
}
