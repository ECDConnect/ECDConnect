export const copyToClip = async (value: string): Promise<boolean> => {
  if (navigator?.clipboard) {
    // Check if permission available and check for permission
    // Permission api not supported by ie, android browser 2023/05/01
    // https://caniuse.com/?search=permission

    if (
      window.navigator.userAgent.toLowerCase().includes('iphone') ||
      window.navigator.userAgent.toLowerCase().includes('mac')
    ) {
      navigator?.clipboard?.writeText && navigator?.clipboard?.writeText(value);
      return true;
    }

    if (navigator?.permissions) {
      const permissionName = 'clipboard-write' as PermissionName;
      let permissionResult = await navigator?.permissions?.query({
        name: permissionName,
      });
      if (
        permissionResult.state !== 'granted' &&
        permissionResult.state !== 'prompt'
      )
        return false;
    }

    try {
      navigator?.clipboard?.writeText && navigator?.clipboard?.writeText(value);
    } catch {
      try {
        document?.execCommand && document?.execCommand('copy', true, value);
      } catch {
        return false;
      }
    }

    return true;
  } else {
    try {
      document?.execCommand && document.execCommand('copy', true, value);
    } catch {
      return false;
    }
  }

  return true;
};
