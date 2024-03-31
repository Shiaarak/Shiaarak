import { useEffect, useState } from 'react'
import { Text, Space, Fieldset, SegmentedControl, Center, Slider, Button } from '@mantine/core'
import { iconProps, textProps, theme, translate } from '../../settings'
import { IconCropLandscape, IconCropPortrait } from '@tabler/icons-react'

export interface SizeSelProps extends SizeSelVarProps, SizeSelCallbackProps {}

export interface SizeSelVarProps {
  /**
   * The current size value
   * @defaultValue [{ w: 1000, h: 1000 }]
   */
  size: SizeValue
}

export interface SizeSelCallbackProps {
  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: SizeValue) => void
}

export type SizeValue = { w: number; h: number }

export default function SizeSel({ size, onChange }: SizeSelProps) {
  const [res, setRes] = useState<`${number}x${number}`>('1x1')
  const [dir, setDir] = useState<'l' | 'p'>('l')
  const [mul, setMul] = useState<number>(500)

  useEffect(() => {
    const parts = res.split('x')
    const w = parseInt(parts[dir === 'l' ? 0 : 1]) * mul
    const h = parseInt(parts[dir === 'p' ? 0 : 1]) * mul

    onChange({ w, h })
  }, [res, dir, mul])

  return (
    <Fieldset
      legend={translate('sel.size.legend', [
        [1, size.w],
        [2, size.h]
      ])}
    >
      <Text {...textProps}>{translate('sel.size.res')}</Text>
      <Space h="xs" />
      <Button.Group
        className="m-4081bf90 mantine-Group-root"
        styles={{
          group: {
            gap: 'calc(0.2rem * var(--mantine-scale))',
            align: 'center',
            justify: 'flex-start',
            wrap: 'wrap',
            marginTop: 'calc(0.125rem * var(--mantine-scale))'
          }
        }}
      >
        {['1x1', '3x2', '4x3', '5x4', '7x5', '16x9'].map((r, i) => {
          return (
            <Button
              key={i}
              variant={res === r ? 'filled' : 'default'}
              size="compact-xs"
              radius="sm"
              // @ts-expect-error
              onClick={() => setRes(r)}
              className="mantine-focus-auto m-5e1a038c m-de3d2490 mantine-ColorSwatch-root"
              styles={{
                root: {
                  '--cs-size': 'calc(2.5rem * var(--mantine-scale))',
                  '--cs-radius': 'var(--mantine-radius-sm)'
                }
              }}
            >
              {r}
            </Button>
          )
        })}
      </Button.Group>

      {res !== '1x1' && (
        <>
      <Space h="sm" />

      <Text {...textProps}>{translate('sel.size.dir')}</Text>
      <Space h="xs" />
      <SegmentedControl
        fullWidth
        defaultChecked
        variant="filled"
        color={theme.primaryColor}
        value={dir}
        // @ts-expect-error
        onChange={setDir}
        defaultValue="l"
        data={[
          {
            value: 'l',
            label: (
              <Center style={{ gap: 5 }}>
                <IconCropLandscape {...iconProps} />
                <Text {...textProps}>{translate('sel.size.l')}</Text>
              </Center>
            )
          },
          {
            value: 'p',
            label: (
              <Center style={{ gap: 5 }}>
                <IconCropPortrait {...iconProps} />
                <Text {...textProps}>{translate('sel.size.p')}</Text>
              </Center>
            )
          }
        ]}
          />
        </>
      )}

      <Space h="sm" />

      <Text {...textProps}>
        {translate('sel.size.p-m')} ({mul})
      </Text>
      <Space h="xs" />
      <Slider value={mul} onChange={setMul} min={1} max={1000} label={null} />
    </Fieldset>
  )
}
