import {SC_CONFIG, ScratchType} from './ScratchCardConfig';
import {randomPoint, loadImage, throttle, dispatchCustomEvent} from './utils';
import Brush from './Brush';

/**
 * @enum ScratchCardEvent
 */
enum ScratchEvent {
  ScratchStart,
  Scratch,
  ScratchEnd
}

export default class ScratchCard {
  readonly config: SC_CONFIG;
  private defaults: SC_CONFIG;
  public percent: number; 
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;
  private bgImage: HTMLImageElement;
  private zone: ClientRect;
  private canvas: HTMLCanvasElement;
  private position: number[];
  public scratchType: ScratchType;
  public readyToClear: Boolean;
  public brush: Brush;
  private brushImage: HTMLImageElement;
  
  constructor (selector: string, config: SC_CONFIG) {
    const self = this;
    const defaults = {
      scratchType: 'SPRAY',
      container: HTMLElement,
      nPoints: 100,
      pointSize: [10, 10],
        callback: function() {
          alert('done.')
      },
      brushSrc: '',
      imageForwardSrc: './images/scratchcard.png',
      imageBackgroundSrc: './images/scratchcard-background.svg',
      clearZoneRadius: 0,
    };
    this.config = Object.assign(defaults, config);
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
      self.brush.updateMousePosition(self.position[0], self.position[1]);
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
    this.brush = new Brush(this.ctx, this.position[0], this.position[1]);

    // TODO: Here choose the type of brush ['BRUSH', 'SPRAY', 'CIRCLE'].

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

  mousePosition(event: any): number[] {
    let posX: number;
    let posY: number;

    switch (event.type) {
      case 'touchmove':
        posX = event.touches[0].clientX - (this.config.clearZoneRadius / 2) - window.pageXOffset - this.zone.left;
        posY = event.touches[0].clientY - (this.config.clearZoneRadius / 2) - window.pageYOffset - this.zone.top;
        break;
      case 'mousemove':
        posX = event.clientX - this.config.clearZoneRadius - window.pageXOffset - this.zone.left;
        posY = event.clientY - this.config.clearZoneRadius - window.pageYOffset - this.zone.top;
        break;
    }

    return [posX, posY];
  }

  scratch (): void {
    let x = this.position[0];
    let y = this.position[1];
    let i = 0;

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.save();
    // TODO: Here call Brush method from brush type
    this.ctx.restore();
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