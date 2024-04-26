import React, { useState, useEffect } from 'react';
import ReinventedColorWheel from 'reinvented-color-wheel/react';
import 'reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import './popup.css';
import { themes, setTheme, changeMode } from './background_script';
import storage from 'utils/storage';

const Popup = () => {
  const [hex, setHex] = useState<string>(
    (themes as { [key: string]: any })['day'].colors['frame']
  );
  const [mode, setMode] = useState<string>('day');

  const onClick = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'day' ? 'night' : 'day';
      changeMode(themes, newMode);
      storage
        .set({ mode: newMode })
        .then(() => {
          console.log('mode updated in storage', newMode);
        })
        .catch((err) => {
          console.log('error setting mode in storage');
        });
      return newMode; // Return the new mode value
    });
    changeMode(themes, mode);
    console.log('button clicked');
  };

  useEffect(() => {
    setTheme(themes, hex, mode);
    console.log('theme changed');
  }, [hex]);
  return (
    <>
      <p>Hello bro</p>
      <ReinventedColorWheel
        hex={hex}
        wheelDiameter={200}
        wheelThickness={20}
        handleDiameter={16}
        wheelReflectsSaturation
        onChange={({ hex }) => {
          setHex(hex);
        }}
      />
      <input
        type="text"
        value={hex}
        onChange={(e) => {
          setHex(e.target.value);
          //updateTheme(theme, e.target.value);
        }}
      />
      <p>{`${mode}`}</p>
      <label className="switch">
        <input id="checkbox" type="checkbox" onClick={onClick} />
        <span className="slider round" />
      </label>
    </>
  );
};

export default Popup;
