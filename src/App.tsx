import { useEffect, useReducer, useState } from 'react'
import { AppShell, Tabs } from '@mantine/core'
import { useForceUpdate, useLocalStorage } from '@mantine/hooks'
import CanvasTab from './components/tabs/Canvas'
import IconTab from './components/tabs/Icon'
import Menus from './components/Menus'
import { type Lang, LangContext, setTranslation, langs, textProps, translate } from './settings'
import { type Logo, LogoContext } from './logo'
import Preview, {
  type PreviewWithAction,
  type PreviewReducerAction,
  reducer as previewReducer
} from './components/Preview'

export default function App() {
  // @ts-ignore
  const [preview, previewDispatch]: [PreviewWithAction, React.Dispatch<PreviewReducerAction>] = useReducer(
    previewReducer,
    {
      canvas: { res: { w: 500, h: 500 }, padding: 0 },
      icon: { layers: [] }
    }
  )
  const [lang, setLang] = useLocalStorage<Lang>({
    key: 'settings.lang',
    defaultValue: langs.ar
  })
  const [logo, setLogo] = useState<Logo | null>(null)
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    import(`./langs/${lang.code}.json`).then(({ default: data }: { default: object }) => {
      setTranslation(lang, data)
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

  function handleFileImport(logo: Logo) {
    setLogo(logo)
    forceUpdate()
  }

  return (
    <LangContext.Provider value={lang}>
      <LogoContext.Provider value={logo}>
        <AppShell
          bg={'dark'}
          padding="md"
          header={{ height: 30, offset: true }}
          aside={{ width: 300, breakpoint: 'xs', collapsed: { desktop: false, mobile: true } }}
        >
          <AppShell.Header dir={lang.dir} pr={10} pl={10}>
            <Menus onLangChange={setLang} onLogoChange={handleFileImport} />
          </AppShell.Header>
          <AppShell.Main>
            <Preview preview={preview} />
          </AppShell.Main>
          <AppShell.Aside bg={'dark'} p="md">
            <Tabs defaultValue="c">
              <Tabs.List grow justify="center">
                <Tabs.Tab value="c">{translate('tabs.c')}</Tabs.Tab>
                <Tabs.Tab value="i">{translate('tabs.i')}</Tabs.Tab>
                <Tabs.Tab value="t">{translate('tabs.t')}</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="c">
                <CanvasTab res={preview.canvas.res} dispatch={previewDispatch} />
              </Tabs.Panel>
              <Tabs.Panel value="i">
                <IconTab dispatch={previewDispatch} />
              </Tabs.Panel>
              {/* <Tabs.Panel value="t">{<TextTab />}</Tabs.Panel> */}
            </Tabs>
          </AppShell.Aside>
        </AppShell>
      </LogoContext.Provider>
    </LangContext.Provider>
  )
}
