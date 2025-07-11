const validTlds = [
  '.com',
  '.org',
  '.net',
  '.edu',
  '.gov',
  '.mil',
  '.biz',
  '.info',
  '.io',
  '.co',
  '.ai',
  '.app',
  '.dev',
  '.tech',
  '.online',
  '.store',
  '.shop',
  '.ca',
  '.uk',
  '.de',
  '.fr',
  '.jp',
  '.cn',
  '.in',
  '.au',
  '.za',
];

export const isValidUrl = (url: string) => {
  if (!url || !url.trim()) {
    return false;
  }

  let tempUrl = url.trim();
  if (!/^https?:\/\//i.test(tempUrl)) {
    tempUrl = `https://${tempUrl}`;
  }

  try {
    const parsedUrl = new URL(tempUrl);
    const hostname = parsedUrl.hostname;

    // Check 1: Ensure hostname has at least one dot
    if (!hostname.includes('.')) {
      return false;
    }

    // Check 2: Reject consecutive dots in hostname
    if (hostname.includes('..')) {
      return false;
    }

    // Check 3: Validate TLD
    const hasValidTld = validTlds.some((tld) =>
      hostname.toLowerCase().endsWith(tld)
    );
    if (!hasValidTld) {
      return false;
    }

    // Check 4: Validate hostname characters (alphanumeric, dots, hyphens only)
    const validHostnamePattern = /^[a-zA-Z0-9.-]+$/;
    if (!validHostnamePattern.test(hostname)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
