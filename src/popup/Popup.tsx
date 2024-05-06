import React, { useState, useEffect } from 'react';
import ReinventedColorWheel from 'reinvented-color-wheel/react';
import 'reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import { ColorTable } from './ColorTable';
import './popup.css';
import { themes, setTheme, updateColor, changeMode } from './background_script';
import storage from 'utils/storage';

// main popup component
const Popup = () => {
  // state variable for the current mode (day || night)
  const [mode, setMode] = useState<string>('');
  //state variable for the current color selected on the wheel
  const [hex, setHex] = useState<string>('');
  // state variable for the saved colors from browser storage, default is empty array []
  const [savedColors, setSavedColors] = useState<string[]>([]);

  // function to change the mode (day/night) and update the state
  const onClick = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'day' ? 'night' : 'day';
      changeMode(themes, newMode);
      setHex((themes[newMode] as any).colors.frame || '#FFFFFF');
      document.body.style.backgroundColor = (
        themes[newMode] as any
      ).colors.frame;
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

  // function to save color to local storage
  const saveColor = async () => {
    const result = await storage.get('savedColors');
    let savedColors = JSON.parse(result.savedColors);
    savedColors.push(hex);
    storage.set({ savedColors: JSON.stringify(savedColors) });
  };

  // use effect hook to change the color, triggered when hex is changed
  useEffect(() => {
    setTheme(themes, hex, mode);
    console.log('theme changed');
  }, [hex]);

  // For changing --flip-color css to flip colors depending on the color picked
  useEffect(() => {
    // If all black, flip color to white
    if (hex == '#000000') {
      document.documentElement.style.setProperty('--flip-color', 'white');
      return;
    }
    // Grab hex and convert to cmyk
    let cmyk = hex2cmyk(hex);
    if (typeof cmyk !== 'undefined') {
      // k is basically vertical distance for square color pickers
      if (cmyk['k'] > 51) {
        document.documentElement.style.setProperty('--flip-color', 'white');
      } else {
        document.documentElement.style.setProperty('--flip-color', 'black');
      }
    }
  }, [hex]);

  // use effect hook to fetch the saved mode from local storage
  useEffect(() => {
    //document.body.style.backgroundColor = '#E4E6EB';
    const fetchMode = async () => {
      try {
        const result = await storage.get('mode');
        const fetchedMode = result.mode || 'day'; // Provide a default mode if none is found
        setHex((themes[fetchedMode] as any).colors.frame || '#FFFFFF');
        setMode(fetchedMode);
        document.body.style.backgroundColor = (
          themes[fetchedMode] as any
        ).colors.frame;
      } catch (err) {
        console.log('Error fetching mode:', err);
        setMode('day'); // Default mode on error
        setHex('#FFFFFF'); // Default color
      }
    };
    fetchMode();
  }, []);
  // use effect hook to fetch the saved colors from local storage
  useEffect(() => {
    const getSavedColors = async () => {
      let result = await storage.get('savedColors');
      console.log('saved colors from storage is', result.savedColors);
      if (result == null) {
        setSavedColors([]);
      } else {
        const colorRegex = /#[0-9a-fA-F]{6}/g;
        setSavedColors(result.savedColors.match(colorRegex));
      }
    };
    getSavedColors();
  }, []);

  useEffect(() => {
    storage.set({ savedColors: JSON.stringify(savedColors) });
  }, [savedColors]);

  return (
    <div className="font-family:-apple-system, BlinkMacSystemFont, sans-serif;">
      {/* Title header */}
      <h1 className="app-name">Color Me!</h1>

      {/* Color wheel */}
      <div className="display-container">
        {hex && (
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
        )}

        {/* Hex display */}
        <div>
          <p className="display-hex">Hex: {hex}</p>
        </div>
        {mode && <ColorTable colors={savedColors} mode={mode} />}
        {/* Light or dark theme */}
        <div>
          <div className="display-light-dark">
            {mode && <p>{mode == 'day' ? 'light' : 'dark'}</p>}
            <div style={{ display: 'flex' }}>
              <label className="switch">
                <input id="checkbox" type="checkbox" onClick={onClick} />
                <span className="slider round" />
              </label>
              <button
                className="border-radius:4px align-items: right"
                onClick={saveColor}
              >
                <span>&#43;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;

/*
function addToSavedColors(savedHex: string) {
  if (typeof themes.savedColors.colors.frame == 'undefined') {
    return;
  }

  if (themes.savedColors.colors.frame.length >= 42) {
    // setSavedColors(themes.savedColors.colors.frame.substring(7) + savedHex);
    updateSavedColors(themes.savedColors.colors.frame.substring(7) + savedHex);
  } else {
    // setSavedColors(themes.savedColors.colors.frame + savedHex);
    updateSavedColors(themes.savedColors.colors.frame + savedHex);
  }
}
*/
function hex2cmyk(hexCode: string) {
  let rgbValues = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
  if (rgbValues == null) {
    return;
  }
  let r = parseInt(rgbValues[1], 16);
  let g = parseInt(rgbValues[2], 16);
  let b = parseInt(rgbValues[3], 16);
  let computedC = 0;
  let computedM = 0;
  let computedY = 0;
  let computedK = 0;

  // BLACK
  if (r == 0 && g == 0 && b == 0) {
    computedK = 1;
    return { c: 0, m: 0, y: 0, k: 1 };
  }

  computedC = 1 - r / 255;
  computedM = 1 - g / 255;
  computedY = 1 - b / 255;
  let minCMY = Math.min(computedC, Math.min(computedM, computedY));
  computedC = Math.round(((computedC - minCMY) / (1 - minCMY)) * 100);
  computedM = Math.round(((computedM - minCMY) / (1 - minCMY)) * 100);
  computedY = Math.round(((computedY - minCMY) / (1 - minCMY)) * 100);
  computedK = Math.round(minCMY * 100);

  return { c: computedC, m: computedM, y: computedY, k: computedK };
}
