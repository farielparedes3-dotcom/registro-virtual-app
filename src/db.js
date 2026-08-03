import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
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

// Helper: safe equals check to skip redundant writes
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
      const saved = localStorage.getItem('users');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'users'), (snapshot) => {
      const usersList = [];
      snapshot.forEach(docItem => {
        usersList.push({ id: docItem.id, ...docItem.data() });
      });
      remoteCache['users'] = JSON.stringify(usersList);
      localStorage.setItem('users', JSON.stringify(usersList));
      callback(usersList);
    });
  },
  async saveUsers(usersList) {
    if (!hasChanged('users', usersList)) return;
    localStorage.setItem('users', JSON.stringify(usersList));
    triggerFallbackUpdate('users', usersList);
    if (!isFirebaseEnabled) return;

    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const existingIds = new Set();
      querySnapshot.forEach(d => existingIds.add(d.id));

      const ops = [];
      usersList.forEach(user => {
        const { id, ...data } = user;
        ops.push({ type: 'set', ref: doc(firestore, 'users', id), data });
        existingIds.delete(id);
      });

      existingIds.forEach(id => {
        ops.push({ type: 'delete', ref: doc(firestore, 'users', id) });
      });

      for (let i = 0; i < ops.length; i += 400) {
        const batch = writeBatch(firestore);
        const chunk = ops.slice(i, i + 400);
        chunk.forEach(op => {
          if (op.type === 'set') batch.set(op.ref, op.data);
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error saving users to Firestore:', err);
    }
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
      snapshot.forEach(docItem => {
        studentsList.push({ id: docItem.id, ...docItem.data() });
      });
      remoteCache['students'] = JSON.stringify(studentsList);
      localStorage.setItem('students', JSON.stringify(studentsList));
      callback(studentsList);
    });
  },
  async saveStudents(studentsList) {
    if (!hasChanged('students', studentsList)) return;
    localStorage.setItem('students', JSON.stringify(studentsList));
    triggerFallbackUpdate('students', studentsList);
    if (!isFirebaseEnabled) return;

    try {
      const querySnapshot = await getDocs(collection(firestore, 'students'));
      const existingIds = new Set();
      querySnapshot.forEach(d => existingIds.add(d.id));

      const ops = [];
      studentsList.forEach(student => {
        const { id, ...data } = student;
        ops.push({ type: 'set', ref: doc(firestore, 'students', id), data });
        existingIds.delete(id);
      });

      existingIds.forEach(id => {
        ops.push({ type: 'delete', ref: doc(firestore, 'students', id) });
      });

      for (let i = 0; i < ops.length; i += 400) {
        const batch = writeBatch(firestore);
        const chunk = ops.slice(i, i + 400);
        chunk.forEach(op => {
          if (op.type === 'set') batch.set(op.ref, op.data);
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error saving students to Firestore:', err);
    }
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
      snapshot.forEach(docItem => {
        eventsList.push({ id: docItem.id, ...docItem.data() });
      });
      remoteCache['events'] = JSON.stringify(eventsList);
      localStorage.setItem('s_events', JSON.stringify(eventsList));
      callback(eventsList);
    });
  },
  async saveEvents(eventsList) {
    if (!hasChanged('events', eventsList)) return;
    localStorage.setItem('s_events', JSON.stringify(eventsList));
    triggerFallbackUpdate('events', eventsList);
    if (!isFirebaseEnabled) return;

    try {
      const querySnapshot = await getDocs(collection(firestore, 'events'));
      const existingIds = new Set();
      querySnapshot.forEach(d => existingIds.add(d.id));

      const ops = [];
      eventsList.forEach(event => {
        const { id, ...data } = event;
        ops.push({ type: 'set', ref: doc(firestore, 'events', id), data });
        existingIds.delete(id);
      });

      existingIds.forEach(id => {
        ops.push({ type: 'delete', ref: doc(firestore, 'events', id) });
      });

      for (let i = 0; i < ops.length; i += 400) {
        const batch = writeBatch(firestore);
        const chunk = ops.slice(i, i + 400);
        chunk.forEach(op => {
          if (op.type === 'set') batch.set(op.ref, op.data);
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error saving events to Firestore:', err);
    }
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
      snapshot.forEach(docItem => {
        logsList.push({ id: docItem.id, ...docItem.data() });
      });
      logsList.sort((a,b) => b.id - a.id);
      remoteCache['alert_logs'] = JSON.stringify(logsList);
      localStorage.setItem('s_alert_logs', JSON.stringify(logsList));
      callback(logsList);
    });
  },
  async saveAlertLogs(logsList) {
    if (!hasChanged('alert_logs', logsList)) return;
    localStorage.setItem('s_alert_logs', JSON.stringify(logsList));
    triggerFallbackUpdate('alert_logs', logsList);
    if (!isFirebaseEnabled) return;

    try {
      const querySnapshot = await getDocs(collection(firestore, 'alert_logs'));
      const existingIds = new Set();
      querySnapshot.forEach(d => existingIds.add(d.id));

      const ops = [];
      logsList.forEach(log => {
        const { id, ...data } = log;
        ops.push({ type: 'set', ref: doc(firestore, 'alert_logs', id), data });
        existingIds.delete(id);
      });

      existingIds.forEach(id => {
        ops.push({ type: 'delete', ref: doc(firestore, 'alert_logs', id) });
      });

      for (let i = 0; i < ops.length; i += 400) {
        const batch = writeBatch(firestore);
        const chunk = ops.slice(i, i + 400);
        chunk.forEach(op => {
          if (op.type === 'set') batch.set(op.ref, op.data);
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error saving alert logs to Firestore:', err);
    }
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
      snapshot.forEach(docItem => {
        conf[docItem.id] = docItem.data();
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
    localStorage.setItem('s_subjects', JSON.stringify(subjects));
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'config', 'subjects'), { data: subjects });
    } catch (e) {
      console.error('Error saving subjects to Firestore:', e);
    }
  },
  async saveGrades(grades) {
    if (!hasChanged('config_grades', grades)) return;
    localStorage.setItem('s_grades', JSON.stringify(grades));
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'config', 'grades'), { data: grades });
    } catch (e) {
      console.error('Error saving grades to Firestore:', e);
    }
  },
  async saveGradeStaff(staff) {
    if (!hasChanged('config_staff', staff)) return;
    localStorage.setItem('s_grade_staff', JSON.stringify(staff));
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'config', 'staff'), { data: staff });
    } catch (e) {
      console.error('Error saving grade staff to Firestore:', e);
    }
  },
  async saveAttendanceConfigs(monthlyDays, attendanceDates) {
    const payload = { monthlyDays, attendanceDates };
    if (!hasChanged('config_attendance', payload)) return;
    localStorage.setItem('s_monthly_worked_days', JSON.stringify(monthlyDays));
    localStorage.setItem('s_attendance_day_dates', JSON.stringify(attendanceDates));
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'config', 'attendance'), payload);
    } catch (e) {
      console.error('Error saving attendance configs to Firestore:', e);
    }
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
      snapshot.forEach(docItem => {
        const data = docItem.data();
        if (docItem.id === 'store') {
          Object.assign(configs, data.blocks || data.configs || {});
        } else if (data && data.blocks !== undefined) {
          configs[docItem.id] = data.blocks;
        }
      });
      remoteCache['eval_configs'] = JSON.stringify(configs);
      localStorage.setItem('s_eval_configs', JSON.stringify(configs));
      callback(configs);
    });
  },
  async saveEvalConfigs(configsObject) {
    if (!hasChanged('eval_configs', configsObject)) return;
    localStorage.setItem('s_eval_configs', JSON.stringify(configsObject));
    triggerFallbackUpdate('eval_configs', configsObject);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'eval_configs', 'store'), { blocks: configsObject });
    } catch (err) {
      console.error('Error saving eval configs to Firestore:', err);
    }
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
      snapshot.forEach(docItem => {
        const data = docItem.data();
        if (docItem.id === 'store') {
          Object.assign(assessments, data.ratings || data.assessments || {});
        } else if (data && data.ratings !== undefined) {
          assessments[docItem.id] = data.ratings;
        }
      });
      remoteCache['student_assessments'] = JSON.stringify(assessments);
      localStorage.setItem('s_student_assessments', JSON.stringify(assessments));
      callback(assessments);
    });
  },
  async saveStudentAssessments(assessmentsObject) {
    if (!hasChanged('student_assessments', assessmentsObject)) return;
    localStorage.setItem('s_student_assessments', JSON.stringify(assessmentsObject));
    triggerFallbackUpdate('student_assessments', assessmentsObject);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'student_assessments', 'store'), { ratings: assessmentsObject });
    } catch (err) {
      console.error('Error saving student assessments to Firestore:', err);
    }
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
      snapshot.forEach(docItem => {
        const data = docItem.data();
        if (docItem.id === 'store') {
          Object.assign(rpGrades, data.grades || {});
        } else if (data && data.grades !== undefined) {
          rpGrades[docItem.id] = data.grades;
        }
      });
      remoteCache['student_rp_grades'] = JSON.stringify(rpGrades);
      localStorage.setItem('s_student_rp_grades', JSON.stringify(rpGrades));
      callback(rpGrades);
    });
  },
  async saveStudentRpGrades(rpGradesObject) {
    if (!hasChanged('student_rp_grades', rpGradesObject)) return;
    localStorage.setItem('s_student_rp_grades', JSON.stringify(rpGradesObject));
    triggerFallbackUpdate('student_rp_grades', rpGradesObject);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'student_rp_grades', 'store'), { grades: rpGradesObject });
    } catch (err) {
      console.error('Error saving student RP grades to Firestore:', err);
    }
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
      snapshot.forEach(docItem => {
        const data = docItem.data();
        if (docItem.id === 'store') {
          Object.assign(attendance, data.detail || {});
        } else if (data && data.detail !== undefined) {
          attendance[docItem.id] = data.detail;
        }
      });
      remoteCache['student_attendance'] = JSON.stringify(attendance);
      localStorage.setItem('s_student_attendance_detail', JSON.stringify(attendance));
      callback(attendance);
    });
  },
  async saveStudentAttendance(attendanceObject) {
    if (!hasChanged('student_attendance', attendanceObject)) return;
    localStorage.setItem('s_student_attendance_detail', JSON.stringify(attendanceObject));
    triggerFallbackUpdate('student_attendance', attendanceObject);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'student_attendance', 'store'), { detail: attendanceObject });
    } catch (err) {
      console.error('Error saving student attendance to Firestore:', err);
    }
  },

  // --- 10. PROMOTION GRADES ---
  subscribePromotionGrades(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['promotion_grades']) fallbackSubscribers['promotion_grades'] = [];
      fallbackSubscribers['promotion_grades'].push(callback);
      const saved = localStorage.getItem('s_promotion_grades');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'promotion_grades'), (snapshot) => {
      const promGrades = {};
      snapshot.forEach(docItem => {
        const data = docItem.data();
        if (docItem.id === 'store') {
          Object.assign(promGrades, data.grades || {});
        } else if (data && data.grades !== undefined) {
          promGrades[docItem.id] = data.grades;
        }
      });
      remoteCache['promotion_grades'] = JSON.stringify(promGrades);
      localStorage.setItem('s_promotion_grades', JSON.stringify(promGrades));
      callback(promGrades);
    });
  },
  async savePromotionGrades(promotionGradesObject) {
    if (!hasChanged('promotion_grades', promotionGradesObject)) return;
    localStorage.setItem('s_promotion_grades', JSON.stringify(promotionGradesObject));
    triggerFallbackUpdate('promotion_grades', promotionGradesObject);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'promotion_grades', 'store'), { grades: promotionGradesObject });
    } catch (err) {
      console.error('Error saving promotion grades to Firestore:', err);
    }
  }
};
