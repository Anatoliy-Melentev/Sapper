class Point {
  constructor(coords) {
    this.coords = coords;
    this.bomb = false;
    this.open = false;
    this.count = 0;
    this.mates = [];
  }
  isOpen() {
    return this.open;
  }
  isBomb() {
    return this.bomb;
  }
  isCount() {
    return !this.isBomb() && this.count > 0;
  }
  isEmpty() {
    return !this.isBomb() && this.count === 0;
  }
  plantBomb() {
    this.bomb = true;
    this.getField().classList.add('bomb');
  }
  openField(){
    this.open = true;
    this.getField().classList.add('open');
  }
  setCount(count){
    this.count = count;
    this.getField().innerHTML = count;
    this.getField().classList.add('number');
  }
  getField() {
    return document.querySelector(`[data-x='${this.coords[0]}'][data-y='${this.coords[1]}']`);
  }
  getFieldByCoords([x,y]) {
    return document.querySelector(`[data-x='${x}'][data-y='${y}']`);
  }
  getMates([offsetX, offsetY]) {
    let
      topY = this.coords[1] - 1,
      bottomY = this.coords[1] + 1,
      leftX = this.coords[0] - 1,
      rigthX = this.coords[0] + 1;

    this.mates = [];

    if (topY >= 0 && leftX >= 0) {
      this.mates.push(this.getFieldByCoords([leftX, topY]).dataset.id);
    }
    if (topY >= 0) {
      this.mates.push(this.getFieldByCoords([this.coords[0], topY]).dataset.id);
    }
    if (topY >= 0 && rigthX < offsetX) {
      this.mates.push(this.getFieldByCoords([rigthX, topY]).dataset.id);
    }
    if (rigthX < offsetX) {
      this.mates.push(this.getFieldByCoords([rigthX, this.coords[1]]).dataset.id);
    }
    if (bottomY < offsetY && rigthX < offsetX) {
      this.mates.push(this.getFieldByCoords([rigthX, bottomY]).dataset.id);
    }
    if (bottomY < offsetY) {
      this.mates.push(this.getFieldByCoords([this.coords[0], bottomY]).dataset.id);
    }
    if (bottomY < offsetY && leftX >= 0) {
      this.mates.push(this.getFieldByCoords([leftX, bottomY]).dataset.id);
    }
    if (leftX >= 0) {
      this.mates.push(this.getFieldByCoords([leftX, this.coords[1]]).dataset.id);
    }

    return this.mates;
  }
}