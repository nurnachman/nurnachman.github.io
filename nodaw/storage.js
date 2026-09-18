window.Storage = (function () {
  const DB_NAME = 'appliance-db';
  const DB_VERSION = 1;
  const PAD_STORE = 'pads';
  const BLOB_STORE = 'blobs';
  const STATE_STORE = 'globalState';

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(PAD_STORE)) {
          db.createObjectStore(PAD_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(BLOB_STORE)) {
          db.createObjectStore(BLOB_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STATE_STORE)) {
          db.createObjectStore(STATE_STORE, { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
    return dbPromise;
  }

  async function savePad(padId, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PAD_STORE, 'readwrite');
      tx.objectStore(PAD_STORE).put(Object.assign({ id: padId }, data));
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async function loadAllPads() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PAD_STORE, 'readonly');
      const req = tx.objectStore(PAD_STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function saveSampleBlob(padId, blob) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(BLOB_STORE, 'readwrite');
      tx.objectStore(BLOB_STORE).put({ id: padId, blob });
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async function loadAllSampleBlobs() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(BLOB_STORE, 'readonly');
      const req = tx.objectStore(BLOB_STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function saveGlobalState(data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STATE_STORE, 'readwrite');
      tx.objectStore(STATE_STORE).put(Object.assign({ key: 'state' }, data));
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async function loadGlobalState() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STATE_STORE, 'readonly');
      const req = tx.objectStore(STATE_STORE).get('state');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  return {
    savePad,
    loadAllPads,
    saveSampleBlob,
    loadAllSampleBlobs,
    saveGlobalState,
    loadGlobalState,
  };
})();