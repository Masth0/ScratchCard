export enum SCRATCH_TYPE {
  BRUSH,
  SPRAY,
  CIRCLE
}

export interface SC_CONFIG {
  scratchType: SCRATCH_TYPE,
  container: HTMLElement,
  imageForwardSrc: string,
  imageBackgroundSrc: string,
  clearZoneRadius: number,
  nPoints: number,
  pointSize: number,
  callback ?: () => void,
  brushSrc: string,
  cursor: {
    cur: string,
    png: string,
    poosition: number[]
  }
}