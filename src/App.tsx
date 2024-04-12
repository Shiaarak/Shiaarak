import { useEffect, useRef, useState } from 'react'
import { Container, AppShell, Tabs, Center } from '@mantine/core'
import { useForceUpdate, useLocalStorage } from '@mantine/hooks'
import CanvasTab from './components/tabs/Canvas'
import IconTab from './components/tabs/Icon'
import Menus from './components/Menus'
import { type Lang, LangContext, setTranslation, langs, textProps, translate } from './settings'
import { type Res, type Logo, LogoContext } from './logo'

export default function App() {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const iconLayersHolderRef = useRef<HTMLDivElement>(null)

  const [res, setRes] = useState<Res>({ w: 1000, h: 1000 })
  const [lang, setLang] = useLocalStorage<Lang>({
    key: 'settings.lang',
    defaultValue: langs.ar
  })
  const [logo, setLogo]: [Logo | null, (logo: Logo) => void] = useLocalStorage<Logo | null>({
    key: 'file',
    defaultValue: null
  })
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    import('./logo.json').then(({ default: data }: { default: object }) => {
      setLogo(data as Logo)
      forceUpdate()
    })
  }, [])

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

  return (
    <LangContext.Provider value={lang}>
      <LogoContext.Provider value={logo}>
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
                {(logo?.icon.layers.length || 0) > 0 && (
                <Center ref={iconLayersHolderRef} style={{ position: 'absolute' }}>
                  {logo?.icon.layers.map((_, i) => <canvas key={i} style={{ position: 'absolute' }} />)}
                </Center>
                )}
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
                <CanvasTab elRef={bgRef} onResChange={setRes} />
              </Tabs.Panel>
              <Tabs.Panel value="i">
                <IconTab holderRef={iconLayersHolderRef} res={res} />
              </Tabs.Panel>
              {/* <Tabs.Panel value="t">{<TextTab />}</Tabs.Panel> */}
            </Tabs>
        </AppShell.Aside>
      </AppShell>
      </LogoContext.Provider>
    </LangContext.Provider>
  )
}
