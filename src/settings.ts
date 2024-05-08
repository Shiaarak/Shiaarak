import type { Direction, TextProps } from '@mantine/core'
import { Fieldset, createTheme } from '@mantine/core'
import { createContext } from 'react'

// language

export type LangCode = 'ar' | 'en'
export type LangName = 'العربية' | 'English'
export interface Lang {
  code: LangCode
  name: LangName
  dir: Direction
}

export const langs: Record<LangCode, Lang> = {
  ar: { code: 'ar', name: 'العربية', dir: 'rtl' } as Lang,
  en: { code: 'en', name: 'English', dir: 'ltr' } as Lang
}

export function isLangCode(code: string): code is LangCode {
  // return code in LangNames
  return code in langs
}
export function isLangName(name: string): name is LangName {
  // return name in LangCodes
  return Object.values(langs).some((l) => l.name === name)
}

export const LangContext = createContext<Lang>(langs.ar)

// translation

const translation = new Map<string, string>()

export function translate(key: string, replacements?: (string | number)[]): string {
  let val = translation.get(key)
  if (!val) return ''

  if (replacements && replacements.length > 0)
    for (let i = 0; i < replacements.length; i++)
      val = val.replace(new RegExp(`\\$${i + 1}`, 'g'), replacements[i].toString())

  return val
}

export function setTranslation(lang: Lang, obj: object) {
  if (lang.code === translation.get('lang')) return

  translation.set('lang', lang.code)
  flattenJson(obj)

  document.documentElement.lang = lang.code
  if (!textProps.style) {
    textProps.style = { direction: lang.dir }
    if (!textProps.style.direction) {
      textProps.style.direction = lang.dir
    }
  }
}

export function flattenJson(obj: object, parentKey?: string) {
  for (const key in obj) {
    // @ts-expect-error
    const el: object | string = obj[key]
    const fullKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof el === 'object') {
      flattenJson(el, fullKey)
    } else {
      translation.set(fullKey, el)
    }
  }
}

// theme

export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 7,
  black: '#000',
  white: '#fff',

  components: {
    Fieldset: Fieldset.extend({
      styles: {
        legend: {
          direction: langs[document.documentElement.lang as LangCode].dir
        }
      }
    })
  }
})

// props overrides

export let iconProps = { size: 14 }
export let textProps: TextProps = {
  size: 'sm',
  fw: 500
}
