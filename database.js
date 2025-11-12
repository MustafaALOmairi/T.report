// database.js
// هذا الملف مسؤول عن جميع عمليات قاعدة البيانات (IndexedDB)

const DB_NAME = 'TimeReportDB';
const DB_VERSION = 1;
const STORE_NAME = 'reports';

// فتح قاعدة البيانات وإنشاء المتجر إذا لم يكن موجودًا
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('IndexedDB failed to open');
            reject(request.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                console.log('Creating new object store...');
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                
                // إنشاء فهارس لتسريع البحث
                objectStore.createIndex('mv', 'mv', { unique: false });
                objectStore.createIndex('voy', 'voy', { unique: false });
                objectStore.createIndex('date', 'date', { unique: false });
                objectStore.createIndex('yardno', 'yardno', { unique: false });
                objectStore.createIndex('berth', 'berth', { unique: false });
                objectStore.createIndex('pamsDone', 'pamsDone', { unique: false });
            }
            resolve(db);
        };
    });
}

// إضافة تقرير جديد أو تحديث تقرير موجود
function saveReport(reportData) {
    return openDB().then(db => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = reportData.id 
            ? store.put(reportData) // تحديث
            : store.add(reportData); // إضافة جديد

        request.onsuccess = () => {
            console.log('Report saved successfully:', reportData);
        };

        request.onerror = (event) => {
            console.error('Failed to save report:', event.target.error);
        };
    });
}

// جلب جميع التقارير (مع دعم للفلترة والترحيم)
function getAllReports() {
    return openDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}

// البحث عن تقرير واحد باستخدام معرفه الفريد
function getReportById(id) {
    return openDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}

// حذف تقرير
function deleteReport(id) {
    return openDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('Report deleted successfully:', id);
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}