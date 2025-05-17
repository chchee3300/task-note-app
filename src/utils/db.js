export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TaskNoteDB', 1);
        
        request.onerror = () => {
            console.error("Database error:", request.error);
            reject(request.error);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('records')) {
                db.createObjectStore('records', { keyPath: 'file' });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
}

export async function getRecord(file) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('records', 'readonly');
        const store = tx.objectStore('records');
        const req = store.get(file);
        req.onsuccess = () => resolve(req.result ? req.result.data : {tasks: [], notes: []});
        req.onerror = () => reject(req.error);
    });
}

export async function saveRecord(name, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('records', 'readwrite');
        const store = tx.objectStore('records');
        const request = store.put({
            file: name,
            data: data
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getAllFiles() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('records', 'readonly');
        const store = tx.objectStore('records');
        const request = store.getAllKeys();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteRecord(file) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('records', 'readwrite');
        const store = tx.objectStore('records');
        const request = store.delete(file);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}