import { useEffect, useState } from 'react'
import { ColorPicker, AlphaSlider, Fieldset, Text, Space } from '@mantine/core'
import { textProps, translate } from '../../settings'

export interface ColorSelProps {
  /**
   * The color options to choose from
   * @defaultValue ['#ffffff']
   */
  choices: Color[]

  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: Color | null) => void
}

export type Color =
  | `#${string}`
  | `rgb(${number},${number},${number})`
  | `rgba(${number},${number},${number},${number})`

export default function ColorSel({ choices, onChange }: ColorSelProps) {
  const [opacity, setOpacity] = useState<number>(choices.length > 0 ? 1 : 0)
  const [color, setColor] = useState<Color>(choices[0] || '#ffffff')

  useEffect(() => {
    if (opacity === 0) {
      onChange(null)
      return
    }

    const opacityHex = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')

    onChange((color + opacityHex) as Color)
  }, [color, opacity])

  return (
    <Fieldset
      legend={
        translate('sel.color.legend') +
        (opacity === 0
          ? translate('sel.color.transparent')
          : translate('sel.color.rbga', [
              [1, parseInt(color.slice(1, 3), 16)],
              [2, parseInt(color.slice(3, 5), 16)],
              [3, parseInt(color.slice(5, 7), 16)],
              [4, Math.round(opacity * 100)]
            ]))
      }
    >
      {choices.length > 0 && (
        <>
          <Text {...textProps}>{translate('sel.color.transparency')}</Text>
          <Space h="xs" />
          <AlphaSlider color={color} value={opacity} onChange={setOpacity} />

          {opacity > 0 && (
            <>
              <Space h="sm" />

              <Text {...textProps}>{translate('sel.color.color')}</Text>
              <ColorPicker
                fullWidth
                format="hex"
                value={color}
                withPicker={false}
                onChange={(val) => setColor(val as Color)}
                swatches={choices}
              />
            </>
          )}
        </>
      )}
    </Fieldset>
  )
}
