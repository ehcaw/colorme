import { browser } from 'webextension-polyfill-ts';

export let storage = localStorage;

type ThemeColor = string;
interface ThemeType {
  colors: {
    frame: ThemeColor | undefined;
  };
}

export const themes: { [key: string]: ThemeType } = {
  day: {
    colors: {
      frame: storageAvailable('localStorage')
        ? localStorage.getItem('day') ?? undefined
        : '#ffffff', // Assuming white for day
    },
  },
  night: {
    colors: {
      frame: storageAvailable('localStorage')
        ? localStorage.getItem('night') ?? ''
        : '000000', // Assuming black for night
    },
  },
};

export function updateColor(
  theme: { [key: string]: any },
  value: string,
  mode: string
) {
  const checkBox = document.getElementById('checkbox') as HTMLInputElement;
  if (checkBox.checked) {
    theme['night'].colors['frame'] = value;
    console.log('changed night theme');
  } else {
    theme['day'].colors['frame'] = value;
    console.log('light mode changed');
  }
}

export async function changeMode(theme: { [key: string]: any }, mode: string) {
  browser.theme.update(theme[mode]);
}

let currentTheme: { [key: string]: any };

export async function setTheme(
  theme: { [key: string]: any },
  value: string,
  mode: string
) {
  if (theme[mode].colors['frame'] === value) {
    console.log('theme is the same');
    return;
  }
  currentTheme = theme;
  updateColor(theme, value, mode);

  //const currentThemes = await browser.theme.getCurrent();
  browser.theme.update(theme[mode]);
  localStorage.setItem(mode, value);
  console.log('local storage updated');
  document.body.style.backgroundColor = value;
}

function storageAvailable(type: string) {
  try {
    let storage: Storage = (window as any)[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      // acknowledge QuotaExceededError only if there's something already stored
    );
  }
}
