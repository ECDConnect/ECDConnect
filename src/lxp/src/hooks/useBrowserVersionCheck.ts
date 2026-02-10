export const useBrowserVersionCheck = () => {
  const checkBrowserVersion = () => {
    const ua = navigator.userAgent;

    // Chrome / Chromium
    const chromeMatch = new RegExp(/Chrome\/(\d+)/).exec(ua);
    if (chromeMatch) {
      const version = Number.parseInt(chromeMatch[1], 10);
      const MIN_CHROME = 141;
      if (version < MIN_CHROME) {
        return true;
      }
    }

    // iOS Safari
    const isLikelyIOS = /iPhone|iPad|iPod/.test(ua);
    const safariMatch = new RegExp(
      /Version\/(\d+)\.\d+(?:\.\d+)? .*Safari\//
    ).exec(ua);
    if (isLikelyIOS && safariMatch) {
      const version = Number.parseInt(safariMatch[1], 10);
      const MIN_SAFARI = 17;
      if (version < MIN_SAFARI) {
        return true;
      }
    }

    return false;
  };

  return checkBrowserVersion();
};
