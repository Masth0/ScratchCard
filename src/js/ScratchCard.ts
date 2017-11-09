import {SC_CONFIG, ScratchType} from './ScratchCardConfig';
import {randomPoint, loadImage, throttle, dispatchCustomEvent} from './utils';

enum ScratchEvent {
  ScratchStart,
  Scratch,
  ScratchEnd
}

export default class ScratchCard {
  readonly config: SC_CONFIG;
  public percent: number; 
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;
  private bgImage: HTMLImageElement;
  private zone: ClientRect;
  private canvas: HTMLCanvasElement;
  private position: number[];
  public scratchType: ScratchType;
  public readyToClear: Boolean;
  
  constructor (selector: string, config: SC_CONFIG) {
    const self = this;
    this.config = Object.assign({}, config);
    this.scratchType = this.config.scratchType;
    this.container = <HTMLElement> document.querySelector(selector);
    this.position = [0, 0]; // init position
    this.readyToClear = false;
    // Add canvas in container
    this.init();
    
    // debug
    const cursorDebug = document.getElementById('js-debug-cursor');

    let scratching = throttle((event: Event) => {
      self.position = self.mousePosition(event);
      self.scratch();
      // calculate the percent of area scratched.
      self.percent = self.getPercent();
      
      if (self.percent >= 50) {
        self.clear();
        self.canvas.style.pointerEvents = 'none';
        if (self.config.callback !== undefined) {
          self.config.callback();
        }
      }
    }, 16);

    this.canvas.addEventListener('mousedown', function (event) {
      self.canvas.addEventListener('mousemove', scratching);

     document.body.addEventListener('mouseup', function _func () {
       self.canvas.removeEventListener('mousemove', scratching);
       this.removeEventListener('mouseup', _func);
     });
   });

  }

  init (): void {
    this.generateCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.zone = this.canvas.getBoundingClientRect();
    console.log(this.zone);

    loadImage(this.config.imageForwardSrc).then((img: HTMLImageElement) => {
      this.ctx.drawImage(img, 0, 0);
      this.setBackground();
    }, (event) => {
      // Stop all script here
      console.log(event);
    });
  }
  
  private generateCanvas (): void {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('sc__canvas');
    // Add canvas into container
    this.container.appendChild(this.canvas);
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  private setBackground (): void {
    let image = document.createElement('img');
    loadImage(this.config.imageBackgroundSrc).then((img: HTMLImageElement) => {    
      image.src = img.src;
      this.container.insertBefore(image, this.canvas);
    }, (event) => {
      // Stop all script here
      console.log(event);
    });
  };

  mousePosition (event: any): number[] {
		let posX: number, posY: number;
		switch (event.type) {
			case 'touchmove':
				posX = event.touches[0].clientX - (this.config.clearZoneRadius / 2) - window.pageXOffset - this.zone.left;
				posY = event.touches[0].clientY - (this.config.clearZoneRadius / 2) - window.pageYOffset - this.zone.top;
      case 'mousemove':
				posX = event.clientX - this.config.clearZoneRadius - window.pageXOffset - this.zone.left;
				posY = event.clientY - this.config.clearZoneRadius - window.pageYOffset - this.zone.top;
				break;
		}

		return [posX, posY];
  }

  clearPoint (posX: number, posY: number): number[] {
    let radius: number = this.config.clearZoneRadius;
    let x: number = Math.random() * 2 * radius - radius;
    let ylim: number = Math.sqrt(radius * radius - x * x);
    let y: number = Math.random() * 2 * ylim - ylim;
    x += radius;
    y += radius;
 
    x += posX;
    y += posY;
 
    return [x, y];
  }

  scratch (): void {
    let x = this.position[0];
    let y = this.position[1];
    let i = 0;
    let len = this.config.nPoints;

    for (i; i < len; i++) {
      let points = this.clearPoint(x, y);
      this.ctx.clearRect(points[0], points[1], this.config.pointSize[0], this.config.pointSize[1]);
    }
  }

  brush (): void {

  }

  getPercent (): number {
    let percent;
    let counter = 0; // number of pixels clear
    let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let imageDataLength = imageData.data.length;

    for(let i = 0; i < imageDataLength; i += 4) {
      if (imageData.data[i] === 0 && imageData.data[i+1] === 0 && imageData.data[i+2] === 0 && imageData.data[i+3] === 0) {
        counter++;
      }
    }

    if (counter >= 1) {
      percent = (counter / (this.canvas.width * this.canvas.height)) * 100;
    } else {
      percent = 0;
    }
    return percent;
  }
  
  /**
   * Just clear the canvas
   */
  clear (): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}