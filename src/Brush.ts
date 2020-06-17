export default class Brush {
  readonly ctx: CanvasRenderingContext2D;
  public mouseX: number;
  public mouseY: number;

  constructor (ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
    this.ctx = ctx;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  updateMousePosition (x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  circle (r: number) {
    this.ctx.beginPath();
    this.ctx.arc(this.mouseX + r, this.mouseY + r, r, 0, Math.PI * 2, false);
    this.ctx.fillStyle = '#000000';
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * For spray get point position in the area to clear the canvas
   * @param {number} r
   * @returns {number[]}
   */
  clearPoint (r: number): number[] {
    let radius: number = r;
    let x: number = Math.random() * 2 * radius - radius;
    let ylim: number = Math.sqrt(radius * radius - x * x);
    let y: number = Math.random() * 2 * ylim - ylim;
    x += radius;
    y += radius;

    x += this.mouseX;
    y += this.mouseY;

    return [x, y];
  }

  /**
   * Create a set of points allocated in area,
   * @param {number} area
   * @param {number} dropsSize
   * @param {number} dropsCount
   */
  spray (area: number, dropsSize: number, dropsCount: number) {
    let i = 0;

    for (i; i < dropsCount; i++) {
      let points = this.clearPoint(area / 2);
      this.ctx.beginPath();
      this.ctx.arc(points[0] + (area / 2), points[1] + (area / 2), dropsSize / 2, 0, Math.PI * 2, false);
      this.ctx.fillStyle = '#000000';
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  /**
   * Draw the brush image on canvas
   * @param {HTMLImageElement} img
   */
  brush (img: HTMLImageElement) {
    if (img === null) {
      let error = new Error( 'argument img is not a node IMG');
      console.log(error.message);
      return;
    }
    let angle = Math.atan2(this.mouseY, this.mouseX);
    this.ctx.save();
    this.ctx.translate(this.mouseX, this.mouseY);
    this.ctx.rotate(angle);
    this.ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
  }

  startLine (r: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = r;
    this.ctx.lineJoin = this.ctx.lineCap = 'round';
    this.ctx.moveTo(this.mouseX + r , this.mouseY + r);
  }

  drawLine (r: number) {
    this.ctx.filter = 'blur(1px)';
    this.ctx.lineTo(this.mouseX + r , this.mouseY + r);
    this.ctx.stroke();
  }

}
