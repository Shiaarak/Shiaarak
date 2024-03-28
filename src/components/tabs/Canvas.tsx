import { useEffect, useState } from 'react'
import { Stack, Space } from '@mantine/core'
import ColorSel, { ColorValue, ColorSelVarProps } from '../selectors/Color'
import SizeSel, { SizeSelVarProps, SizeValue } from '../selectors/Size'

const squareSize = 10

export interface CanvasTabProps extends SizeSelVarProps, ColorSelVarProps {
  /**
   * Reference to the canvas used to draw the background
   */
  elRef: React.MutableRefObject<HTMLCanvasElement | null>

  onSizeChange: (size: SizeValue) => void
}

export default function CanvasTab({ elRef: ref, colors, onSizeChange }: CanvasTabProps) {
  const [color, setColor] = useState<ColorValue>('#ffffffff')
  const [size, setSize] = useState<SizeValue>({ w: 1000, h: 1000 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (color) {
      canvas.width = size.w
      canvas.height = size.h

      ctx.fillStyle = color
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

      canvas.width = size.w
      canvas.height = size.h

      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    onSizeChange(size)
  }, [color, size, ref])

  return (
    <Stack justify="flex-start" gap="xs">
      <Space h="xs" />

      <SizeSel size={size} onChange={setSize} />

      <ColorSel colors={colors} onChange={setColor} />
    </Stack>
  )
}
