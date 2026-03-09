type InstallPromptOutcome = 'accepted' | 'dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: InstallPromptOutcome }>;
  userChoice: Promise<{ outcome: InstallPromptOutcome }>;
}

const addInstallEventListeners = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    (window as any).installPrompt = e;
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
  });
};

const getInstallPromptEvent = (): BeforeInstallPromptEvent | undefined => {
  if (!(window as any).installPrompt) return undefined;
  return (window as any).installPrompt as BeforeInstallPromptEvent;
};

const isInstallationAvailable = (): boolean => {
  return !!getInstallPromptEvent();
};

const showInstallPrompt = async (): Promise<boolean> => {
  if (!getInstallPromptEvent()) {
    return false;
  }
  const result = await getInstallPromptEvent()?.prompt();
  return result?.outcome === 'accepted';
};

export default {
  addInstallEventListeners,
  isInstallationAvailable,
  showInstallPrompt,
};
