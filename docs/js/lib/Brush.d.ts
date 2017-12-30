export default class Brush {
    readonly ctx: CanvasRenderingContext2D;
    mouseX: number;
    mouseY: number;
    constructor(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number);
    updateMousePosition(x: number, y: number): void;
    circle(r: number): void;
    /**
     * For spray get point position in the area to clear the canvas
     * @param {number} r
     * @returns {number[]}
     */
    clearPoint(r: number): number[];
    /**
     * Create a set of points allocated in area,
     * @param {number} area
     * @param {number} dropsSize
     * @param {number} dropsCount
     */
    spray(area: number, dropsSize: number, dropsCount: number): void;
    /**
     * Create brush image
     * @param {string} imgSrc
     * @returns {HTMLImageElement}
     */
    static generateBrush(imgSrc: string): HTMLImageElement;
    /**
     * Draw the brush image on canvas
     * @param {HTMLImageElement} img
     */
    brush(img: HTMLImageElement): void;
}
