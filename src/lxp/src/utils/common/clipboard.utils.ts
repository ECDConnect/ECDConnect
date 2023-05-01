export const copyToClip = async (value: string): Promise<boolean> => {
  if (navigator?.clipboard) {
    // Check if permission available and check for permission
    // Permission api not supported by ie, android browser 2023/05/01
    // https://caniuse.com/?search=permission

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
      navigator?.clipboard?.writeText(value);
    } catch {
      try {
        document.execCommand('copy', true, value);
      } catch {
        return false;
      }
    }

    return true;
  } else {
    if (document?.execCommand) {
      try {
        document.execCommand('copy', true, value);
      } catch {
        return false;
      }
    }

    return true;
  }
};
