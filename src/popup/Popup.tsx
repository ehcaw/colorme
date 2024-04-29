import React, { useState, useEffect } from 'react';
import ReinventedColorWheel from 'reinvented-color-wheel/react';
import 'reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import './popup.css';
import { themes, setTheme, updateColor, changeMode, updateSavedColors } from './background_script';
import storage from 'utils/storage';

const Popup = () => {
  const [mode, setMode] = useState<string>('');
  const [hex, setHex] = useState<string>('');
  const [savedColors, setSavedColors] = useState<string>('');

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

  const loadSavedColor0 = () => {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }
    let savedColors = themes.savedColors.colors.frame.split(/(?=(?:.......)*$)/);
    setHex(savedColors[0]);
  }
  const loadSavedColor1 = () => {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }
    let savedColors = themes.savedColors.colors.frame.split(/(?=(?:.......)*$)/);
    setHex(savedColors[1]);
  }
  const loadSavedColor2 = () => {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }
    let savedColors = themes.savedColors.colors.frame.split(/(?=(?:.......)*$)/);
    setHex(savedColors[2]);
  }
  const loadSavedColor3 = () => {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }
    let savedColors = themes.savedColors.colors.frame.split(/(?=(?:.......)*$)/);
    setHex(savedColors[3]);
  }
  const loadSavedColor4 = () => {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }
    let savedColors = themes.savedColors.colors.frame.split(/(?=(?:.......)*$)/);
    setHex(savedColors[4]);
  }
  const loadSavedColor5 = () => {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }
    let savedColors = themes.savedColors.colors.frame.split(/(?=(?:.......)*$)/);
    setHex(savedColors[5]);
  }

  useEffect(() => {
    setTheme(themes, hex, mode);
    console.log('theme changed');
  }, [hex]);


  // For changing --flip-color css to flip colors depending on the color picked
  useEffect(() => {
    // If all black, flip color to white
    if (hex == "#000000") {
      document.documentElement.style.setProperty('--flip-color', 'white');
      return;
    }

    // Grab hex and convert to cmyk
    var cmyk = hex2cmyk(hex);
    if (typeof (cmyk) !== 'undefined') {
      // k is basically vertical distance for square color pickers
      if (cmyk['k'] > 51) {
        document.documentElement.style.setProperty('--flip-color', 'white');
      } else {
        document.documentElement.style.setProperty('--flip-color', 'black');
      }
    }
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

  useEffect(() => {

  });

  function addToSavedColors(savedHex: string) {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }

    if (themes.savedColors.colors.frame.length >= 42) {
      setSavedColors(themes.savedColors.colors.frame.substring(7) + savedHex);
      updateSavedColors(themes.savedColors.colors.frame.substring(7) + savedHex);
    } else {
      setSavedColors(themes.savedColors.colors.frame + savedHex);
      updateSavedColors(themes.savedColors.colors.frame + savedHex);
    }
  };

  useEffect(() => {
    if (typeof (themes.savedColors.colors.frame) == 'undefined') {
      return;
    }
    let savedColors = themes.savedColors.colors.frame.split(/(?=(?:.......)*$)/);

    document.documentElement.style.setProperty('--saved-color5', savedColors[5]);
    document.documentElement.style.setProperty('--saved-color4', savedColors[4]);
    document.documentElement.style.setProperty('--saved-color3', savedColors[3]);
    document.documentElement.style.setProperty('--saved-color1', savedColors[2]);
    document.documentElement.style.setProperty('--saved-color2', savedColors[1]);
    document.documentElement.style.setProperty('--saved-color0', savedColors[0]);


    console.log(savedColors);
  });


  return (
    <>
      {/* Title header */}
      <h1 className="app-name">Color Me!</h1>

      {/* Color wheel */}
      <div className="display-container">
        {hex && (
          <div
            onMouseUp={() => {
              addToSavedColors(hex);
            }}
          >
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
        { /* Saved colors */}
        <div>
          <button className="savedColors savedColors0" onClick={loadSavedColor0}></button>
          <button className="savedColors savedColors1" onClick={loadSavedColor1}></button>
          <button className="savedColors savedColors2" onClick={loadSavedColor2}></button>
          <button className="savedColors savedColors3" onClick={loadSavedColor3}></button>
          <button className="savedColors savedColors4" onClick={loadSavedColor4}></button>
          <button className="savedColors savedColors5" onClick={loadSavedColor5}></button>
        </div>

        {/* Hex display */}
        <div>
          <p className="display-hex">Hex: {hex}</p>
        </div>

        {/* Light or dark theme */}
        <div className="display-light-dark">
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


function hex2cmyk(hexCode: string) {

  var rgbValues = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
  if (rgbValues == null) {
    return;
  }
  var r = parseInt(rgbValues[1], 16);
  var g = parseInt(rgbValues[2], 16);
  var b = parseInt(rgbValues[3], 16);

  var computedC = 0;
  var computedM = 0;
  var computedY = 0;
  var computedK = 0;

  // BLACK
  if (r == 0 && g == 0 && b == 0) {
    computedK = 1;
    return { c: 0, m: 0, y: 0, k: 1 };
  }

  computedC = 1 - (r / 255);
  computedM = 1 - (g / 255);
  computedY = 1 - (b / 255);

  var minCMY = Math.min(computedC,
    Math.min(computedM, computedY));
  computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100);
  computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100);
  computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100);
  computedK = Math.round(minCMY * 100);

  return { c: computedC, m: computedM, y: computedY, k: computedK };
}