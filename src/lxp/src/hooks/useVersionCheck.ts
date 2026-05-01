import { useEffect, useState } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

const currentVersion: string =
  process.env.REACT_APP_VERSION ?? require('../../package.json').version;

// Compares MAJOR.MINOR.PATCH only — ignores build number and env suffix (e.g. "0.0.15.1234-qa")
function isVersionBelowMinimum(current: string, minimum: string): boolean {
  const parse = (v: string): number[] =>
    v
      .split('-')[0]
      .split('.')
      .slice(0, 3)
      .map((n) => parseInt(n, 10) || 0);

  const [curMaj, curMin, curPatch] = parse(current);
  const [minMaj, minMin, minPatch] = parse(minimum);

  if (curMaj !== minMaj) return curMaj < minMaj;
  if (curMin !== minMin) return curMin < minMin;
  return curPatch < minPatch;
}

export const useVersionCheck = () => {
  const { isOnline } = useOnlineStatus();
  const [updateRequired, setUpdateRequired] = useState(false);

  useEffect(() => {
    if (!isOnline) return;

    fetch(`/settings.json?v=${Date.now()}`)
      .then((res) => res.json())
      .then((data: { minimumAppVersion?: string }) => {
        const minimum = data?.minimumAppVersion;
        if (minimum && isVersionBelowMinimum(currentVersion, minimum)) {
          setUpdateRequired(true);
        }
      })
      .catch(() => {
        // Network error or malformed JSON — don't block the user
      });
  }, [isOnline]);

  return { updateRequired };
};
