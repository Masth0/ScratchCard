/**
 * Return a random number in range
 * @param min {Number}
 * @param max {Number}
 */
export function randomPoint (min: number, max: number) {
  let random = Math.abs(Math.random() * (max - min) + min);
  return parseInt(random.toFixed(0), 10);
}

/**
 * Make a promise to load image
 * @param src {String}
 */
export function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = src;
    image.onerror = (event: Event) => {
      const error = new Error(`Image ${src} is not loaded.`);
      reject(error);
    }
  });
}

export function throttle (callback: Function, delay: number) {
  let last: number;
  let timer: number;
  return function () {
      let context = this;
      let now: number = +new Date();
      let args = arguments;
      if (last && now < last + delay) {
          // le délai n'est pas écoulé on reset le timer
          clearTimeout(timer);
          timer = setTimeout(function () {
              last = now;
              callback.apply(context, args);
          }, delay);
      } else {
          last = now;
          callback.apply(context, args);
      }
  };
}

/*---- Events -----------------------------------------------------------------------*/
// polyfill source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {

  if ( typeof (<any>window).CustomEvent === "function" ) return false;

  function CustomEvent (event: any, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }

  CustomEvent.prototype = (<any>window).Event.prototype;

  (<any>window).CustomEvent = CustomEvent;
})();

/**
 *
 * @param {HTMLElement} target
 * @param {string} type
 * @param detail
 */
export function dispatchCustomEvent (target: HTMLCanvasElement, type: string, detail: any) {
  let customEvent = new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail: detail
  });
  target.dispatchEvent(customEvent);
}