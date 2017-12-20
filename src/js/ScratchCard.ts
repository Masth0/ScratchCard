import {SC_CONFIG, SCRATCH_TYPE} from './ScratchCardConfig';
import {randomPoint, loadImage, throttle, dispatchCustomEvent} from './utils';
import Brush from './Brush';

class ScratchCard {
  readonly config: SC_CONFIG;
  private defaults: SC_CONFIG;
  public percent: number; 
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;
  private scratchImage: HTMLImageElement;
  private zone: ClientRect;
  private canvas: HTMLCanvasElement;
  private position: number[];
  private scratchType: SCRATCH_TYPE;
  private readyToClear: Boolean;
  private brush: Brush;
  private brushImage: any;
  
  constructor (selector: string, config: SC_CONFIG) {
    const self = this;
    const defaults = {
      scratchType: SCRATCH_TYPE.SPRAY,
      containerWidth: 100,
      containerHeight: 100,
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
    this.percent = 0;

    // Create and add the canvas
    this.generateCanvas();

    this.ctx = this.canvas.getContext('2d');
    this.zone = this.canvas.getBoundingClientRect();

    // Init the brush instance
    this.brush = new Brush(this.ctx, this.position[0], this.position[1]);

    // Init the brush if  necessary
    if (this.config.scratchType === SCRATCH_TYPE.BRUSH) {
      this.brushImage = Brush.generateBrush(this.config.brushSrc);
    }

    /*---- Scratching method , call in throttle event ------------------------------------*/
    let scratching = throttle((event: Event) => {
      self.dispatchEvent('scratch', 'move');
      self.position = self.mousePosition(event);
      self.brush.updateMousePosition(self.position[0], self.position[1]);
      self.scratch();

      // calculate the percent of area scratched.
      self.percent = self.updatePercent();
      
      if (self.percent >= 50) {
        self.clear();
        self.canvas.style.pointerEvents = 'none';
        if (self.config.callback !== undefined) {
          self.config.callback();
        }
      }
    }, 16);

    /*---- Events -----------------------------------------------------------------------*/
    this.canvas.addEventListener('mousedown', function (event) {
      self.canvas.addEventListener('mousemove', scratching);
      document.body.addEventListener('mouseup', function _func () {
        self.canvas.removeEventListener('mousemove', scratching);
        this.removeEventListener('mouseup', _func);
      });
    });

    // Update canvas positions when the window has been resized
    window.addEventListener('resize', throttle(() => {
      this.zone = this.canvas.getBoundingClientRect();
      this.redraw();
    }, 100));
  }

  /**
   * Get percent of scratchCard
   * @returns {number}
   */
  getPercent () {
    return this.percent;
  }

  /**
   * Distpach event
   * @param {string} phase
   * @param {string} type
   */
  dispatchEvent (phase: string, type: string) {
    dispatchCustomEvent(this.canvas, `${phase}.${type}`, {});
  }

  init (): Promise<any> {
    return new Promise((resolve, reject) => {
      loadImage(this.config.imageForwardSrc).then((img: HTMLImageElement) => {
        this.scratchImage = img;
        this.ctx.drawImage(this.scratchImage, 0, 0, this.canvas.width, this.canvas.height);
        this.setBackground();
        // Resolve the promise init
        resolve();
      }, (event) => {
        // Reject init
        reject(event);
        return new TypeError(`${this.config.imageForwardSrc} is not loaded.`);
      });
    });
  }
  
  private generateCanvas (): void {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('sc__canvas');
  
    // Add canvas into container
    this.canvas.width = this.config.containerWidth;
    this.canvas.height = this.config.containerHeight;
    this.container.appendChild(this.canvas);
    console.log(this.config);
  }

  private setBackground (): void {
    let image = document.createElement('img');
    loadImage(this.config.imageBackgroundSrc).then((img: HTMLImageElement) => {    
      image.src = img.src;
      this.container.insertBefore(image, this.canvas);
    }, (error) => {
      // Stop all script here
      console.log(error.message);
    });
  };

  mousePosition (event: any): number[] {
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

    // Choose the good method to 'paint'
    switch (this.config.scratchType) {
      case SCRATCH_TYPE.BRUSH:
        this.brush.brush(this.brushImage);
        break;
      case SCRATCH_TYPE.CIRCLE:
        this.brush.circle(this.config.clearZoneRadius);
        break;
      case SCRATCH_TYPE.SPRAY:
        this.brush.spray(this.config.clearZoneRadius, this.config.pointSize,  this.config.nPoints);
        break;
    }

    this.ctx.restore();
  }

  /*
  * Image data :
  * Red: image.data[0]
  * Green: image.data[1]
  * Blue: image.data[2]
  * Alpha: image.data[3]
  * */
  updatePercent (): number {
    let counter = 0; // number of pixels cleared
    let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let imageDataLength = imageData.data.length;

    // loop data image drop every 4 items [r, g, b, a, ...]
    for(let i = 0; i < imageDataLength; i += 4) {
      // Increment the counter only if the pixel in completely clear
      if (imageData.data[i] === 0 && imageData.data[i+1] === 0 && imageData.data[i+2] === 0 && imageData.data[i+3] === 0) {
        counter++;
      }
    }

    return (counter >= 1) ? (counter / (this.canvas.width * this.canvas.height)) * 100 : 0;
  }

  // TODO: Improve this
  redraw () {
    let oldWidth = this.config.containerWidth;
    let newWidth = this.zone.width;
    if(newWidth < oldWidth) {
      this.ctx.clearRect(0, 0, this.zone.width, this.zone.height);
      this.canvas.width = this.zone.width;
      this.canvas.height = this.zone.height;
      this.ctx.drawImage(this.scratchImage, 0, 0, this.zone.width, this.zone.height);
    }
  }
  
  /**
   * Just clear the canvas
   */
  clear (): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}

// Expose directly in window, any ideas to do this better.
(<any>window).ScratchCard = ScratchCard;
(<any>window).SCRATCH_TYPE = SCRATCH_TYPE;

export default ScratchCard;
