import { useEffect, useState } from 'react'
import { Fieldset, Slider } from '@mantine/core'
import { translate } from '../../settings'

export interface PaddingSelProps {
  /** half size of container's smallest side */
  halfSize: number

  /**
   * @defaultValue 0
   */
  min?: number

  /**
   * @defaultValue 1
   */
  max?: number

  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: number) => void
}

export default function PaddingSel({ halfSize: size, min = 0, max = 100, onChange }: PaddingSelProps) {
  const [p, setPadding] = useState<number>(min)

  useEffect(() => {
    if (p < min) setPadding(min)
  }, [min])

  useEffect(() => {
    if (p > max) setPadding(max)
  }, [max])

  useEffect(() => onChange(p), [p, onChange])

  return (
    <Fieldset legend={translate('sel.padding.legend', [(p / size) * 100])}>
      <Slider
        value={(p / size) * 100}
        onChange={(val) => setPadding((val / 100) * size)}
        min={min}
        max={max}
        label={null}
      />
    </Fieldset>
  )
}
