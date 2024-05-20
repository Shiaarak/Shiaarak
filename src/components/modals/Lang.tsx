import { useContext, useRef } from 'react'
import { Button, Modal, Select, Space, Text } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { iconProps, translate, textProps, isLangName, LangContext, langs, type Lang } from '../../settings'

export interface LangModalProps {
  onChange: (lang: Lang) => void
  close: () => void
}

export default function Menus({ onChange, close }: LangModalProps) {
  const langSelRef = useRef<HTMLInputElement>(null)
  const lang = useContext(LangContext)

  function cancel() {
    if (!langSelRef.current) {
      close()
      return
    }
    langSelRef.current.value = lang.name

    close()
  }
  function save() {
    if (!langSelRef.current || !isLangName(langSelRef.current.value)) return

    const newLang = Object.values(langs).find((l) => l.name === langSelRef.current?.value)
    if (newLang) {
      onChange(newLang)
    }

    close()
  }

  return (
    <Modal opened centered mih={200} miw={300} title={translate('menus.lang')} onClose={cancel}>
      <Text {...textProps}>{lang.name}</Text>
      <Space h="xs" />

      <Select
        searchable
        clearable
        allowDeselect={false}
        withCheckIcon={false}
        placeholder={translate('menus.sel-lang')}
        nothingFoundMessage={translate('menus.no-found')}
        leftSectionPointerEvents="none"
        leftSection={<IconLanguage {...iconProps} />}
        ref={langSelRef}
        onBlur={(e) => {
          if (!isLangName(e.target.value)) {
            e.target.value = lang.name
          }
        }}
        data={Object.values(langs)
          .filter((l) => l.name !== lang.name)
          .map((l) => l.name)}
        style={{ direction: lang.dir }}
      />

      <Space h="sm" />
      <Button onClick={save}>{translate('menus.save')}</Button>
    </Modal>
  )
}
