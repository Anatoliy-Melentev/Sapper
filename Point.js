class Point {
  constructor(coords) {
    this.coords = coords;
    this.bomb = false;
    this.open = false;
    this.flag = false;
    this.count = 0;
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
  }
  openField(){
    this.open = true;
    this.getField().classList.add('open');

    if (this.isCount()) {
      this.getField().innerHTML = this.count;
      this.getField().classList.add('number');
    }
    if (this.isBomb()) {
      this.getField().classList.add('bomb');
    }
  }
  setCount(count){
    this.count = count;
    this.getField().classList.add('c' + count);
  }
  setFlag(){
    if (!this.isOpen()) {
      this.flag = !this.flag;
      this.getField().classList.toggle('flag');
    }
  }
  getField() {
    return document.querySelector(`[data-x='${this.coords[0]}'][data-y='${this.coords[1]}']`);
  }
  getFieldByCoords([x,y]) {
    return document.querySelector(`[data-x='${x}'][data-y='${y}']`);
  }
  getMates([offsetX, offsetY]) {
    let
      mates = [],
      top = this.coords[1] - 1,
      bottom = this.coords[1] + 1,
      left = this.coords[0] - 1,
      rigth = this.coords[0] + 1;

    if (top >= 0 && left >= 0) {
      mates.push(this.getFieldByCoords([left, top]).dataset.id);
    }
    if (top >= 0) {
      mates.push(this.getFieldByCoords([this.coords[0], top]).dataset.id);
    }
    if (top >= 0 && rigth < offsetX) {
      mates.push(this.getFieldByCoords([rigth, top]).dataset.id);
    }
    if (rigth < offsetX) {
      mates.push(this.getFieldByCoords([rigth, this.coords[1]]).dataset.id);
    }
    if (bottom < offsetY && rigth < offsetX) {
      mates.push(this.getFieldByCoords([rigth, bottom]).dataset.id);
    }
    if (bottom < offsetY) {
      mates.push(this.getFieldByCoords([this.coords[0], bottom]).dataset.id);
    }
    if (bottom < offsetY && left >= 0) {
      mates.push(this.getFieldByCoords([left, bottom]).dataset.id);
    }
    if (left >= 0) {
      mates.push(this.getFieldByCoords([left, this.coords[1]]).dataset.id);
    }

    return mates;
  }
}