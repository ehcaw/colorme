import React, { useState, useEffect } from 'react';
import ReinventedColorWheel from 'reinvented-color-wheel/react';
import 'reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import './popup.css';
import { themes, setTheme, changeMode } from './background_script';
import storage from 'utils/storage';

const Popup = () => {
  const [mode, setMode] = useState<string>('');
  const [hex, setHex] = useState<string>('');

  const onClick = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'day' ? 'night' : 'day';
      changeMode(themes, newMode);
      setHex((themes[newMode] as any).colors.frame || '#FFFFFF');
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
    console.log('button clicked');
  };

  useEffect(() => {
    setTheme(themes, hex, mode);
    console.log('theme changed');
  }, [hex]);
  useEffect(() => {
    const fetchMode = async () => {
      try {
        const result = await storage.get('mode');
        const fetchedMode = result.mode || 'day'; // Provide a default mode if none is found
        setHex((themes[fetchedMode] as any).colors.frame || '#FFFFFF');
        setMode(fetchedMode);
      } catch (err) {
        console.log('Error fetching mode:', err);
        setMode('day'); // Default mode on error
        setHex('#FFFFFF'); // Default color
      }
    };
    fetchMode();
  }, []);

  return (
    <>
      <h1 className="app-name">Color Me!</h1>
      <div className="display-container">
        {hex && (
          <div>
            <ReinventedColorWheel
              hex={hex}
              wheelDiameter={300}
              wheelThickness={20}
              handleDiameter={16}
              wheelReflectsSaturation
              onChange={({ hex }) => {
                setHex(hex);
              }}
            />
          </div>
        )}
        <div className="align-items:center">
          {mode && <p>{mode == 'day' ? 'light' : 'dark'}</p>}
          <label className="switch">
            <input id="checkbox" type="checkbox" onClick={onClick} />
            <span className="slider round" />
          </label>
        </div>
      </div>
    </>
  );
};

export default Popup;
