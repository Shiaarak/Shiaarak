import { useContext, useEffect, useState } from 'react'
import { Stack, Accordion, Space, ScrollArea, Divider, Slider, Text, Fieldset, Button } from '@mantine/core'
import { textProps, translate } from '../../settings'
import ColorSel from '../selectors/Color'
import { LogoContext, type LogoIcon, type Color, type Res } from '../../logo'

export interface IconTabProps {
  /**
   * Reference to the canvas used to draw the layer
   */
  holderRef: React.RefObject<HTMLDivElement>

  res: Res
}

export default function IconTab({ holderRef, res }: IconTabProps) {
  const { icon } = useContext(LogoContext) || { icon: { padding: 0.1, layers: [] } }
  const { padding: p, layers }: LogoIcon = icon

  const aspect = Math.min(res.w, res.h)
  const maxPadding = aspect * 0.5

  const [padding, setPadding] = useState<number>(maxPadding * p)
  const [openItems, setOpenItems] = useState<string[]>(layers.map((_, i) => i.toString()))

  useEffect(() => {
    if (p === padding / maxPadding) return
    setPadding(maxPadding * p)
  }, [res, p])

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
      setOpenItems(layers.map((_, i) => i.toString()))
    } else {
      setOpenItems([])
    }
  }

  return (
    <Stack justify="flex-start" gap="xs">
      <Space h="xs" />

      <Fieldset legend={translate('sel.icon.legend', [[1, ((aspect - padding * 2) / aspect).toFixed(2)]])}>
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

      {holderRef.current && (
        <Accordion multiple variant="separated" value={openItems}>
          <ScrollArea.Autosize mah={520} mx="auto" type="never">
            {layers.map((_, i) => (
              <IconLayer
                key={i}
                i={i}
                res={res}
                padding={padding}
                onClick={controlItems}
                el={holderRef.current?.children[i] as HTMLCanvasElement}
              />
            ))}
          </ScrollArea.Autosize>
        </Accordion>
      )}
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
  el: HTMLCanvasElement

  res: Res

  padding: number

  onClick: (itemI: string) => void
}

function IconLayer({ i, el: canvas, res, padding, onClick }: IconLayerProps) {
  const {
    icon: { layers }
  } = useContext(LogoContext) || { icon: { layers: [] } }
  const { colors, path, type } = layers[i]

  const [color, setColor] = useState<Color | null>(((colors[0] + 'ff') as Color) || null)

  useEffect(() => {
    if (colors.length === 0 || colors[0] === color?.substring(0, 7)) return
    setColor((colors[0] + 'ff') as Color)
  }, [colors])

  useEffect(() => {
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
    img.src = `${path}.${type}`
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
  }, [canvas, res, color, path, type, padding])

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
