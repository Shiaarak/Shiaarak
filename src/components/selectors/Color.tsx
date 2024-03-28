import { useEffect, useState } from 'react'
import { ColorPicker, AlphaSlider, Text, Space, Fieldset } from '@mantine/core'
import { textProps, translate } from '../../settings'

export interface ColorSelProps extends ColorSelVarProps, ColorSelCallbackProps {}

export interface ColorSelVarProps {
  /**
   * The color options to choose from
   * @defaultValue ['#ffffff']
   */
  colors: string[]
}

export interface ColorSelCallbackProps {
  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: ColorValue) => void
}

export type ColorValue = string | CanvasGradient | CanvasPattern | null

export default function ColorSel({ colors: choices = ['#000000'], onChange }: ColorSelProps) {
  const [opacity, setOpacity] = useState<number>(1)
  const [color, setColor] = useState<string>('#ffffff')

  useEffect(() => {
    if (opacity === 0) {
      onChange(null)
      return
    }

    const opacityHex = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')

    onChange(color + opacityHex)
  }, [color, opacity])

  return (
    <Fieldset legend={translate('sel.color.legend')}>
      <AlphaSlider color={color} value={opacity} onChange={setOpacity} />

      {opacity > 0 && (
        <ColorPicker fullWidth format="hex" value={color} withPicker={false} onChange={setColor} swatches={choices} />
      )}

      <Space h="sm" />

      <Text {...textProps}>
        {opacity === 0
          ? translate('sel.color.transparent')
          : translate('sel.color.rbga', [
              [1, parseInt(color.slice(1, 3), 16)],
              [2, parseInt(color.slice(3, 5), 16)],
              [3, parseInt(color.slice(5, 7), 16)],
              [4, Math.round(opacity * 100)]
            ])}
      </Text>
    </Fieldset>
  )
}
