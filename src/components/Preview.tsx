import type { Color, Res } from '../logo'

import { useEffect, useRef } from 'react'
import { Center, Container } from '@mantine/core'

const squareSize = 10

export type PreviewReducerAction = PreviewReducerCanvasAction | PreviewReducerIconAction
export type PreviewReducerCanvasAction =
  | {
      type: 'c-res'
      payload: Res
    }
  | {
      type: 'c-color'
      payload: Color | null
    }
export type PreviewReducerIconAction =
  | {
      type: 'i-padding'
      payload: number
    }
  | PreviewReducerLayerAction
export type PreviewReducerLayerAction =
  | {
      type: 'l-img'
      payload: {
        i: number
        img: HTMLImageElement
      }
    }
  | {
      type: 'l-color'
      payload: {
        i: number
        color: Color
      }
    }

export function reducer(preview: Preview, { type, payload }: PreviewReducerAction): Preview {
  switch (type) {
    case 'c-res': {
      return { ...preview, canvas: { ...preview.canvas, res: payload } }
    }
    case 'c-color': {
      return { ...preview, canvas: { ...preview.canvas, color: payload } }
    }
    case 'i-padding': {
      return { ...preview, icon: { ...preview.icon, padding: payload } }
    }
    case 'l-img': {
      const { i, img } = payload
      const len = preview.icon.layers.length

      if (i < len) preview.icon.layers[i].img = img
      else if (i === len) preview.icon.layers.push({ img })
      else throw new Error(`Invalid layer index: ${i}`)

      return { ...preview, icon: { ...preview.icon, layers: [...preview.icon.layers] } }
    }
    case 'l-color': {
      const { i, color } = payload
      const len = preview.icon.layers.length

      if (i < len) preview.icon.layers[i].color = color
      else throw new Error(`Invalid layer index: ${i}`)

      return { ...preview, icon: { ...preview.icon, layers: [...preview.icon.layers] } }
    }
  }

  // @ts-ignore
  throw new Error(`Unknown action: ${action.type}`)
}

export interface PreviewProps {
  preview: Preview
}

export default function Preview({ preview: { canvas, icon } }: PreviewProps) {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const iconLayersHolderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    drawCanvas({ ...canvas, ref: bgRef })
  }, [canvas])

  useEffect(() => {
    drawIcon({
      ...canvas,
      ...icon,
      ref: iconLayersHolderRef
    })
  }, [icon])

  return (
    <Container fluid bg="#242424">
      <Center id="logo-holder" style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <canvas ref={bgRef} />
        {(icon.layers.length || 0) > 0 && (
          <Center id="icon-holder" ref={iconLayersHolderRef} style={{ position: 'absolute' }}>
            {icon.layers.map((_, i) => (
              <canvas key={i} style={{ position: 'absolute' }} />
            ))}
          </Center>
        )}
      </Center>
    </Container>
  )
}

export interface Preview {
  canvas: CanvasPreview
  icon: IconPreview
}
export interface CanvasPreview {
  res: Res
  color?: Color | null
}
export interface IconPreview {
  padding: number
  layers: IconLayerPreview[]
}
export interface IconLayerPreview {
  img: HTMLImageElement | string
  color?: Color
}

function drawCanvas({
  ref: { current: canvas },
  res: { w, h },
  color
}: CanvasPreview & { ref: React.RefObject<HTMLCanvasElement> }) {
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  console.log('📢 | file: Preview.tsx:138 | color:', color)
  if (color) {
    canvas.width = w
    canvas.height = h

    ctx.fillStyle = color as Color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else {
    canvas.width = squareSize * 2
    canvas.height = squareSize * 2

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, squareSize, squareSize)
    ctx.fillRect(squareSize, squareSize, squareSize, squareSize)
    ctx.fillStyle = '#c0c0C0'
    ctx.fillRect(squareSize, 0, squareSize, squareSize)
    ctx.fillRect(0, squareSize, squareSize, squareSize)

    const pattern = ctx.createPattern(canvas, 'repeat')
    if (!pattern) return

    canvas.width = w
    canvas.height = h

    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

function drawIcon({
  ref: { current: holder },
  res,
  padding,
  layers
}: IconPreview & { ref: React.RefObject<HTMLDivElement>; res: Res }) {
  for (let i = 0; i < layers.length; i++) {
    const el = holder?.children[i] as HTMLCanvasElement
    if (!el) continue
    drawLayer({ el, res, padding, ...layers[i] })
  }
}
function drawLayer({
  el: canvas,
  res: { w, h },
  padding,
  img,
  color
}: IconLayerPreview & {
  el: HTMLCanvasElement
  res: Res
  padding: number
}) {
  if (!canvas || !img || typeof img === 'string' || !img.src) return

  const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true })
  if (!ctx) return

  if (typeof color !== 'string') {
    return
  }

  canvas.width = w
  canvas.height = h

  const iw = img.width
  const ih = img.height

  const wRatio = (w - 2 * padding) / iw
  const hRatio = (h - 2 * padding) / ih
  const ratio = Math.min(wRatio, hRatio)

  const xCenterShift = (w - iw * ratio) * 0.5
  const yCenterShift = (h - ih * ratio) * 0.5

  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, iw, ih, xCenterShift, yCenterShift, iw * ratio, ih * ratio)

  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data

  // Loop through each pixel to change non-transparent pixels to the new color
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      continue
    }

    data[i] = parseInt(color.slice(1, 3), 16)
    data[i + 1] = parseInt(color.slice(3, 5), 16)
    data[i + 2] = parseInt(color.slice(5, 7), 16)
    data[i + 3] = parseInt(color.slice(7, 9), 16)
  }

  ctx.putImageData(imageData, 0, 0)
}
