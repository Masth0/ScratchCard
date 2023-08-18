export declare enum SCRATCH_TYPE {
    BRUSH = 0,
    SPRAY = 1,
    CIRCLE = 2,
    LINE = 3
}
export interface SC_CONFIG {
    scratchType: SCRATCH_TYPE;
    containerWidth: number;
    containerHeight: number;
    imageForwardSrc: string;
    imageBackgroundSrc: string;
    htmlBackground: string;
    clearZoneRadius: number;
    nPoints: number;
    pointSize: number;
    percentToFinish: number;
    callback?: () => void;
    brushSrc: string;
    enabledPercentUpdate: boolean;
}
