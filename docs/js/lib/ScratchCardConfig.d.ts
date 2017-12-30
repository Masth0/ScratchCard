export declare enum SCRATCH_TYPE {
    BRUSH = 0,
    SPRAY = 1,
    CIRCLE = 2,
}
export interface SC_CONFIG {
    scratchType: SCRATCH_TYPE;
    containerWidth: number;
    containerHeight: number;
    imageForwardSrc: string;
    imageBackgroundSrc: string;
    clearZoneRadius: number;
    nPoints: number;
    pointSize: number;
    callback?: () => void;
    brushSrc: string;
    cursor: {
        cur: string;
        png: string;
        poosition: number[];
    };
}
