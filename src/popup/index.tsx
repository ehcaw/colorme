import React from 'react';
import ReactDOM from 'react-dom/client';
import { browser } from 'webextension-polyfill-ts';
import Popup from './Popup';
import storage from 'utils/storage';
import { themes } from './background_script';

const Index = () => <Popup />;

let currentMode = '';

const updateCheckboxState = () => {
  storage
    .get('mode')
    .then((result) => {
      const currentMode = result.mode === 'night';
      const checkbox = document.getElementById('checkbox') as HTMLInputElement;
      checkbox.checked = currentMode;
      console.log('checkbox state updated');
    })
    .catch((err) => {
      console.log('error getting mode from storage', err);
    });
  storage.get(currentMode).then((result) => {});
};

const onOpen = async () => {
  const getCurrentMode = async (): Promise<'day' | 'night' | ''> => {
    try {
      const result = await storage.get('mode');
      if (result.mode === 'day' || result.mode === 'night') {
        return result.mode;
      }
      return '';
    } catch (err) {
      return '';
    }
  };

  const currentMode = await getCurrentMode();

  if (currentMode === 'day' || currentMode === 'night') {
    browser.theme.update(themes[currentMode]);
  } else {
    // Handle the case where currentMode is '' or any other non-valid key
    console.error('Invalid mode:', currentMode);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateCheckboxState();
});

const root = ReactDOM.createRoot(document.getElementById('display-container')!);
root.render(<Index />);
