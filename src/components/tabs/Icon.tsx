import type { PreviewReducerAction } from '../Preview'

import { useContext, useEffect, useState } from 'react'
import { Stack, Accordion, Space, ScrollArea, Button } from '@mantine/core'
import { translate } from '../../settings'
import ColorSel from '../selectors/Color'
import { LogoContext, type LogoIcon } from '../../logo'

export interface IconTabProps {
  /** Used to update the IconTab changes */
  dispatch: React.Dispatch<PreviewReducerAction>
}

export default function IconTab({ dispatch }: IconTabProps) {
  const { icon } = useContext(LogoContext) || { icon: { layers: [] } }
  const { layers }: LogoIcon = icon

  const [openItems, setOpenItems] = useState<string[]>(layers.map((_, i) => i.toString()))

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
