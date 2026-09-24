import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  writeBatch,
  getDocs,
  enableIndexedDbPersistence
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
    enableIndexedDbPersistence(firestore).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Firestore offline persistence failed-precondition (multiple tabs open).');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Firestore offline persistence unimplemented (browser not supported).');
      }
    });
    console.log('⚡ Firebase Cloud Database initialized successfully with offline persistence.');
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

// Helper: sanitize objects before passing to Firestore (Firestore rejects `undefined` values)
function sanitizeFirestoreData(obj) {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => sanitizeFirestoreData(item));
  }

  const clean = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === undefined) {
      if (key === 'attendance') {
        clean[key] = {};
      }
    } else if (val !== null && typeof val === 'object') {
      clean[key] = sanitizeFirestoreData(val);
    } else {
      clean[key] = val;
    }
  }

  // Special check for student objects: ensure attendance is never undefined
  if (clean.attendance === undefined && (clean.name || clean.number || clean.grade || clean.id)) {
    clean.attendance = {};
  }

  return clean;
}

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
      const saved = localStorage.getItem('s_users');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'users'), (snapshot) => {
      const usersList = [];
      snapshot.forEach(docItem => {
        usersList.push({ id: docItem.id, ...docItem.data() });
      });
      remoteCache['users'] = JSON.stringify(usersList);
      localStorage.setItem('s_users', JSON.stringify(usersList));
      callback(usersList);
    });
  },
  async saveUsers(usersList) {
    if (!hasChanged('users', usersList)) return;
    localStorage.setItem('s_users', JSON.stringify(usersList));
    triggerFallbackUpdate('users', usersList);
    if (!isFirebaseEnabled) return;

    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const existingIds = new Set();
      querySnapshot.forEach(d => existingIds.add(d.id));

      const ops = [];
      (usersList || []).forEach(user => {
        if (!user || !user.id) return;
        const cleanUser = sanitizeFirestoreData(user);
        const { id, ...data } = cleanUser;
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
          if (op.type === 'set') batch.set(op.ref, op.data, { merge: true });
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error no bloqueante al guardar usuarios en Firestore:', err);
    }
  },
  async updateUser(userId, partialData) {
    if (!userId) return;
    try {
      const savedUsers = JSON.parse(localStorage.getItem('s_users') || '[]');
      const updatedUsers = savedUsers.map(u => {
        if (u.id === userId || u.uid === userId) {
          return { ...u, ...partialData };
        }
        return u;
      });
      localStorage.setItem('s_users', JSON.stringify(updatedUsers));
      triggerFallbackUpdate('users', updatedUsers);
      
      if (isFirebaseEnabled) {
        const userRef = doc(firestore, 'users', userId);
        const cleanData = sanitizeFirestoreData(partialData);
        await setDoc(userRef, cleanData, { merge: true });
      }
    } catch (err) {
      console.error('Error no bloqueante al actualizar usuario en Firestore:', err);
    }
  },

  // --- 2. STUDENTS COLLECTION ---
  subscribeStudents(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['students']) fallbackSubscribers['students'] = [];
      fallbackSubscribers['students'].push(callback);
      const saved = localStorage.getItem('s_students');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'students'), (snapshot) => {
      const studentsList = [];
      snapshot.forEach(docItem => {
        studentsList.push({ id: docItem.id, ...docItem.data() });
      });
      remoteCache['students'] = JSON.stringify(studentsList);
      localStorage.setItem('s_students', JSON.stringify(studentsList));
      callback(studentsList);
    });
  },
  async saveStudents(studentsList) {
    if (!hasChanged('students', studentsList)) return;
    localStorage.setItem('s_students', JSON.stringify(studentsList));
    triggerFallbackUpdate('students', studentsList);
    if (!isFirebaseEnabled) return;

    try {
      const querySnapshot = await getDocs(collection(firestore, 'students'));
      const existingIds = new Set();
      querySnapshot.forEach(d => existingIds.add(d.id));

      const ops = [];
      (studentsList || []).forEach(student => {
        if (!student || !student.id) return;
        const cleanStudent = sanitizeFirestoreData(student);
        if (cleanStudent.attendance === undefined) {
          cleanStudent.attendance = {};
        }
        const { id, ...data } = cleanStudent;
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
          if (op.type === 'set') batch.set(op.ref, op.data, { merge: true });
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error no bloqueante al guardar estudiantes en Firestore:', err);
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
      (eventsList || []).forEach(event => {
        if (!event || !event.id) return;
        const cleanEvent = sanitizeFirestoreData(event);
        const { id, ...data } = cleanEvent;
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
          if (op.type === 'set') batch.set(op.ref, op.data, { merge: true });
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error no bloqueante al guardar eventos en Firestore:', err);
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
      (logsList || []).forEach(log => {
        if (!log || !log.id) return;
        const cleanLog = sanitizeFirestoreData(log);
        const { id, ...data } = cleanLog;
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
          if (op.type === 'set') batch.set(op.ref, op.data, { merge: true });
          else if (op.type === 'delete') batch.delete(op.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Error no bloqueante al guardar registros de alertas en Firestore:', err);
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
      const counselorMap = localStorage.getItem('s_grade_counselor_map');
      const monthlyDays = localStorage.getItem('s_monthly_worked_days');
      const attendanceDates = localStorage.getItem('s_attendance_day_dates');

      callback({
        subjects: subjects ? JSON.parse(subjects) : null,
        grades: grades ? JSON.parse(grades) : null,
        staff: staff ? JSON.parse(staff) : null,
        counselorMap: counselorMap ? JSON.parse(counselorMap) : null,
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
      if (conf['staff']?.mapping) {
        localStorage.setItem('s_grade_counselor_map', JSON.stringify(conf['staff'].mapping));
      }
      callback({
        subjects: conf['subjects']?.data || null,
        grades: conf['grades']?.data || null,
        staff: conf['staff']?.data || null,
        counselorMap: conf['staff']?.mapping || null,
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
      await setDoc(doc(firestore, 'config', 'subjects'), { data: sanitizeFirestoreData(subjects) });
    } catch (e) {
      console.error('Error no bloqueante al guardar materias en Firestore:', e);
    }
  },
  async saveGrades(grades) {
    if (!hasChanged('config_grades', grades)) return;
    localStorage.setItem('s_grades', JSON.stringify(grades));
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'config', 'grades'), { data: sanitizeFirestoreData(grades) });
    } catch (e) {
      console.error('Error no bloqueante al guardar grados en Firestore:', e);
    }
  },
  async saveGradeStaff(staff, counselorMap) {
    const payload = { staff, counselorMap };
    if (!hasChanged('config_staff', payload)) return;
    localStorage.setItem('s_grade_staff', JSON.stringify(staff));
    if (counselorMap) {
      localStorage.setItem('s_grade_counselor_map', JSON.stringify(counselorMap));
    }
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'config', 'staff'), { data: sanitizeFirestoreData(staff), mapping: sanitizeFirestoreData(counselorMap || {}) });
    } catch (e) {
      console.error('Error no bloqueante al guardar asignaciones de personal en Firestore:', e);
    }
  },
  async saveAttendanceConfigs(monthlyDays, attendanceDates) {
    const payload = { monthlyDays, attendanceDates };
    if (!hasChanged('config_attendance', payload)) return;
    localStorage.setItem('s_monthly_worked_days', JSON.stringify(monthlyDays));
    localStorage.setItem('s_attendance_day_dates', JSON.stringify(attendanceDates));
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'config', 'attendance'), sanitizeFirestoreData(payload));
    } catch (e) {
      console.error('Error no bloqueante al guardar configuración de asistencia en Firestore:', e);
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
      await setDoc(doc(firestore, 'eval_configs', 'store'), { blocks: sanitizeFirestoreData(configsObject) });
    } catch (err) {
      console.error('Error no bloqueante al guardar configuraciones de evaluación en Firestore:', err);
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
      await setDoc(doc(firestore, 'student_assessments', 'store'), { ratings: sanitizeFirestoreData(assessmentsObject) });
    } catch (err) {
      console.error('Error no bloqueante al guardar evaluaciones de estudiantes en Firestore:', err);
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
      await setDoc(doc(firestore, 'student_rp_grades', 'store'), { grades: sanitizeFirestoreData(rpGradesObject) });
    } catch (err) {
      console.error('Error no bloqueante al guardar calificaciones RP en Firestore:', err);
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
      await setDoc(doc(firestore, 'student_attendance', 'store'), { detail: sanitizeFirestoreData(attendanceObject) });
    } catch (err) {
      console.error('Error no bloqueante al guardar asistencias en Firestore:', err);
    }
  },

  // --- 9.1 ATTENDANCE COMMENTS ---
  subscribeAttendanceComments(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['attendance_comments']) fallbackSubscribers['attendance_comments'] = [];
      fallbackSubscribers['attendance_comments'].push(callback);
      const saved = localStorage.getItem('s_attendance_comments');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(collection(firestore, 'attendance_comments'), (snapshot) => {
      const comments = {};
      snapshot.forEach(docItem => {
        const data = docItem.data();
        if (docItem.id === 'store') {
          Object.assign(comments, data.comments || {});
        } else if (data && data.comments !== undefined) {
          comments[docItem.id] = data.comments;
        }
      });
      remoteCache['attendance_comments'] = JSON.stringify(comments);
      localStorage.setItem('s_attendance_comments', JSON.stringify(comments));
      callback(comments);
    });
  },
  async saveAttendanceComments(commentsObject) {
    if (!hasChanged('attendance_comments', commentsObject)) return;
    localStorage.setItem('s_attendance_comments', JSON.stringify(commentsObject));
    triggerFallbackUpdate('attendance_comments', commentsObject);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'attendance_comments', 'store'), { comments: sanitizeFirestoreData(commentsObject) });
    } catch (err) {
      console.error('Error no bloqueante al guardar comentarios de asistencia en Firestore:', err);
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
      await setDoc(doc(firestore, 'promotion_grades', 'store'), { grades: sanitizeFirestoreData(promotionGradesObject) });
    } catch (err) {
      console.error('Error no bloqueante al guardar notas de promoción en Firestore:', err);
    }
  },

  // --- 11. STUDENT REPORTS ---
  subscribeStudentReports(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['student_reports']) fallbackSubscribers['student_reports'] = [];
      fallbackSubscribers['student_reports'].push(callback);
      const saved = localStorage.getItem('s_student_reports');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(doc(firestore, 'student_reports', 'store'), (snapshot) => {
      const data = snapshot.exists() ? (snapshot.data().reports || []) : [];
      remoteCache['student_reports'] = JSON.stringify(data);
      localStorage.setItem('s_student_reports', JSON.stringify(data));
      callback(data);
    });
  },
  async saveStudentReports(reportsArray) {
    if (!hasChanged('student_reports', reportsArray)) return;
    localStorage.setItem('s_student_reports', JSON.stringify(reportsArray));
    triggerFallbackUpdate('student_reports', reportsArray);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'student_reports', 'store'), { reports: sanitizeFirestoreData(reportsArray) });
    } catch (err) {
      console.error('Error no bloqueante al guardar reportes de estudiantes en Firestore:', err);
    }
  },

  // --- 12. PLANIFICACIONES ---
  subscribePlanificaciones(callback) {
    if (!isFirebaseEnabled) {
      if (!fallbackSubscribers['planificaciones']) fallbackSubscribers['planificaciones'] = [];
      fallbackSubscribers['planificaciones'].push(callback);
      const saved = localStorage.getItem('s_planificaciones');
      if (saved) callback(JSON.parse(saved));
      return () => {};
    }
    return onSnapshot(doc(firestore, 'planificaciones', 'store'), (snapshot) => {
      const data = snapshot.exists() ? (snapshot.data().list || []) : [];
      remoteCache['planificaciones'] = JSON.stringify(data);
      localStorage.setItem('s_planificaciones', JSON.stringify(data));
      callback(data);
    });
  },
  async savePlanificaciones(planificacionesArray) {
    if (!hasChanged('planificaciones', planificacionesArray)) return;
    localStorage.setItem('s_planificaciones', JSON.stringify(planificacionesArray));
    triggerFallbackUpdate('planificaciones', planificacionesArray);
    if (!isFirebaseEnabled) return;
    try {
      await setDoc(doc(firestore, 'planificaciones', 'store'), { list: sanitizeFirestoreData(planificacionesArray) });
    } catch (err) {
      console.error('Error no bloqueante al guardar planificaciones en Firestore:', err);
    }
  }
};

export const db = {
  async saveData(collectionName, data) {
    localStorage.setItem(`s_${collectionName}`, JSON.stringify(data));
    if (collectionName === 'users') {
      return dbService.saveUsers(data);
    }
  }
};
