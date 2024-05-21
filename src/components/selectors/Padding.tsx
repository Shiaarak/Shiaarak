import { useContext, useEffect, useState } from 'react'
import { Fieldset, Text, Space, Slider } from '@mantine/core'
import { textProps, translate } from '../../settings'
import { type Res, type LogoIcon, LogoContext } from '../../logo'

export interface PaddingSelProps {
  /** Used to calculate the padding */
  res: Res

  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: number) => void
}

export default function ColorSel({ res: { w, h } }: PaddingSelProps) {
  const { icon } = useContext(LogoContext) || { icon: { padding: 0.1, layers: [] } }
  const { padding: p, layers }: LogoIcon = icon

  const aspect = Math.min(w, h)
  const maxPadding = aspect * 0.5

  const [padding, setPadding] = useState<number>(maxPadding * p)

  useEffect(() => {
    if (p === padding / maxPadding) return
    setPadding(maxPadding * p)
  }, [w, h, p])

  return (
    <Fieldset legend={translate('sel.padding.legend', [((aspect - padding * 2) / aspect).toFixed(2)])}>
      {layers.length > 0 && (
        <>
          <Text {...textProps}>
            {translate('sel.padding.pad')} ({padding})
          </Text>
          <Space h="xs" />
          <Slider value={padding} onChange={setPadding} min={0} max={maxPadding} label={null} />
        </>
      )}
    </Fieldset>
  )
}
