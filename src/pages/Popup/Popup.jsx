import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import '../global.css';
import './Popup.css';
import 'reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import ReinventedColorWheel from 'reinvented-color-wheel/react';

const Popup = () => {
  const [color, setColor] = useState('#00000');
  return (
    <>
      <ReinventedColorWheel
        hex={color}
        wheelDiameter={200}
        wheelThickness={20}
        handleDiameter={16}
        wheelReflectsSaturation
        onChange={({ color }) => setColor(color)}
      />
    </>
  );
};

export default Popup;
