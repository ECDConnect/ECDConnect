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
  // In local dev REACT_APP_REMOTE_CONFIG_URL can be set directly; in production
  // the URL is read at runtime from settings.json (one build, multiple environments)
  const [remoteConfigUrl, setRemoteConfigUrl] = useState<string>(
    process.env.REACT_APP_REMOTE_CONFIG_URL ?? ''
  );

  useEffect(() => {
    if (remoteConfigUrl) return;
    fetch(`${window.location.origin}/settings.json`)
      .then((res) => res.json())
      .then((data: { configUrl?: string }) => {
        if (data?.configUrl) setRemoteConfigUrl(data.configUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    console.log('remote url : ', remoteConfigUrl);
    if (!isOnline || !remoteConfigUrl) return;
    console.log('current version : ', currentVersion);

    const check = () =>
      fetch(`${remoteConfigUrl}?v=${Date.now()}`)
        .then((res) => res.json())
        .then((data: { minimumAppVersion?: string }) => {
          const minimum = data?.minimumAppVersion;
          console.log('minimum version : ', minimum);

          if (minimum && isVersionBelowMinimum(currentVersion, minimum)) {
            setUpdateRequired(true);
          }
        })
        .catch(() => {
          // Network error or malformed JSON — don't block the user
        });

    check();
    const interval = setInterval(check, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOnline, remoteConfigUrl]);

  return { updateRequired };
};
