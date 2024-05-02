import React, { useEffect, useReducer, useState } from 'react';
import storage from 'utils/storage';
import { themes, setTheme, ThemeType } from './background_script';
import { values } from 'lodash';

interface WebsiteColorTableProps {
  colors: string[];
  mode: string;
  update: () => void;
  getHex: () => string;
}
// saved colors table component
export var WebsiteColorTable = (props: WebsiteColorTableProps) => {
  const [savedWebsiteColors, setSavedWebsiteColors] = useState<string[]>(props.colors);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  let mode = props.mode;

  useEffect(() => {
    setSavedWebsiteColors(props.colors);
  }, [props.colors]);

  const refreshColors = () => {
    setRefreshKey((prevRefreshKey) => prevRefreshKey + 1);
  };
  return (
    <div style={{ display: 'grid'}}>
      {savedWebsiteColors.map(
        (websiteAndColor, index) =>
          props.mode && (
            <ColorButton
              websiteAndColor={websiteAndColor}
              index={index}
              refreshColors={refreshColors}
              mode={mode}
              update={props.update}
              getHex={props.getHex}
            />
          )
      )}
    </div>
  );
};

interface ColorButtonProps {
  websiteAndColor: string;
  index: number;
  mode: string;
  update: () => void;
  getHex: () => string;
}

const ColorButton = (
  props: ColorButtonProps & { refreshColors: () => void }
) => {
  const [mode, setMode] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [id, setID] = useState<string>('');
  useEffect(() => {
    const fetchMode = async () => {
      try {
        const result = await storage.get('mode');
        const fetchedMode = result.mode || 'day';
        setMode(fetchedMode);
      } catch (err) {
        console.log('error fetching mode', err);
        setMode('day');
      }
    };
    fetchMode();
  }, []);

  
  // update website and color and id
  useEffect(() => {
    setWebsite(props.websiteAndColor.split(" ")[0]);
    setColor(props.websiteAndColor.split(" ")[(props.websiteAndColor.split(" ").length) - 1]);
    let newID = "websiteColor" + props.index;
    setID(newID);
  });

  function loadSavedColor(
    theme: { [key: string]: ThemeType },
    color: string,
    mode: string
  ) {
    setTheme(themes, color, mode);
    props.refreshColors();
  }

  const changeWebsite = async (e: React.FormEvent<HTMLInputElement>) => {
    if (e == null || e.currentTarget == null || e.currentTarget.value == null) {
      return;
    }
    // Grab from storage
    let newWebsite = e.currentTarget.value;
    setWebsite(newWebsite);
    let result = await storage.get('savedWebsiteColors');
    if (result == null) return;
    let savedWebsiteColors = JSON.parse(result.savedWebsiteColors);
    let currentColor = savedWebsiteColors[props.index].split(" ")[props.websiteAndColor.split(" ").length - 1];
    let newSavedWebsiteColor = newWebsite + " " + currentColor;

    // Update array and push to storage
    console.log(newSavedWebsiteColor);
    savedWebsiteColors[props.index] = newSavedWebsiteColor;
    storage.set({ savedWebsiteColors: JSON.stringify(savedWebsiteColors) });

    // Update Popup
    props.update();
  };


  const changeColor = async () => {
    // Grab hex value on wheel
    const newColor = props.getHex();

    // Grab from storage again
    const result1 = await storage.get('savedWebsiteColors');
    if (result1 == null) return;
    const savedWebsiteColors = JSON.parse(result1.savedWebsiteColors);
    let currentWebsite = savedWebsiteColors[props.index].split(" ")[0];
    let newSavedWebsiteColor = currentWebsite + " " + newColor;

    // Update array and push to storage
    savedWebsiteColors[props.index] = newSavedWebsiteColor;
    storage.set({ savedWebsiteColors: JSON.stringify(savedWebsiteColors) });

    // Update Popup
    props.update();
  };

  const deleteWebsiteColor = async () => {
    // Grab from storage
    let result = await storage.get('savedWebsiteColors');
    if (result == null) return;
    let savedWebsiteColors = JSON.parse(result.savedWebsiteColors);

    // Update array and push to storage
    savedWebsiteColors.splice(props.index, 1);
    storage.set({ savedWebsiteColors: JSON.stringify(savedWebsiteColors) });

    // Update Popup
    props.update();
  };


  return (
    <div>
      <input
        id={id}
        type="input" 
        style={{display: "inline-block" }} 
        // value={website}
        onChange={e => changeWebsite(e)}
      />
      <button
        className="savedColorsBlackBorder"
        style={{ backgroundColor: color }}
        onClick={() => loadSavedColor(themes, color, mode)}
      />
      <button onClick={changeColor}>Edit</button>
      <button onClick={deleteWebsiteColor}>Del</button>
    </div>
  );
};
