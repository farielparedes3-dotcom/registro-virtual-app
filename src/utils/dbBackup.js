// IndexedDB Auto-Backup & Redundancy Engine for Liceo Ana Rosa Castillo
// Ensures zero data loss even if browser localStorage is cleared or cache is purged.

const DB_NAME = 'LiceoAnaRosaCastilloDB';
const DB_VERSION = 1;
const STORE_NAME = 'academic_backups';

const DB_KEYS = [
  's_students',
  's_student_assessments',
  's_student_rp_grades',
  's_promotion_grades',
  's_student_attendance_detail',
  's_monthly_worked_days',
  's_attendance_day_dates',
  's_events',
  's_eval_configs',
  's_users',
  's_subjects',
  's_grades',
  's_grade_staff',
  's_alert_logs'
];

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Backup current localStorage state to IndexedDB asynchronously
export async function syncToIndexedDB() {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    DB_KEYS.forEach(key => {
      const val = localStorage.getItem(key);
      if (val !== null) {
        store.put(val, key);
      }
    });
    store.put(new Date().toISOString(), 'last_backup_timestamp');
  } catch (e) {
    console.warn('IndexedDB sync warning:', e);
  }
}

// Restore missing keys in localStorage from IndexedDB on startup
export async function restoreFromIndexedDBIfEmpty() {
  try {
    const db = await openDatabase();
    if (!db) return false;
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    let restoredAny = false;
    for (const key of DB_KEYS) {
      const localVal = localStorage.getItem(key);
      if (!localVal) {
        const idbVal = await new Promise((resolve) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        });
        if (idbVal) {
          localStorage.setItem(key, idbVal);
          restoredAny = true;
        }
      }
    }
    return restoredAny;
  } catch (e) {
    console.warn('IndexedDB restore warning:', e);
    return false;
  }
}

// Full Database Export to JSON File
export function exportFullDatabaseBackup() {
  const data = {
    metadata: {
      institution: 'Liceo Ana Rosa Castillo',
      district: '14-01 Nagua',
      exportDate: new Date().toISOString(),
      version: '1.0'
    },
    tables: {}
  };

  DB_KEYS.forEach(key => {
    const val = localStorage.getItem(key);
    if (val) {
      try {
        data.tables[key] = JSON.parse(val);
      } catch (e) {
        data.tables[key] = val;
      }
    }
  });

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateFormatted = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `RESPALDO_SISTEMA_LICEO_ANA_ROSA_CASTILLO_${dateFormatted}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Restore Database from imported JSON File
export function importFullDatabaseBackup(jsonData) {
  if (!jsonData || !jsonData.tables) {
    throw new Error('El archivo de respaldo no tiene el formato válido.');
  }

  Object.keys(jsonData.tables).forEach(key => {
    const val = jsonData.tables[key];
    if (typeof val === 'object') {
      localStorage.setItem(key, JSON.stringify(val));
    } else {
      localStorage.setItem(key, String(val));
    }
  });

  // Also sync immediately to IndexedDB
  syncToIndexedDB();
}
