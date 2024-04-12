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
  /** */
  layers: LogoIconLayer[]

  /**
   * Padding around the icon in percentage
   *
   * Range: [0, 1]
   *
   * @defaultValue 0.1
   */
  padding: number
}
export type LogoIconLayer = {
  /** */
  colors: Color[]

  /**
   * Image type/format
   *
   * Used to determine the file extension
   */
  type: 'png' | 'jpg' | 'jpeg' | 'svg'

  /**
   * Path to the image file without the extension
   */
  path: string
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
