export default class Image {

  set src(value) {
    this._src = value;

    clearTimeout(this.loadTimer);

    this.loadTimer = setTimeout(() => {
      (this._src === '/load-success.png')
          ? this.onload && this.onload()
          : this.onerror && this.onerror();
    }, 20)
  }

  get src() {
    return this._src;
  }

}
