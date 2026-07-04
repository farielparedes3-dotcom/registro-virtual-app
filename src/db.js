import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  getDocs
} from 'firebase/firestore';

// Firebase credentials loaded from Vite env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseEnabled = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app = null;
let firestore = null;

if (isFirebaseEnabled) {
  try {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    console.log('⚡ Firebase Cloud Database initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
  }
} else {
  console.log('ℹ️ Operating in Offline Fallback Mode (localStorage). Set VITE_FIREBASE_* env variables to enable Cloud Sync.');
}

// Memory caches to prevent infinite write loops in useEffects
const remoteCache = {};

// Helper: safe equals check to skip writes
const hasChanged = (key, data) => {
  const serialized = JSON.stringify(data);
  if (remoteCache[key] === serialized) {
    return false;
  }
  remoteCache[key] = serialized;
  return true;
};

// LocalStorage fallback listeners list
const fallbackSubscribers = {};
const triggerFallbackUpdate = (key, data) => {
  if (fallbackSubscribers[key]) {
    fallbackSubscribers[key].forEach(cb => cb(data));
  }
};

export const dbService = {
  isEnabled: isFirebaseEnabled,

  // --- 1. USERS COLLECTION ---
  subscribeUsers(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['users']) fallbackSubscribers['users'] = [];
      fallbackSubscribers['users'].push(callback);
      // load initial
      const saved = localStorage.getItem('users');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'users'), (snapshot) => {
      const usersList = [];
      snapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      remoteCache['users'] = JSON.stringify(usersList);
      callback(usersList);
    });
  },
  async saveUsers(usersList) {
    if (!hasChanged('users', usersList)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('users', JSON.stringify(usersList));
      triggerFallbackUpdate('users', usersList);
      return;
    }
    // Sync array to Firestore individual documents
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'users'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    usersList.forEach(user => {
      const { id, ...data } = user;
      const ref = doc(firestore, 'users', id);
      batch.set(ref, data);
      existingIds.delete(id);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'users', id));
    });

    await batch.commit();
  },

  // --- 2. STUDENTS COLLECTION ---
  subscribeStudents(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['students']) fallbackSubscribers['students'] = [];
      fallbackSubscribers['students'].push(callback);
      const saved = localStorage.getItem('students');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'students'), (snapshot) => {
      const studentsList = [];
      snapshot.forEach(doc => {
        studentsList.push({ id: doc.id, ...doc.data() });
      });
      remoteCache['students'] = JSON.stringify(studentsList);
      callback(studentsList);
    });
  },
  async saveStudents(studentsList) {
    if (!hasChanged('students', studentsList)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('students', JSON.stringify(studentsList));
      triggerFallbackUpdate('students', studentsList);
      return;
    }
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'students'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    studentsList.forEach(student => {
      const { id, ...data } = student;
      const ref = doc(firestore, 'students', id);
      batch.set(ref, data);
      existingIds.delete(id);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'students', id));
    });

    await batch.commit();
  },

  // --- 3. CALENDAR EVENTS ---
  subscribeEvents(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['events']) fallbackSubscribers['events'] = [];
      fallbackSubscribers['events'].push(callback);
      const saved = localStorage.getItem('s_events');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'events'), (snapshot) => {
      const eventsList = [];
      snapshot.forEach(doc => {
        eventsList.push({ id: doc.id, ...doc.data() });
      });
      remoteCache['events'] = JSON.stringify(eventsList);
      callback(eventsList);
    });
  },
  async saveEvents(eventsList) {
    if (!hasChanged('events', eventsList)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_events', JSON.stringify(eventsList));
      triggerFallbackUpdate('events', eventsList);
      return;
    }
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'events'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    eventsList.forEach(event => {
      const { id, ...data } = event;
      const ref = doc(firestore, 'events', id);
      batch.set(ref, data);
      existingIds.delete(id);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'events', id));
    });

    await batch.commit();
  },

  // --- 4. ALERT WARNING LOGS ---
  subscribeAlertLogs(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['alert_logs']) fallbackSubscribers['alert_logs'] = [];
      fallbackSubscribers['alert_logs'].push(callback);
      const saved = localStorage.getItem('s_alert_logs');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'alert_logs'), (snapshot) => {
      const logsList = [];
      snapshot.forEach(doc => {
        logsList.push({ id: doc.id, ...doc.data() });
      });
      logsList.sort((a,b) => b.id - a.id);
      remoteCache['alert_logs'] = JSON.stringify(logsList);
      callback(logsList);
    });
  },
  async saveAlertLogs(logsList) {
    if (!hasChanged('alert_logs', logsList)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_alert_logs', JSON.stringify(logsList));
      triggerFallbackUpdate('alert_logs', logsList);
      return;
    }
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'alert_logs'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    logsList.forEach(log => {
      const { id, ...data } = log;
      const ref = doc(firestore, 'alert_logs', id);
      batch.set(ref, data);
      existingIds.delete(id);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'alert_logs', id));
    });

    await batch.commit();
  },

  // --- 5. GLOBAL CONFIGS (Subjects, Grades, Staff, Attendance) ---
  subscribeConfig(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['config']) fallbackSubscribers['config'] = [];
      fallbackSubscribers['config'].push(callback);
      const subjects = localStorage.getItem('s_subjects');
      const grades = localStorage.getItem('s_grades');
      const staff = localStorage.getItem('s_grade_staff');
      const monthlyDays = localStorage.getItem('s_monthly_worked_days');
      const attendanceDates = localStorage.getItem('s_attendance_day_dates');

      callback({
        subjects: subjects ? JSON.parse(subjects) : null,
        grades: grades ? JSON.parse(grades) : null,
        staff: staff ? JSON.parse(staff) : null,
        monthlyDays: monthlyDays ? JSON.parse(monthlyDays) : null,
        attendanceDates: attendanceDates ? JSON.parse(attendanceDates) : null
      });
      return () => {};
    }

    return onSnapshot(collection(firestore, 'config'), (snapshot) => {
      const conf = {};
      snapshot.forEach(doc => {
        conf[doc.id] = doc.data();
      });
      remoteCache['config'] = JSON.stringify(conf);
      callback({
        subjects: conf['subjects']?.data || null,
        grades: conf['grades']?.data || null,
        staff: conf['staff']?.data || null,
        monthlyDays: conf['attendance']?.monthlyDays || null,
        attendanceDates: conf['attendance']?.attendanceDates || null
      });
    });
  },
  async saveSubjects(subjects) {
    if (!hasChanged('config_subjects', subjects)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_subjects', JSON.stringify(subjects));
      return;
    }
    await setDoc(doc(firestore, 'config', 'subjects'), { data: subjects });
  },
  async saveGrades(grades) {
    if (!hasChanged('config_grades', grades)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_grades', JSON.stringify(grades));
      return;
    }
    await setDoc(doc(firestore, 'config', 'grades'), { data: grades });
  },
  async saveGradeStaff(staff) {
    if (!hasChanged('config_staff', staff)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_grade_staff', JSON.stringify(staff));
      return;
    }
    await setDoc(doc(firestore, 'config', 'staff'), { data: staff });
  },
  async saveAttendanceConfigs(monthlyDays, attendanceDates) {
    const payload = { monthlyDays, attendanceDates };
    if (!hasChanged('config_attendance', payload)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_monthly_worked_days', JSON.stringify(monthlyDays));
      localStorage.setItem('s_attendance_day_dates', JSON.stringify(attendanceDates));
      return;
    }
    await setDoc(doc(firestore, 'config', 'attendance'), payload);
  },

  // --- 6. EVALUATION INSTRUMENT CONFIGURATIONS ---
  subscribeEvalConfigs(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['eval_configs']) fallbackSubscribers['eval_configs'] = [];
      fallbackSubscribers['eval_configs'].push(callback);
      const saved = localStorage.getItem('s_eval_configs');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'eval_configs'), (snapshot) => {
      const configs = {};
      snapshot.forEach(doc => {
        configs[doc.id] = doc.data().blocks;
      });
      remoteCache['eval_configs'] = JSON.stringify(configs);
      callback(configs);
    });
  },
  async saveEvalConfigs(configsObject) {
    if (!hasChanged('eval_configs', configsObject)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_eval_configs', JSON.stringify(configsObject));
      triggerFallbackUpdate('eval_configs', configsObject);
      return;
    }
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'eval_configs'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    Object.keys(configsObject).forEach(key => {
      const ref = doc(firestore, 'eval_configs', key);
      batch.set(ref, { blocks: configsObject[key] });
      existingIds.delete(key);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'eval_configs', id));
    });

    await batch.commit();
  },

  // --- 7. STUDENT ASSESSMENTS (RUBRIC CRITERIA RATINGS) ---
  subscribeStudentAssessments(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['student_assessments']) fallbackSubscribers['student_assessments'] = [];
      fallbackSubscribers['student_assessments'].push(callback);
      const saved = localStorage.getItem('s_student_assessments');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'student_assessments'), (snapshot) => {
      const assessments = {};
      snapshot.forEach(doc => {
        assessments[doc.id] = doc.data().ratings;
      });
      remoteCache['student_assessments'] = JSON.stringify(assessments);
      callback(assessments);
    });
  },
  async saveStudentAssessments(assessmentsObject) {
    if (!hasChanged('student_assessments', assessmentsObject)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_student_assessments', JSON.stringify(assessmentsObject));
      triggerFallbackUpdate('student_assessments', assessmentsObject);
      return;
    }
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'student_assessments'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    Object.keys(assessmentsObject).forEach(key => {
      const ref = doc(firestore, 'student_assessments', key);
      batch.set(ref, { ratings: assessmentsObject[key] });
      existingIds.delete(key);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'student_assessments', id));
    });

    await batch.commit();
  },

  // --- 8. STUDENT FINAL/PERIOD GRADES ---
  subscribeStudentRpGrades(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['student_rp_grades']) fallbackSubscribers['student_rp_grades'] = [];
      fallbackSubscribers['student_rp_grades'].push(callback);
      const saved = localStorage.getItem('s_student_rp_grades');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'student_rp_grades'), (snapshot) => {
      const rpGrades = {};
      snapshot.forEach(doc => {
        rpGrades[doc.id] = doc.data().grades;
      });
      remoteCache['student_rp_grades'] = JSON.stringify(rpGrades);
      callback(rpGrades);
    });
  },
  async saveStudentRpGrades(rpGradesObject) {
    if (!hasChanged('student_rp_grades', rpGradesObject)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_student_rp_grades', JSON.stringify(rpGradesObject));
      triggerFallbackUpdate('student_rp_grades', rpGradesObject);
      return;
    }
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'student_rp_grades'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    Object.keys(rpGradesObject).forEach(key => {
      const ref = doc(firestore, 'student_rp_grades', key);
      batch.set(ref, { grades: rpGradesObject[key] });
      existingIds.delete(key);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'student_rp_grades', id));
    });

    await batch.commit();
  },

  // --- 9. STUDENT ATTENDANCE DETAILS ---
  subscribeStudentAttendance(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['student_attendance']) fallbackSubscribers['student_attendance'] = [];
      fallbackSubscribers['student_attendance'].push(callback);
      const saved = localStorage.getItem('s_student_attendance_detail');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'student_attendance'), (snapshot) => {
      const attendance = {};
      snapshot.forEach(doc => {
        attendance[doc.id] = doc.data().detail;
      });
      remoteCache['student_attendance'] = JSON.stringify(attendance);
      callback(attendance);
    });
  },
  async saveStudentAttendance(attendanceObject) {
    if (!hasChanged('student_attendance', attendanceObject)) return;
    if (!isFirebaseEnabled) {
      localStorage.setItem('s_student_attendance_detail', JSON.stringify(attendanceObject));
      triggerFallbackUpdate('student_attendance', attendanceObject);
      return;
    }
    const batch = writeBatch(firestore);
    const querySnapshot = await getDocs(collection(firestore, 'student_attendance'));
    const existingIds = new Set();
    querySnapshot.forEach(doc => existingIds.add(doc.id));

    Object.keys(attendanceObject).forEach(key => {
      const ref = doc(firestore, 'student_attendance', key);
      batch.set(ref, { detail: attendanceObject[key] });
      existingIds.delete(key);
    });

    existingIds.forEach(id => {
      batch.delete(doc(firestore, 'student_attendance', id));
    });

    await batch.commit();
  }
};
