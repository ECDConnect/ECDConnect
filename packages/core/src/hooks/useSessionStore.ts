import { useState, useEffect } from 'react';

type Setter = React.Dispatch<React.SetStateAction<string | undefined>>;

export const useSessionStorage = (
  key: string,
  initialValue?: string
): [string | undefined, Setter] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.sessionStorage.getItem(key);
        if (item) {
          setStoredValue(item);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key]);

  const setValue: Setter = (value) => {
    if (typeof window !== 'undefined') {
      try {
        setStoredValue(value);
        window.sessionStorage.setItem(key, String(value));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return [storedValue, setValue];
};

export default useSessionStorage;
