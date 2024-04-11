import { useEffect, useState } from 'react'
import { Text, Space, Fieldset, SegmentedControl, Center, Slider, Button } from '@mantine/core'
import { iconProps, textProps, theme, translate } from '../../settings'
import { IconCropLandscape, IconCropPortrait } from '@tabler/icons-react'

export interface SizeSelProps {
  /**
   * The current size value
   * @defaultValue [{ w: 1000, h: 1000 }]
   */
  value: Size
  /**
   * The color options to choose from
   * @defaultValue ['1x1']
   */
  choices: Res[]

  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: Size) => void
}

export type Size = { w: number; h: number }
export type Res = {
  /** Bigger side of resolution */
  b: number

  /** smaller side of resolution */
  s: number

  /**
   * Direction of resolution
   *
   * Undefined only when the resolution is square
   */
  dir?: {
    l?: boolean
    p?: boolean
  }
}
export type ResDir = 'l' | 'p'

export default function SizeSel({ value, choices, onChange }: SizeSelProps) {
  const [res, setRes] = useState<Res>(choices[0] || '1x1')
  const [dir, setDir] = useState<ResDir>(res.dir?.p ? 'p' : 'l')
  const [mul, setMul] = useState<number>(500)

  useEffect(() => {
    const w = (dir === 'l' ? res.b : res.s) * mul
    const h = (dir === 'p' ? res.b : res.s) * mul

    onChange({ w, h })
  }, [res, dir, mul])

  function handleResChange(r: Res) {
    setRes(r)

    if (r.dir) {
      const { l, p } = r.dir
      if (dir === 'l' && !l) {
        setDir('p')
      } else if (dir === 'p' && !p) {
        setDir('l')
      }
    }
  }

  return (
    <Fieldset
      legend={translate('sel.size.legend', [
        [1, value.w],
        [2, value.h]
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
        {choices.map((r, i) => {
          return (
            <Button
              key={i}
              variant={JSON.stringify(res) == JSON.stringify(r) ? 'filled' : 'default'}
              size="compact-xs"
              radius="sm"
              onClick={() => handleResChange(r)}
              className="mantine-focus-auto m-5e1a038c m-de3d2490 mantine-ColorSwatch-root"
              styles={{
                root: {
                  '--cs-size': 'calc(2.5rem * var(--mantine-scale))',
                  '--cs-radius': 'var(--mantine-radius-sm)'
                }
              }}
            >
              {`${r.b}x${r.s}`}
            </Button>
          )
        })}
      </Button.Group>

      {res.dir && (
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
            onChange={(val) => setDir(val as ResDir)}
            defaultValue="l"
            data={[
              {
                value: 'l',
                disabled: !res.dir?.l,
                label: (
                  <Center style={{ gap: 5 }}>
                    <IconCropLandscape {...iconProps} />
                    <Text {...textProps}>{translate('sel.size.l')}</Text>
                  </Center>
                )
              },
              {
                value: 'p',
                disabled: !res.dir?.p,
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
