import { Button, Typography } from '@ecdlink/ui';
import React, { useState, useEffect } from 'react';

// Define the BeforeInstallPromptEvent interface for TypeScript
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [promptCount, setPromptCount] = useState(0);

  // Load prompt count from localStorage on mount
  useEffect(() => {
    console.info('PWAInstallButton - mount');
    const storedCount = parseInt(
      localStorage.getItem('installPromptCount') || '0',
      10
    );
    setPromptCount(storedCount);
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    console.info('PWAInstallButton - addEventListener');
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser prompt
      console.info('PWAInstallButton - beforeinstallprompt triggered');
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.info(
        'PWAInstallButton - setDeferredPrompt',
        e as BeforeInstallPromptEvent
      );
      // Only show prompt if displayed less than 5 times
      if (promptCount < 5) {
        setIsInstallable(true);
        // Increment and store prompt count
        const newCount = promptCount + 1;
        setPromptCount(newCount);
        localStorage.setItem('installPromptCount', newCount.toString());
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup event listener
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, [promptCount]);

  // Handle app installation
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log(`PWAInstallButton - deferredPrompt is null`);
      return;
    }

    // Show the browser's install prompt
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Reset state after prompting
    setDeferredPrompt(null);
    setIsInstallable(false);

    // If user accepts, reset prompt count (optional)
    if (outcome === 'accepted') {
      localStorage.setItem('installPromptCount', '0');
    }
  };

  // Don't show the button if prompt count >= 5 or not installable
  if (!isInstallable || promptCount >= 5) {
    console.info(
      `PWAInstallButton - not displaying ${isInstallable} ${promptCount} `
    );
    return null;
  }

  console.info('PWAInstallButton - displaying');
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      {/* <button
        onClick={handleInstallClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Install Our App
      </button> */}
      <Button
        className={'mb-4 w-full'}
        type="filled"
        color="quatenary"
        onClick={handleInstallClick}
      >
        <Typography
          type="help"
          color="white"
          text={'Install Our App'}
        ></Typography>
      </Button>
    </div>
  );
};

export default PWAInstallButton;
