import type { MenuProps, ButtonProps, MenuItemProps, PolymorphicComponentProps } from '@mantine/core'

import { Button, Group, Menu, Modal, Select, Space, Text } from '@mantine/core'
import { IconExternalLink, IconFile, IconInfoCircle, IconLanguage, IconSettings } from '@tabler/icons-react'
import { iconProps, translate, textProps, LangCode, isLangName, LangContext, langs } from '../settings'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useRef } from 'react'

export interface MenusProps {
  onLangChange: (lang: LangCode) => void
}

export default function Menus({ onLangChange }: MenusProps) {
  const langSelRef = useRef<HTMLInputElement>(null)
  const lang = useContext(LangContext)

  const [opened, { open, close }] = useDisclosure(false)

  const menuProps: MenuProps = { withArrow: true, arrowPosition: 'center', shadow: 'md', width: 200 }
  const buttonProps: ButtonProps = { variant: 'transparent', size: 'compact-xs' }
  const linkMenuItemProps: PolymorphicComponentProps<'a', MenuItemProps> = {
    rightSection: <IconExternalLink {...iconProps} />,
    component: 'a',
    target: '_blank'
  }

  function cancelChanges() {
    if (!langSelRef.current) {
      return
    }

    langSelRef.current.value = lang.name
  }
  function saveChanges() {
    if (!langSelRef.current || !isLangName(langSelRef.current.value)) {
      return
    }

    // @ts-expect-error
    const newLang = Object.values(langs).find((l) => l.name === langSelRef.current.value)?.code
    // @ts-expect-error
    onLangChange(newLang)
    close()
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
          {/* @ts-expect-error */}
          <Menu.Item href="https://shiaarak.io" {...linkMenuItemProps}>
            {translate('menus.website')}
          </Menu.Item>
          {/* @ts-expect-error */}
          <Menu.Item href="https://github.com/Shiaarak/shiaarak" {...linkMenuItemProps}>
            {translate('menus.s-code')}
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>{translate('menus.author')}</Menu.Label>
          {/* @ts-expect-error */}
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
          <Menu.Item onClick={open}>
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
          <Menu.Item>{translate('menus.import')}</Menu.Item>
          <Menu.Item>{translate('menus.export')}</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        centered
        title={translate('menus.lang')}
        size="auto"
        opened={opened}
        onClose={() => {
          cancelChanges()
          close()
        }}
      >
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
        <Button onClick={saveChanges}>{translate('menus.save')}</Button>
      </Modal>
    </Group>
  )
}
