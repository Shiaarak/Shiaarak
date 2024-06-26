import { useEffect, useState } from 'react'
import { ColorPicker, AlphaSlider, Fieldset, Text, Space } from '@mantine/core'
import { textProps, translate } from '../../settings'
import { type Color } from '../../logo'

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

export default function ColorSel({ choices, onChange }: ColorSelProps) {
  const [opacity, setOpacity] = useState<number>(choices.length > 0 ? 1 : 0)
  const [color, setColor] = useState<Color>(choices[0] || '#ffffff')

  useEffect(() => {
    if (choices.length === 0) setOpacity(0)
    else {
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].length > 7) choices[i] = choices[i].substring(0, 7) as Color
      }
      setColor(choices[0])
    }
  }, [choices])

  useEffect(() => {
    if (opacity === 0) {
      onChange(null)
      return
    }

    const opacityHex = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')

    onChange((color + opacityHex) as Color)
  }, [color, opacity, onChange])

  return (
    <Fieldset
      legend={
        translate('sel.color.legend') +
        (opacity === 0
          ? translate('sel.color.transparent')
          : translate('sel.color.rbga', [
              parseInt(color.slice(1, 3), 16),
              parseInt(color.slice(3, 5), 16),
              parseInt(color.slice(5, 7), 16),
              Math.round(opacity * 100)
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
