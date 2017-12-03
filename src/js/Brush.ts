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

  spray (area: number, dropsSize: number, dropsCount: number) {
    let i = 0;
    let dropsLength = dropsCount;

    for (i; i < dropsLength; i++) {
      let points = this.clearPoint(area / 2);
      this.ctx.clearRect(points[0], points[1], dropsSize, dropsSize);
    }
  }

  static generateBrush (imgSrc: string): HTMLImageElement {
    if (imgSrc.length !== 0) {
      let brush = new Image();
      brush.src = './images/brush.png';
      return brush;
    } else {
      return null;
    }
  }

  brush (img: HTMLImageElement) {
    let angle = Math.atan2(this.mouseY, this.mouseX);
    this.ctx.save();
    this.ctx.translate(this.mouseX, this.mouseY);
    this.ctx.rotate(angle);
    this.ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
  }


}