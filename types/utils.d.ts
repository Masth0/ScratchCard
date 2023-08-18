/**
 * Return a random number in range
 * @param min {Number}
 * @param max {Number}
 */
export declare function randomPoint(min: number, max: number): number;
/**
 * Make a promise to load image
 * @param src {String}
 */
export declare function loadImage(src: string): Promise<unknown>;
export declare function throttle(callback: Function, delay: number): () => void;
/**
 *
 * @param {HTMLElement} target
 * @param {string} type
 * @param detail
 */
export declare function dispatchCustomEvent(target: HTMLCanvasElement, type: string, detail: any): void;
/**
 * Inject html behind the canvas
 * @param {string} html
 * @param {HTMLElement} target
 */
export declare function injectHTML(html: string, target: HTMLElement): void;
/**
 * Get the real offset
 * @param element
 * @returns {Object} offset
 */
export declare function getOffset(element: HTMLElement): {
    left: number;
    top: number;
};
