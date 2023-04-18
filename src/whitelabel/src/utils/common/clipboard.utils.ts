export const copyToClip = (value: string) => {
  if (
    window.navigator.userAgent.toLowerCase().includes('iphone') ||
    window.navigator.userAgent.toLowerCase().includes('mac')
  ) {
    document.execCommand('copy', true, value);
  } else {
    window.navigator.clipboard.writeText(value);
  }
};
