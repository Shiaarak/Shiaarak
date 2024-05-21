import { useContext, useEffect, useState } from 'react'
import { Fieldset, Text, Space, Slider } from '@mantine/core'
import { textProps, translate } from '../../settings'
import { type Res, type LogoCanvas, LogoContext } from '../../logo'

export interface PaddingSelProps {
  /** Used to calculate the padding */
  res: Res

  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: number) => void
}

export default function PaddingSel({ res: { w, h } }: PaddingSelProps) {
  const { canvas } = useContext(LogoContext) || { canvas: { padding: 0, colors: [], ratios: [] } }
  const { padding: p }: LogoCanvas = canvas

  const aspect = Math.min(w, h)
  const maxPadding = aspect * 0.5

  const [padding, setPadding] = useState<number>(maxPadding * p)

  useEffect(() => {
    if (p === padding / maxPadding) return
    setPadding(maxPadding * p)
  }, [w, h, p])

  return (
    <Fieldset legend={translate('sel.padding.legend', [((aspect - padding * 2) / aspect).toFixed(2)])}>
      <Text {...textProps}>
        {translate('sel.padding.pad')} ({padding})
      </Text>
      <Space h="xs" />
      <Slider value={padding} onChange={setPadding} min={0} max={maxPadding} label={null} />
    </Fieldset>
  )
}
