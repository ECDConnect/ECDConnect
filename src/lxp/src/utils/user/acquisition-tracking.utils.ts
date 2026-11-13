import { LocalStorageKeys } from '@ecdlink/core';

export const UNKNOWN_UTM = 'Unknown';

export type AcquisitionTracking = {
  acquisitionUrl?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

const hasRealUtm = (tracking?: AcquisitionTracking): boolean => {
  if (!tracking) return false;

  return [tracking.utmSource, tracking.utmMedium, tracking.utmCampaign].some(
    (value) => !!value && value !== UNKNOWN_UTM
  );
};

const readStoredAcquisitionTracking = (): AcquisitionTracking | undefined => {
  try {
    const raw = localStorage.getItem(LocalStorageKeys.acquisitionTracking);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as Partial<AcquisitionTracking>;
    return {
      acquisitionUrl: parsed.acquisitionUrl,
      utmSource: parsed.utmSource?.trim() || UNKNOWN_UTM,
      utmMedium: parsed.utmMedium?.trim() || UNKNOWN_UTM,
      utmCampaign: parsed.utmCampaign?.trim() || UNKNOWN_UTM,
    };
  } catch {
    return undefined;
  }
};

const persistAcquisitionTracking = (tracking: AcquisitionTracking): void => {
  try {
    localStorage.setItem(
      LocalStorageKeys.acquisitionTracking,
      JSON.stringify(tracking)
    );
  } catch {
    // Ignore quota / private-mode failures; registration will fall back to Unknown.
  }
};

export const captureAcquisitionTracking = (
  href: string = typeof window !== 'undefined' ? window.location.href : ''
): void => {
  if (!href || typeof window === 'undefined') return;

  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return;
  }

  const params = url.searchParams;
  const utmSource = params.get('utm_source')?.trim() || '';
  const utmMedium = params.get('utm_medium')?.trim() || '';
  const utmCampaign = params.get('utm_campaign')?.trim() || '';
  const hasUtmOnUrl = !!(utmSource || utmMedium || utmCampaign);

  const existing = readStoredAcquisitionTracking();
  if (hasRealUtm(existing)) return;
  if (existing && !hasUtmOnUrl) return;

  persistAcquisitionTracking({
    acquisitionUrl: href,
    utmSource: utmSource || UNKNOWN_UTM,
    utmMedium: utmMedium || UNKNOWN_UTM,
    utmCampaign: utmCampaign || UNKNOWN_UTM,
  });
};

export const getAcquisitionTracking = (): AcquisitionTracking => {
  const stored = readStoredAcquisitionTracking();

  return {
    acquisitionUrl: stored?.acquisitionUrl,
    utmSource: stored?.utmSource || UNKNOWN_UTM,
    utmMedium: stored?.utmMedium || UNKNOWN_UTM,
    utmCampaign: stored?.utmCampaign || UNKNOWN_UTM,
  };
};

export const clearAcquisitionTracking = (): void => {
  try {
    localStorage.removeItem(LocalStorageKeys.acquisitionTracking);
  } catch {
    // Ignore storage failures.
  }
};
