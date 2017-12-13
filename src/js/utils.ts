/**
 * Return a random number in range
 * @param min {Number}
 * @param max {Number}
 */
export function randomPoint (min: number, max: number) {
  let random = Math.abs(Math.random() * (max - min) + min);
  return parseInt(random.toFixed(0), 10);
}

export function dispatchCustomEvent (target: HTMLElement, type: string, detail: any) {
  let customEvent = new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail: detail
  });
  target.dispatchEvent(customEvent);
}

/**
 * 
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
      reject(event.type);
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