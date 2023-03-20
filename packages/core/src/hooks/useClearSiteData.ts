function useClearSiteData() {
  const clear = async () => {
    const caches = await window?.caches?.keys();
    caches.forEach((name) => name && window.caches.delete(name));

    const indexedDBs = await window?.indexedDB?.databases();
    indexedDBs.forEach((db) => {
      db.name && window.indexedDB.deleteDatabase(db.name);
    });

    window.localStorage.clear();

    window.sessionStorage.clear();

    const allCookies = document.cookie.split(';');
    allCookies.forEach((cookie) => (document.cookie = cookie + 'max-age=0'));
  };

  return clear;
}

export default useClearSiteData;
