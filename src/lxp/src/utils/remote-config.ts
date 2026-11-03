export type RemoteConfig = {
  minimumAppVersion?: string;
  // Set this to true in the environment remote-config.json when the Open
  // Access help WhatsApp line is working again. No app release is required.
  whatsAppHelpAvailable?: boolean;
};

let latest: RemoteConfig | null = null;
let resolvedUrl: string | null = null;

export function getRemoteConfig(): RemoteConfig | null {
  return latest;
}

async function resolveRemoteConfigUrl(): Promise<string> {
  if (resolvedUrl !== null) return resolvedUrl;

  const fromEnv = import.meta.env.REACT_APP_REMOTE_CONFIG_URL ?? '';
  if (fromEnv) {
    resolvedUrl = fromEnv;
    return resolvedUrl;
  }

  try {
    const res = await fetch(`${window.location.origin}/settings.json`);
    const data = (await res.json()) as { configUrl?: string };
    resolvedUrl = data?.configUrl ?? '';
  } catch {
    resolvedUrl = '';
  }

  return resolvedUrl;
}

export async function refreshRemoteConfig(): Promise<RemoteConfig | null> {
  const url = await resolveRemoteConfigUrl();
  if (!url) return latest;

  try {
    const res = await fetch(`${url}?v=${Date.now()}`);
    if (!res.ok) return latest;
    const data = (await res.json()) as RemoteConfig;
    if (!data || typeof data !== 'object') return latest;
    latest = data;
    return data;
  } catch {
    return latest;
  }
}

// Open Access help stays on the notice until remote config turns the line on.
// Other tenants keep their own WhatsApp number.
export function shouldOpenWhatsAppHelp(
  isOpenAccess: boolean,
  config: RemoteConfig | null | undefined
): boolean {
  if (!isOpenAccess) return true;
  return config?.whatsAppHelpAvailable === true;
}
