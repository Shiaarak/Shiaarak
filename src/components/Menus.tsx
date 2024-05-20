import type { MenuProps, ButtonProps, MenuItemProps, PolymorphicComponentProps } from '@mantine/core'

import { useContext, useState } from 'react'
import { Button, Group, Menu } from '@mantine/core'
import { IconExternalLink, IconFile, IconInfoCircle, IconSettings } from '@tabler/icons-react'
import { iconProps, translate, type Lang, LangContext } from '../settings'
import { type Logo } from '../logo'
import LangModal from './modals/Lang'
import ImportModal from './modals/Import'

export interface MenusProps {
  onLangChange: (lang: Lang) => void
  onLogoChange: (logo: Logo) => void
}

export default function Menus({ onLangChange, onLogoChange }: MenusProps) {
  const lang = useContext(LangContext)
  const [modal, setModal] = useState<'lang' | 'import' | null>(null)

  const menuProps: MenuProps = {
    withArrow: true,
    arrowPosition: 'center',
    shadow: 'md',
    width: 200,
    styles: {
      arrow: { direction: lang.dir },
      divider: { direction: lang.dir },
      dropdown: { direction: lang.dir },
      item: { direction: lang.dir },
      itemLabel: { direction: lang.dir },
      itemSection: { direction: lang.dir },
      label: { direction: lang.dir }
    }
  }
  const buttonProps: ButtonProps = {
    variant: 'transparent',
    size: 'compact-xs',
    style: { direction: lang.dir }
  }
  const linkMenuItemProps: PolymorphicComponentProps<'a', MenuItemProps> = {
    rightSection: <IconExternalLink {...iconProps} />,
    component: 'a',
    target: '_blank'
  }

  function exportImage(name: string) {
    const container = document.getElementById(`${name}-holder`)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const canvases = Array.from(container?.querySelectorAll('canvas') ?? [])

    const maxWidth = Math.max(...canvases.map((c) => c.width))
    const maxHeight = Math.max(...canvases.map((c) => c.height))

    canvas.width = maxWidth
    canvas.height = maxHeight
    canvases.forEach((c) => context?.drawImage(c, 0, 0))

    return canvas.toDataURL('image/png')
  }

  function downloadImages() {
    const name = 'logo'

    const link = document.createElement('a')
    link.href = exportImage(name)
    link.download = `${name}.png`
    link.click()
  }

  return (
    <Group gap={0} p={4} ps={0}>
      <Menu key={0} {...menuProps}>
        <Menu.Target>
          <Button leftSection={<IconInfoCircle {...iconProps} />} {...buttonProps}>
            {translate('menus.about')}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{translate('menus.app')}</Menu.Label>
          <Menu.Item href="https://shiaarak.io" {...linkMenuItemProps}>
            {translate('menus.website')}
          </Menu.Item>
          <Menu.Item href="https://github.com/Shiaarak/shiaarak" {...linkMenuItemProps}>
            {translate('menus.s-code')}
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>{translate('menus.author')}</Menu.Label>
          <Menu.Item href="https://links.nabilalsaiad.com" {...linkMenuItemProps}>
            {translate('menus.links-p')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu key={1} {...menuProps}>
        <Menu.Target>
          <Button leftSection={<IconSettings {...iconProps} />} {...buttonProps}>
            {translate('menus.settings')}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => setModal('lang')}>
            {translate('menus.lang')}: {lang.name}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu key={2} {...menuProps}>
        <Menu.Target>
          <Button leftSection={<IconFile {...iconProps} />} {...buttonProps}>
            {translate('menus.file')}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => setModal('import')}>{translate('menus.import')}</Menu.Item>
          <Menu.Item onClick={downloadImages}>{translate('menus.export')}</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {modal === 'lang' && <LangModal onChange={onLangChange} close={() => setModal(null)} />}
      {modal === 'import' && <ImportModal onChange={onLogoChange} close={() => setModal(null)} />}
    </Group>
  )
}
