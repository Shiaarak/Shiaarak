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

export function reducer(preview: PreviewWithAction, action: PreviewReducerAction): PreviewWithAction {
  const { type, payload } = action
  switch (type) {
    case 'c-res': {
      return { ...preview, canvas: { ...preview.canvas, res: payload }, ...action }
    }
    case 'c-color': {
      return { ...preview, canvas: { ...preview.canvas, color: payload }, ...action }
    }
    case 'i-padding': {
      return { ...preview, icon: { ...preview.icon, padding: payload }, ...action }
    }
    case 'l-img': {
      const { i, img } = payload
      const len = preview.icon.layers.length

      if (i < len) preview.icon.layers[i].img = img
      else if (i === len) preview.icon.layers.push({ img })
      else throw new Error(`Invalid layer index: ${i}`)

      return { ...preview, icon: { ...preview.icon, layers: [...preview.icon.layers] }, ...action }
    }
    case 'l-color': {
      const { i, color } = payload
      const len = preview.icon.layers.length

      if (i < len) preview.icon.layers[i].color = color
      else throw new Error(`Invalid layer index: ${i}`)

      return { ...preview, icon: { ...preview.icon, layers: [...preview.icon.layers] }, ...action }
    }
  }

  // @ts-ignore
  throw new Error(`Unknown action: ${action.type}`)
}

export interface PreviewProps {
  preview: PreviewWithAction
}

export default function Preview({ preview: { canvas, icon, type: actionType, payload: actionPayload } }: PreviewProps) {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const iconLayersHolderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bgRef.current) return
    drawCanvas({ ...canvas, el: bgRef.current })

    if (actionType === 'c-res') callDrawIcon()
  }, [canvas])

  useEffect(() => {
    if (actionType === 'i-padding') callDrawIcon()
    else if (actionType === 'l-img' || actionType === 'l-color')
      drawLayer({
        el: iconLayersHolderRef.current?.children[actionPayload.i] as HTMLCanvasElement,
        res: canvas.res,
        padding: icon.padding,
        ...icon.layers[actionPayload.i]
      })
  }, [icon])

  function callDrawIcon() {
    if (!iconLayersHolderRef.current) return
    drawIcon({
      ...canvas,
      ...icon,
      holder: iconLayersHolderRef.current
    })
  }

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

export type PreviewWithAction = Preview & PreviewReducerAction
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

function drawCanvas({ el: canvas, res: { w, h }, color }: CanvasPreview & { el: HTMLCanvasElement }) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

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

function drawIcon({ holder, res, padding, layers }: IconPreview & { holder: HTMLDivElement; res: Res }) {
  for (let i = 0; i < layers.length; i++) {
    const el = holder.children[i] as HTMLCanvasElement
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
  if (!img || typeof img === 'string') return

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
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
  const data = new Uint32Array(imageData.data.buffer)

  const red = parseInt(color.slice(1, 3), 16)
  const green = parseInt(color.slice(3, 5), 16)
  const blue = parseInt(color.slice(5, 7), 16)
  const alpha = parseInt(color.slice(7, 9), 16)

  // Loop through each pixel to change non-transparent pixels to the new color
  for (let i = 0; i < data.length; i++) {
    if ((data[i] & 0xff000000) === 0) {
      continue
    }

    data[i] = (alpha << 24) | (blue << 16) | (green << 8) | red
  }

  ctx.putImageData(imageData, 0, 0)
}
