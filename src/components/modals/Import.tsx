import { useState } from 'react'
import { Button, FileInput, Modal, Space, Text } from '@mantine/core'
import { IconFileImport } from '@tabler/icons-react'
import { translate, textProps, iconProps } from '../../settings'
import { type Logo } from '../../logo'

export interface ImportModalProps {
  onChange: (logo: Logo) => void
  close: () => void
}

export default function Menus({ onChange, close }: ImportModalProps) {
  const [tempLogo, setTempLogo] = useState<Logo | null>(null)

  function cancel() {
    if (!tempLogo) {
      close()
      return
    }
    setTempLogo(null)

    close()
  }
  function save() {
    if (!tempLogo) return

    onChange(tempLogo)

    close()
  }

  function loadFile(file: File | null) {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const logo: Logo = JSON.parse(reader.result as string)
      logo.icon.layers = logo.icon.layers.map((l) => {
        if (typeof l.img === 'string') {
          const img = new Image()
          img.src = l.img
          l.img = img
        }

        return l
      })

      setTempLogo(logo)
    }
    reader.readAsText(file)
  }

  return (
    <Modal opened centered mih={200} miw={300} title={translate('menus.import')} onClose={cancel}>
      <Text {...textProps}>{translate('menus.import')}</Text>
      <Space h="xs" />

      <FileInput
        clearable
        accept=".logo.json"
        onChange={loadFile}
        leftSectionPointerEvents="none"
        leftSection={<IconFileImport {...iconProps} />}
      />

      <Space h="sm" />
      <Button onClick={save}>{translate('menus.save')}</Button>
    </Modal>
  )
}
