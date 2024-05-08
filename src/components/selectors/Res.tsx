import { useEffect, useState } from 'react'
import { Text, Space, Fieldset, SegmentedControl, Center, Slider, Button } from '@mantine/core'
import { iconProps, textProps, theme, translate } from '../../settings'
import { IconCropLandscape, IconCropPortrait } from '@tabler/icons-react'
import { type Res, type AspectRatio, type AspectRatioDir } from '../../logo'

export interface ResSelProps {
  /**
   * The current resolution value
   * @defaultValue [{ w: 1000, h: 1000 }]
   */
  value: Res

  /**
   * The color options to choose from
   * @defaultValue ['1x1']
   */
  choices: AspectRatio[]

  /**
   * To be called when data changes
   * @callback
   */
  onChange: (value: Res) => void
}

export default function ResSel({ value, choices, onChange }: ResSelProps) {
  const [ratio, setRatio] = useState<AspectRatio>(choices[0] || { b: 1, s: 1 })
  const [dir, setDir] = useState<AspectRatioDir>(ratio.dir?.p ? 'p' : 'l')
  const [mul, setMul] = useState<number>(500)

  useEffect(() => {
    if (choices.length === 0) return
    setRatio(choices[0])
    setDir(choices[0].dir?.p ? 'p' : 'l')
  }, [choices])

  useEffect(() => {
    const w = (dir === 'l' ? ratio.b : ratio.s) * mul
    const h = (dir === 'p' ? ratio.b : ratio.s) * mul

    onChange({ w, h })
  }, [ratio, dir, mul, onChange])

  function handleRatioChange(r: AspectRatio) {
    setRatio(r)

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
    <Fieldset legend={translate('sel.res.legend', [value.w, value.h])}>
      {choices.length > 0 && (
        <>
          <Text {...textProps}>{translate('sel.res.ratio')}</Text>
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
                  variant={JSON.stringify(ratio) == JSON.stringify(r) ? 'filled' : 'default'}
                  size="compact-xs"
                  radius="sm"
                  onClick={() => handleRatioChange(r)}
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

          {ratio.dir && (
            <>
              <Space h="sm" />

              <Text {...textProps}>{translate('sel.res.dir')}</Text>
              <Space h="xs" />
              <SegmentedControl
                fullWidth
                defaultChecked
                variant="filled"
                color={theme.primaryColor}
                value={dir}
                onChange={(val) => setDir(val as AspectRatioDir)}
                defaultValue="l"
                data={[
                  {
                    value: 'l',
                    disabled: !ratio.dir?.l,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconCropLandscape {...iconProps} />
                        <Text {...textProps}>{translate('sel.res.l')}</Text>
                      </Center>
                    )
                  },
                  {
                    value: 'p',
                    disabled: !ratio.dir?.p,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconCropPortrait {...iconProps} />
                        <Text {...textProps}>{translate('sel.res.p')}</Text>
                      </Center>
                    )
                  }
                ]}
              />
            </>
          )}

          <Space h="sm" />

          <Text {...textProps}>
            {translate('sel.res.p-m')} ({mul})
          </Text>
          <Space h="xs" />
          <Slider value={mul} onChange={setMul} min={1} max={1000} label={null} />
        </>
      )}
    </Fieldset>
  )
}
