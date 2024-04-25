import { browser } from 'webextension-polyfill-ts';

export const themes: { [key: string]: any } = {
  day: {
    colors: {},
  },
  night: {
    colors: {},
  },
};

export function updateTheme(theme: { [key: string]: any }, value: string) {
  theme['day'].colors['frame'] = value;
  theme['night'].colors['frame'] = value;
}

let currentTheme = {};

export function setTheme(theme: { [key: string]: any }, value: string) {
  if (theme['day'].colors['frame'] === value) {
    console.log('theme is the same');
    return;
  }
  currentTheme = theme;
  updateTheme(theme, value);
  browser.theme.update(themes['day']);
}
