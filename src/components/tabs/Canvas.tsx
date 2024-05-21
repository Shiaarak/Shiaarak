import type { PreviewReducerAction } from '../Preview'

import { useContext } from 'react'
import { Stack, Space } from '@mantine/core'
import { LogoContext, type Res } from '../../logo'
import PaddingSel from '../selectors/Padding'
import ColorSel from '../selectors/Color'
import ResSel from '../selectors/Res'

export interface CanvasTabProps {
  /** Used to calculate the padding */
  res: Res

  /** Used to update the CanvasTab changes */
  dispatch: React.Dispatch<PreviewReducerAction>
}

export default function CanvasTab({ res, dispatch }: CanvasTabProps) {
  const {
    canvas: { colors, ratios }
  } = useContext(LogoContext) || { canvas: { colors: [], ratios: [] } }

  return (
    <Stack justify="flex-start" gap="xs">
      <Space h="xs" />

      <ResSel choices={ratios || []} onChange={(val) => dispatch({ type: 'c-res', payload: val })} />

      <ColorSel choices={colors || []} onChange={(val) => dispatch({ type: 'c-color', payload: val })} />

      <PaddingSel res={res} onChange={(val) => dispatch({ type: 'c-padding', payload: val })} />
    </Stack>
  )
}
