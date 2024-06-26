import React, { useEffect, useState } from 'react';
import storage from 'utils/storage';
import { themes, setTheme, updateColor, ThemeType } from './background_script';

interface ColorTableProps {
  colors: string[];
  mode: string;
}
// saved colors table component
export const ColorTable = (props: ColorTableProps) => {
  const [savedColors, setSavedColors] = useState<string[]>(props.colors);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  let mode = props.mode;

  useEffect(() => {
    setSavedColors(props.colors);
  }, [props.colors]);

  const refreshColors = () => {
    setRefreshKey((prevRefreshKey) => prevRefreshKey + 1);
  };
  return (
    <div style={{ display: 'flex', overflowX: 'auto' }}>
      {savedColors.map(
        (color, index) =>
          props.mode && (
            <ColorButton
              backgroundColor={color}
              index={index}
              refreshColors={refreshColors}
              mode={mode}
            />
          )
      )}
    </div>
  );
};

interface ColorButtonProps {
  backgroundColor: string;
  index: number;
  mode: string;
}

const ColorButton = (
  props: ColorButtonProps & { refreshColors: () => void }
) => {
  const [mode, setMode] = useState<string>('');
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

  function loadSavedColor(
    theme: { [key: string]: ThemeType },
    color: string,
    mode: string
  ) {
    setTheme(themes, color, mode);
    props.refreshColors();
  }
  return (
    <button
      className="savedColors"
      style={{ backgroundColor: props.backgroundColor }}
      onClick={() => loadSavedColor(themes, props.backgroundColor, mode)}
    />
  );
};
