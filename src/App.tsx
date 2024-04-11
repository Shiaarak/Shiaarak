import { useEffect, useRef, useState } from 'react'
import { Container, AppShell, Tabs, Center } from '@mantine/core'
import { useForceUpdate, useLocalStorage } from '@mantine/hooks'
import CanvasTab from './components/tabs/Canvas'
import IconTab from './components/tabs/Icon'
import Menus from './components/Menus'
import { type Lang, LangContext, setTranslation, langs, textProps, translate } from './settings'
import { type Res } from './components/selectors/Res'
import { type Color } from './components/selectors/Color'

export default function App() {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const iconRefs = Array.from({ length: 4 }, (_, i) => i).map(() => useRef<HTMLCanvasElement>(null))

  const [res, setRes] = useState<Res>({ w: 1000, h: 1000 })
  const [lang, setLang] = useLocalStorage<Lang>({
    key: 'settings.lang',
    defaultValue: langs.ar
  })
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    import(`./langs/${lang.code}.json`).then(({ default: obj }: { default: object }) => {
      setTranslation(lang, obj)
      forceUpdate()
    })

    document.documentElement.lang = lang.code
    if (!textProps.style) {
      textProps.style = { direction: lang.dir }
      if (!textProps.style.direction) {
        textProps.style.direction = lang.dir
      }
    }
  }, [lang])

  const colors: Color[] = ['#ffffff', '#000000', '#ed2e38', '#009639']
  const iconLayers = iconRefs.map((_, i) => ({
    res: { value: res },
    color: { choices: colors },
    elRef: iconRefs[i],
    path: `${i}.png`
  }))

  return (
    <LangContext.Provider value={lang}>
      <AppShell
        bg={'dark'}
        aside={{ width: 300, breakpoint: 'xs', collapsed: { desktop: false, mobile: true } }}
        header={{ height: 30, offset: true }}
        padding="md"
      >
        <AppShell.Header dir={lang.dir} pr={10} pl={10}>
          <Menus onLangChange={setLang} />
        </AppShell.Header>
        <AppShell.Main>
          <Container fluid bg="#242424">
            <Center style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
              <canvas ref={bgRef} />
              {iconRefs.map((_, i) => (
                <canvas key={i} ref={iconRefs[i]} style={{ position: 'absolute' }} />
              ))}
            </Center>
          </Container>
        </AppShell.Main>
        <AppShell.Aside bg={'dark'} p="md">
          <Tabs defaultValue="c">
            <Tabs.List grow justify="center">
              <Tabs.Tab value="c">{translate('tabs.c')}</Tabs.Tab>
              <Tabs.Tab value="i">{translate('tabs.i')}</Tabs.Tab>
              <Tabs.Tab value="t">{translate('tabs.t')}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="c">
              <CanvasTab
                elRef={bgRef}
                res={{
                  choices: [
                    {
                      b: 1,
                      s: 1
                    },
                    {
                      b: 3,
                      s: 2,
                      dir: {
                        l: true
                      }
                    },
                    {
                      b: 4,
                      s: 3,
                      dir: {
                        p: true
                      }
                    },
                    {
                      b: 16,
                      s: 9,
                      dir: {
                        l: true,
                        p: true
                      }
                    }
                  ],
                  onChange: setRes
                }}
                color={{ choices: ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'] }}
              />
            </Tabs.Panel>
            <Tabs.Panel value="i">{<IconTab layersProps={iconLayers} />}</Tabs.Panel>
            {/* <Tabs.Panel value="t">{<TextTab />}</Tabs.Panel> */}
          </Tabs>
        </AppShell.Aside>
      </AppShell>
    </LangContext.Provider>
  )
}
