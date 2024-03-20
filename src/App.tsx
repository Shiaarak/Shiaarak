import { useEffect, useReducer, useRef, useState } from 'react'
import { Container, AppShell, Tabs, Center } from '@mantine/core'
import CanvasTab from './components/tabs/Canvas'
import Menus from './components/Menus'
import { Lang, LangContext, flattenJson, langs, textProps, translate } from './settings'

export default function App() {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const [lang, setLang] = useState<Lang>(langs.ar)
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    import(`./langs/${lang.code}.json`).then(({ default: obj }) => {
      flattenJson(obj, null)
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
      <AppShell
        bg={'dark'}
        aside={{ width: 300, breakpoint: 'xs', collapsed: { desktop: false, mobile: true } }}
        header={{ height: 30, offset: true }}
        padding="md"
      >
        <AppShell.Header>
          <Menus onLangChange={(code) => setLang(langs[code])} />
        </AppShell.Header>
        <AppShell.Main>
          <Container fluid bg="#242424">
            <Center>
              <canvas ref={bgRef} />
              {/* <img src="logo0.png" style={{ position: 'absolute' }} />
            <img src="logo1.png" style={{ position: 'absolute' }} /> */}
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
                useRef={bgRef}
                size={{ w: 1000, h: 1000 }}
                colors={['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff']}
              />
            </Tabs.Panel>
            {/* <Tabs.Panel value="i">{<ImagesTab />}</Tabs.Panel>
          <Tabs.Panel value="t">{<TextTab />}</Tabs.Panel> */}
          </Tabs>
        </AppShell.Aside>
      </AppShell>
    </LangContext.Provider>
  )
}
