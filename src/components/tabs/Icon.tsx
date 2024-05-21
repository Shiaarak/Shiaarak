import type { PreviewReducerAction } from '../Preview'

import { useContext, useEffect, useState } from 'react'
import { Stack, Accordion, Space, ScrollArea, Divider, Slider, Text, Fieldset, Button } from '@mantine/core'
import { textProps, translate } from '../../settings'
import ColorSel from '../selectors/Color'
import { LogoContext, type LogoIcon, type Res } from '../../logo'

export interface IconTabProps {
  /** Used to update the IconTab changes */
  dispatch: React.Dispatch<PreviewReducerAction>

  /** Used to calculate the padding */
  res: Res
}

export default function IconTab({ res: { w, h }, dispatch }: IconTabProps) {
  const { icon } = useContext(LogoContext) || { icon: { padding: 0.1, layers: [] } }
  const { padding: p, layers }: LogoIcon = icon

  const aspect = Math.min(w, h)
  const maxPadding = aspect * 0.5

  const [padding, setPadding] = useState<number>(maxPadding * p)
  const [openItems, setOpenItems] = useState<string[]>(layers.map((_, i) => i.toString()))

  useEffect(() => {
    if (p === padding / maxPadding) return
    setPadding(maxPadding * p)
  }, [w, h, p])

  useEffect(() => {
    dispatch({ type: 'i-padding', payload: padding })
  }, [padding, dispatch])

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

      <Fieldset legend={translate('tab.icon.legend', [((aspect - padding * 2) / aspect).toFixed(2)])}>
        {layers.length > 0 && (
          <>
            <Text {...textProps}>
              {translate('tab.icon.pad')} ({padding})
            </Text>
            <Space h="xs" />
            <Slider value={padding} onChange={setPadding} min={0} max={maxPadding} label={null} />
          </>
        )}
      </Fieldset>

      <Divider my="xs" label={`🔻 ${translate('tab.icon.i-l')} 🔻`} labelPosition="center" />

      {layers.length > 0 && (
        <>
          <Button fullWidth onClick={() => controlItems()}>
            {translate(`tab.icon.${openItems.length === 0 ? 'o' : 'c'}-all`)}
          </Button>

          <Accordion multiple variant="separated" value={openItems}>
            <ScrollArea.Autosize mah={520} mx="auto" type="never">
              {layers.map((_, i) => (
                <IconLayer key={i} i={i} dispatch={dispatch} onClick={controlItems} />
              ))}
            </ScrollArea.Autosize>
          </Accordion>
        </>
      )}
    </Stack>
  )
}

export interface IconLayerProps {
  /** Layer Index */
  i: number

  /** Used to update the IconTab layers changes */
  dispatch: React.Dispatch<PreviewReducerAction>

  /** Fired when the layer's head is clicked for toggling collapse */
  onClick: (itemI: string) => void
}

function IconLayer({ i, dispatch, onClick }: IconLayerProps) {
  const {
    icon: { layers }
  } = useContext(LogoContext) || { icon: { layers: [] } }
  const { colors, img } = layers[i]

  useEffect(() => {
    if (typeof img === 'string') throw new Error('img must not be a string')
    dispatch({ type: 'l-img', payload: { i, img } })
  }, [img, dispatch])

  return (
    <Accordion.Item key={i} value={i.toString()}>
      <Accordion.Control onClick={() => onClick(i.toString())}>
        {translate('tab.icon.layer')} {i}
      </Accordion.Control>
      <Accordion.Panel>
        <ColorSel
          choices={colors}
          onChange={(val) => dispatch({ type: 'l-color', payload: { i, color: val ?? '#00000000' } })}
        />
      </Accordion.Panel>
    </Accordion.Item>
  )
}
