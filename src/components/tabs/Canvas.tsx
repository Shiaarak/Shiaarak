import type { PreviewReducerAction } from '../Preview'

import { useContext, useEffect, useState } from 'react'
import { Stack, Space } from '@mantine/core'
import ColorSel from '../selectors/Color'
import ResSel from '../selectors/Res'
import { LogoContext, type Color, type Res } from '../../logo'

export interface CanvasTabProps {
  /** Used to update the CanvasTab changes */
  dispatch: React.Dispatch<PreviewReducerAction>
}

export default function CanvasTab({ dispatch }: CanvasTabProps) {
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
    if (colors.length === 0 || colors[0] === color?.substring(0, 5)) return
    setColor((colors[0] + 'ff') as Color)
  }, [colors])
  useEffect(() => {
    if (ratios.length === 0 || (ratios[0].b === res.w && ratios[0].s === res.h)) return
    setRes({
      w: (ratios[0].dir?.p ? ratios[0].s : ratios[0].b) * 500,
      h: (ratios[0].dir?.p ? ratios[0].b : ratios[0].s) * 500
    })
  }, [ratios])

  useEffect(() => {
    dispatch({ type: 'c-res', payload: res })
  }, [res, dispatch])
  useEffect(() => {
    dispatch({ type: 'c-color', payload: color })
  }, [color, dispatch])

  return (
    <Stack justify="flex-start" gap="xs">
      <Space h="xs" />

      <ResSel value={res} choices={ratios || []} onChange={setRes} />

      <ColorSel choices={colors || []} onChange={setColor} />
    </Stack>
  )
}
