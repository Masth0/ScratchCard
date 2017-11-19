export enum ScratchType {
  Spray = 'SPRAY',
  Brush = 'BRUSH'
}

export interface SC_CONFIG {
  scratchType: ScratchType,
  container: HTMLElement,
  imageForwardSrc: string,
  imageBackgroundSrc: string,
  clearZoneRadius: number,
  nPoints: number,
  pointSize: number[],
  callback ?: () => void,
  brushSrc: string,
  cursor: {
    cur: string,
    png: string,
    poosition: number[]
  }
}