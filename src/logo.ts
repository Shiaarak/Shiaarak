import { createContext } from 'react'

export type Logo = {
  /** */
  canvas: LogoCanvas

  /** */
  icon: LogoIcon
}
export type LogoCanvas = {
  /** */
  colors: Color[]

  /** */
  ratios: AspectRatio[]
}
export type LogoIcon = {
  /**
   * Padding around the icon in percentage
   *
   * Range: [0, 1]
   *
   * @defaultValue 0.1
   */
  padding: number

  /** */
  layers: LogoIconLayer[]
}
export type LogoIconLayer = {
  /** */
  colors: Color[]

  /** */
  img: HTMLImageElement | string
}

export type Res = { w: number; h: number }
export type AspectRatioDir = 'l' | 'p'
export type AspectRatio = {
  /** Bigger side of aspect ratio */
  b: number

  /** smaller side of aspect ratio */
  s: number

  /**
   * Direction of aspect ratio
   *
   * Undefined only when the aspect ratio is square
   */
  dir?: {
    [K in AspectRatioDir]?: boolean
  }
}

export type Color =
  | `#${string}`
  | `rgb(${number},${number},${number})`
  | `rgba(${number},${number},${number},${number})`

export const LogoContext = createContext<Logo | null>(null)
