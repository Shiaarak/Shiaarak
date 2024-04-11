import { useEffect, useRef, useState } from 'react'
import { Container, AppShell, Tabs, Center } from '@mantine/core'
import CanvasTab from './components/tabs/Canvas'
import IconTab from './components/tabs/Icon'
import Menus from './components/Menus'
import { Lang, LangContext, setTranslation, langs, textProps, translate } from './settings'
import { SizeValue } from './components/selectors/Size'
import { useForceUpdate, useLocalStorage } from '@mantine/hooks'

export default function App() {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const iconRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null)
  ]

  const [size, setSize] = useState<SizeValue>({ w: 1000, h: 1000 })
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

  const colors = ['#ffffff', '#000000', '#ed2e38', '#009639']
  const iconLayers = iconRefs.map((_, i) => ({
    size,
    colors,
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
                onSizeChange={setSize}
                elRef={bgRef}
                size={{ w: 1000, h: 1000 }}
                colors={['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff']}
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
