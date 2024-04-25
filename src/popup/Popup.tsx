import React, { useState, useEffect } from 'react';
import ReinventedColorWheel from 'reinvented-color-wheel/react';
import 'reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import { themes, setTheme } from './background_script';

const Popup = () => {
  const [hex, setHex] = useState<string>(themes['day'].colors['frame']);
  /*
  const onClick = () => {
    setTheme(themes, hex);
    console.log('button clicked');
  };
  */
  useEffect(() => {
    setTheme(themes, hex);
    console.log('theme updated');
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
    </>
  );
};

export default Popup;
