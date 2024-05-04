class Adjustable {
  constructor(defaultValue) {
    this.x = 0;
    this.y = 0;
    this.h = 50;
    this.w = 143;
    this.size = this.h;
    if (defaultValue !== undefined) {
      this.value = defaultValue;
    } else {
      this.value = 0;
    }

    this.lowerLimit = 0;
    this.upperLimit = 0;
    this.editing = false;
    this.sensitivity = 0.1;
    this.decimals = false;
    this.difference = 0;
  }
  position(x, y) {
    this.x = x;
    this.y = y;
  }
  bounds(l, u) {
    this.lowerLimit = l;
    this.upperLimit = u;
  }
  value() {
    return this.value;
  }
  render(override) {
    this.size = this.h;
    stroke(mainL5);
    textSize(this.size);
    textAlign(LEFT, TOP);
    rect(this.x, this.y, this.w, this.h);

    fill(mainL5);
    noStroke();
    if (override !== undefined) {
      text(override, this.x + 3, this.y + 2);
    } else {
      if (this.decimals) {
        text(this.value.toFixed(3), this.x + 3, this.y + 2);
      } else {
        text(this.value, this.x + 3, this.y + 2);
      }
    }
    if (clickedAt(this.x, this.y, this.w, this.h)) {
      requestPointerLock();
      this.editing = true;
      this.anchor = this.value;
      this.difference = 0;
    }

    if (this.editing && !override) {
      this.difference += movedY;
      if (this.decimals == true) {
        this.value = this.anchor + -this.difference * this.sensitivity;
      } else {
        this.value = Math.trunc(
          this.anchor + -this.difference * this.sensitivity
        );
      }
        // only change value if display is not being overwritten
        if (this.upperLimit > 0) {
          this.value = min(this.value, this.upperLimit);
        }
        this.value = max(this.value, this.lowerLimit);
    }

    if (mouseIsReleased) {
      this.editing = false;
      exitPointerLock();
    }
  }
}
