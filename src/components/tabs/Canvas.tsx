import { useContext, useEffect, useState } from 'react'
import { Stack, Space } from '@mantine/core'
import ColorSel from '../selectors/Color'
import ResSel from '../selectors/Res'
import { LogoContext, type Color, type Res } from '../../logo'

const squareSize = 10

export interface CanvasTabProps {
  /**
   * Reference to the canvas used to draw the background
   */
  elRef: React.RefObject<HTMLCanvasElement | null>

  /**
   * To be called when the resolution changes
   */
  onResChange: (value: Res) => void
}

export default function CanvasTab({ elRef: ref, onResChange }: CanvasTabProps) {
  const {
    canvas: { colors, ratios }
  } = useContext(LogoContext) || { canvas: { colors: [], ratios: [] } }

  const [color, setColor] = useState<Color | null>(colors.length > 0 ? ((colors[0] + 'ff') as Color) : null)
  const [res, setRes] = useState<Res>(
    ratios.length > 0
      ? {
          w: (ratios[0]?.dir?.p ? ratios[0].s : ratios[0].b) * 500,
          h: (ratios[0]?.dir?.p ? ratios[0].b : ratios[0].s) * 500
        }
      : { w: 500, h: 500 }
  )

  useEffect(() => {
    if (colors.length > 0 && colors[0] !== color?.substring(0, 5)) {
      setColor((colors[0] + 'ff') as Color)
    }

    if (ratios.length > 0 && (ratios[0].b !== res.w || ratios[0].s !== res.h)) {
      setRes({
        w: (ratios[0].dir?.p ? ratios[0].s : ratios[0].b) * 500,
        h: (ratios[0].dir?.p ? ratios[0].b : ratios[0].s) * 500
      })
    }
  }, [colors, ratios])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (color) {
      canvas.width = res.w
      canvas.height = res.h

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

      canvas.width = res.w
      canvas.height = res.h

      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    onResChange(res)
  }, [ref, color, res])

  useEffect(() => {
    onResChange(res)
  }, [onResChange])

  return (
    <Stack justify="flex-start" gap="xs">
      <Space h="xs" />

      <ResSel value={res} choices={ratios || []} onChange={setRes} />

      <ColorSel choices={colors || []} onChange={setColor} />
    </Stack>
  )
}
