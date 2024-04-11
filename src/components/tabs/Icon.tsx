import { useEffect, useState } from 'react'
import { Stack, Accordion, Space, ScrollArea, Divider, Slider, Text, Fieldset, Button } from '@mantine/core'
import { ResSelProps } from '../selectors/Res'
import { textProps, translate } from '../../settings'
import ColorSel, { ColorSelProps, Color } from '../selectors/Color'

export interface IconTabProps {
  layersProps: Omit<IconLayerProps, 'i' | 'padding' | 'onClick'>[]
}

export default function IconTab({ layersProps }: IconTabProps) {
  const [padding, setPadding] = useState<number>(10)
  const [openItems, setOpenItems] = useState<string[]>(layersProps.map((_, i) => i.toString()))

  const {
    res: { value: res }
  } = layersProps[0]
  const aspect = Math.min(res.w, res.h)
  const maxPadding = aspect * 0.5

  const scale = ((aspect - padding * 2) / aspect).toFixed(2)

  function controlItems(itemI?: string) {
    if (itemI) {
      setOpenItems((prev) => {
        const index = prev.indexOf(itemI)
        if (index === -1) {
          return [...prev, itemI]
        }

        return prev.filter((_, i) => i !== index)
      })
      return
    }

    if (openItems.length === 0) {
      setOpenItems(layersProps.map((_, i) => i.toString()))
    } else {
      setOpenItems([])
    }
  }

  return (
    <Stack justify="flex-start" gap="xs">
      <Space h="xs" />

      <Fieldset legend={translate('sel.icon.legend', [[1, scale]])}>
        <Text {...textProps}>
          {translate('sel.icon.pad')} ({padding})
        </Text>
        <Space h="xs" />
        <Slider value={padding} onChange={setPadding} min={0} max={maxPadding} label={null} />
      </Fieldset>

      <Divider my="xs" label={`🔻 ${translate('sel.icon.i-l')} 🔻`} labelPosition="center" />

      <Button fullWidth onClick={() => controlItems()}>
        {translate(`sel.icon.${openItems.length === 0 ? 'o' : 'c'}-all`)}
      </Button>

      <Accordion multiple variant="separated" value={openItems}>
        <ScrollArea.Autosize mah={520} mx="auto" type="never">
          {layersProps.map((layerProps, i) => (
            <IconLayer key={i} i={i} {...layerProps} padding={padding} onClick={controlItems} />
          ))}
        </ScrollArea.Autosize>
      </Accordion>
    </Stack>
  )
}

export interface IconLayerProps {
  /**
   * Layer Index
   */
  i: number

  /**
   * Reference to the canvas used to draw the layer
   */
  elRef: React.MutableRefObject<HTMLCanvasElement | null>

  /**
   * Layer image path
   */
  path: string

  padding: number

  onClick: (itemI: string) => void

  res: Pick<ResSelProps, 'value'>

  color: Pick<ColorSelProps, 'choices'>
}

function IconLayer({
  i,
  path,
  color: { choices: colors },
  elRef: ref,
  res: { value: res },
  padding,
  onClick
}: IconLayerProps) {
  const [color, setColor] = useState<Color | null>('#ffffffff')

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true })
    if (!ctx) return

    if (typeof color !== 'string') {
      return
    }

    const { w, h } = res
    canvas.width = w
    canvas.height = h

    const img = new Image()
    img.src = path
    img.onload = () => {
      const iw = img.width
      const ih = img.height

      const wRatio = (w - 2 * padding) / iw
      const hRatio = (h - 2 * padding) / ih
      const ratio = Math.min(wRatio, hRatio)

      const xCenterShift = (w - iw * ratio) * 0.5
      const yCenterShift = (h - ih * ratio) * 0.5

      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, iw, ih, xCenterShift, yCenterShift, iw * ratio, ih * ratio)

      const imageData = ctx.getImageData(0, 0, w, h)
      const data = imageData.data

      // Loop through each pixel to change non-transparent pixels to the new color
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) {
          continue
        }

        data[i] = parseInt(color.slice(1, 3), 16)
        data[i + 1] = parseInt(color.slice(3, 5), 16)
        data[i + 2] = parseInt(color.slice(5, 7), 16)
        data[i + 3] = parseInt(color.slice(7, 9), 16)
      }

      ctx.putImageData(imageData, 0, 0)
    }
  }, [ref, color, path, res, padding])

  return (
    <Accordion.Item key={i} value={i.toString()}>
      <Accordion.Control onClick={() => onClick(i.toString())}>
        {translate('sel.icon.layer')} {i}
      </Accordion.Control>
      <Accordion.Panel>
        <ColorSel choices={colors} onChange={setColor} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}
