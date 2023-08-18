import { SC_CONFIG, SCRATCH_TYPE } from './ScratchCardConfig';
declare class ScratchCard {
    get canvas(): HTMLCanvasElement;
    readonly config: SC_CONFIG;
    readonly scratchType: SCRATCH_TYPE;
    readonly ctx: CanvasRenderingContext2D;
    readonly container: HTMLElement;
    private position;
    private _canvas;
    private readyToClear;
    private brush;
    private callbackDone;
    private defaults;
    private scratchImage;
    brushImage: any;
    zone: {
        top: number;
        left: number;
    };
    percent: number;
    constructor(selector: string | HTMLElement, config: SC_CONFIG);
    /**
     * Check if selector is a string
     * @param selector
     * @returns {boolean}
     */
    isString(selector: string | HTMLElement): boolean;
    /**
     * Get percent of scratchCard
     * @returns {number}
     */
    getPercent(): number;
    /**
     * Return the top and left position
     * @private
     */
    private _setScratchPosition;
    finish(): void;
    /**
     * Distpach event
     * @param {string} phase
     * @param {string} type
     */
    dispatchEvent(phase: string, type: string): void;
    init(): Promise<any>;
    private generateCanvas;
    private setBackground;
    mousePosition(event: any): number[];
    scratch(): void;
    updatePercent(): number;
    /**
     * Just clear the canvas
     */
    clear(): void;
}
export { ScratchCard, SCRATCH_TYPE };
