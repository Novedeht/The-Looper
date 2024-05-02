class Adjustable {
  constructor(defaultValue) {
    this.x = 0;
    this.y = 0;
    this.size = 50;
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
    this.alignX = LEFT;
    this.alignY = CENTER;
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
  render() {
    fill(0);
    textSize(this.size);
    textAlign(this.alignX, this.alignY);
    if (this.decimals) {
      text(this.value.toFixed(3), this.x, this.y);
    } else {
      text(this.value, this.x, this.y);
    }
    let alignXOffset;
    if(this.alignX == LEFT) {
      alignXOffset = 0
    }
    if(this.alignX == CENTER) {
      alignXOffset = -this.size / 2
    }
    if(this.alignX == RIGHT) {
      alignXOffset = -this.size
    }
    if (clickedAt(this.x+alignXOffset, this.y - this.size / 2, this.size, this.size)) {
      requestPointerLock();
      this.editing = true;
      this.anchor = this.value;
      this.difference = 0;
    }
 
    if (this.editing) {
      this.difference += movedY;
      if (this.decimals == true) {
        this.value = this.anchor + -this.difference * this.sensitivity;
      } else {
        this.value = Math.trunc(
          this.anchor + -this.difference * this.sensitivity
        );
      }
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
