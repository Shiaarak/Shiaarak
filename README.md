# Shiaarak

## Translations

- [Arabic | العربية](README.ar.md)

## Table Of Content

- [Shiaarak](#shiaarak)
  - [Translations](#translations)
  - [Table Of Content](#table-of-content)
- [About](#about)
  - [Problem](#problem)
  - [Solution](#solution)
  - [How to use](#how-to-use)
- [File](#file)
  - [Name](#name)
  - [Format](#format)
- [Application](#application)
  - [Translation](#translation)
- [License](#license)
- [Contact](#contact)

# About

A cross-platform application originally made for graphic designers and their clients, and working with logos in general

## Problem

When you ask a graphic designer to create a logo for you, or download a press kit from the web, you will receive many images in different colors and sizes, with and without text, to cover the largest number of situations.

This may be enough at first, but soon you will need an additional image in a different color, size, or format, and to get it you will have to contact the graphic designer again to export you an image with the characteristics you need, or you will have to make it yourself, and both solutions consume a lot of time.

## Solution

A better way to deal with logos is by having one file that contains all the logo data and an application that reads this type of file to export one image or several images at the same time with the properties you need whenever you want.

This solution may be intuitive at first glance, as the designer can give the source file to the client to export images with the characteristics he wants, but there are some problems with this solution, which are as follows:
On the client side:

- There are many design applications with different drawing methods
- Some design applications are paid or subscribed
- Powerful design programs are limited to desktop computers
  From the designer's side:
  Giving the client complete freedom may cause distortion of the final logo
- The client does not know how to use the design application or faces problems during export
- The possibility of the client giving the source file to another designer

The fix is to create a special file format and application for customer use

## How to use

The designer writes the logo file or exports it from the design application using a special tool, then sends it to the client to import it into the application on the desktop, phone, or browser.

After that, the client chooses the characteristics he wants from among the permitted characteristics that the designer has previously specified, then he exports one image every time he needs an image for the logo, or he exports several images at once and keeps them.

# File

## Name

The file format name is `logo` because the project was originally made to work with logos

> Example: `shiaarak.logo`

## Format

The format is inspired by [toml][toml] with some added features

The file contains at the beginning technical data related to the application so that it can be read correctly, such as the version. This data must not be changed

# Application

The application is open source and completely free for everyone and will not contain any paid add-ons or subscription system

The application is built using the following technologies

- [Tauri][tauri]: Programming framework for the structure and operation of the interface
- [React][react]: The programming framework for the interface
- [TypeScript][ts]: The programming language for the interface
- [Rust][rust]: The main programming language for the structure
- [Mantine][ui]: Interface components library

## Translation

The application officially offers Arabic and English, and relies on community assistance in translation for the rest of the languages

The translation files are located in the directory `src/langs` and are written in the format [`json`][json]

# License

This software is licensed under GNU GPL v3 &copy; 2024 The Alpha (Nabil Alsaiad)

To view a copy of this license, visit [site](https://www.gnu.org/licenses/gpl-3.0.html#license-text) or see [file](./LICENSE)

[![gpl](https://www.gnu.org/graphics/gplv3-127x51.png)](https://www.gnu.org/licenses/gpl-3.0.html)

# Contact

Contact me via [Telegram](https://t.me/nabil_alsaiad) or email at [contact@nabilalsaiad.com](mailto:contact@nabilalsaiad.com)

[json]: https://json.org
[toml]: https://toml.io
[tauri]: https://tauri.app
[react]: https://react.dev
[ts]: https://typescriptlang.org
[rust]: https://rust-lang.org
[ui]: https://mantine.dev
