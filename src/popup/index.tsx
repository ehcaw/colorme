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
browser.runtime.onStartup.addListener(() => {
  updateCheckboxState();
});

const root = ReactDOM.createRoot(document.getElementById('display-container')!);
root.render(<Index />);
