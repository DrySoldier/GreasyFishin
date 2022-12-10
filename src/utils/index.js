import { useState, useCallback } from 'react';

export const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const useComponentSize = () => {
  const [fishinBarSize, setSize] = useState(null);

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [fishinBarSize, onLayout];
};
