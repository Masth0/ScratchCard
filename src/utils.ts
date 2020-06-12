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
    image.crossOrigin = 'Anonymous'; // Work only if the server response headers contains [Access-Control-Allow-Origin: *]
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
          timer = window.setTimeout(function () {
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

/**
 * Inject html behind the canvas
 * @param {string} html 
 * @param {HTMLElement} target 
 */
export function injectHTML (html: string, target: HTMLElement) {
  let parser = new DOMParser();
  let wrapper = document.createElement('div');
  wrapper.classList.add('sc__inner'); 
  let content = parser.parseFromString(html, 'text/html'); // > IE 11
  wrapper.innerHTML = content.body.innerHTML;
  target.insertBefore(wrapper, target.firstElementChild);
}

/**
 * Get the real offset
 * @param element
 * @returns {Object} offset
 */
export function getOffset (element: HTMLElement) {
  let offset = {
    left: 0,
    top: 0
  };
  let clientRect = element.getBoundingClientRect();

  while (element) {
    offset.top += element.offsetTop;
    offset.left += element.offsetLeft;
    element = <HTMLElement>element.offsetParent;
  }

  // Calculate the delta between offset values and clientRect values
  let deltaLeft = offset.left - clientRect.left;
  let deltaTop = offset.top - clientRect.top;

  return {
    left: (deltaLeft < 0) ? offset.left + Math.abs(deltaLeft) : offset.left - Math.abs(deltaLeft),
    top: (deltaTop < 0) ? offset.top + Math.abs(deltaTop) : offset.top - Math.abs(deltaTop)
  };
}
