import { SC_CONFIG, SCRATCH_TYPE } from './ScratchCardConfig';
declare class ScratchCard {
    readonly config: SC_CONFIG;
    private defaults;
    percent: number;
    private ctx;
    private container;
    private scratchImage;
    private zone;
    private canvas;
    private position;
    private scratchType;
    private readyToClear;
    private brush;
    private brushImage;
    constructor(selector: string, config: SC_CONFIG);
    /**
     * Get percent of scratchCard
     * @returns {number}
     */
    getPercent(): number;
    /**
     * Distpach event
     * @param {string} phase
     * @param {string} type
     */
    dispatchEvent(phase: string, type: string): void;
    init(): Promise<any>;
    private generateCanvas();
    private setBackground();
    mousePosition(event: any): number[];
    scratch(): void;
    updatePercent(): number;
    redraw(): void;
    /**
     * Just clear the canvas
     */
    clear(): void;
}
export { ScratchCard, SCRATCH_TYPE };
