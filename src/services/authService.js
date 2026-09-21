import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import {
  getAuth,
  updateEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { syncToIndexedDB } from '../utils/dbBackup';

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
let auth = null;

if (isFirebaseEnabled) {
  try {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('⚠️ authService: Firebase not initialized or operating in offline fallback mode.');
  }
}

export const authService = {
  isFirebaseEnabled,
  
  get currentUser() {
    return auth ? auth.currentUser : null;
  },

  /**
   * Cascade update profile: Firebase Auth -> Firestore -> LocalStorage -> IndexedDB
   */
  async updateUserProfile(updatedUser, confirmPassword = null) {
    let firebaseAuthUpdated = false;

    // A) Update Firebase Auth if user is currently signed in to Firebase
    if (auth && auth.currentUser) {
      try {
        if (updatedUser.name && auth.currentUser.displayName !== updatedUser.name) {
          await updateProfile(auth.currentUser, { displayName: updatedUser.name });
          firebaseAuthUpdated = true;
        }

        if (updatedUser.email && auth.currentUser.email !== updatedUser.email) {
          try {
            await updateEmail(auth.currentUser, updatedUser.email);
            firebaseAuthUpdated = true;
          } catch (authErr) {
            if (authErr.code === 'auth/requires-recent-login') {
              if (confirmPassword) {
                const credential = EmailAuthProvider.credential(auth.currentUser.email, confirmPassword);
                await reauthenticateWithCredential(auth.currentUser, credential);
                await updateEmail(auth.currentUser, updatedUser.email);
                firebaseAuthUpdated = true;
              } else {
                throw authErr; // Signal UI to ask for password reauth
              }
            } else {
              throw authErr;
            }
          }
        }
      } catch (err) {
        if (err.code === 'auth/requires-recent-login') {
          throw err;
        }
        console.warn('⚠️ Notice: Firebase Auth profile update bypassed or operating in custom credential mode:', err.message || err);
      }
    }

    // B) Update Firestore "users" document
    if (isFirebaseEnabled && firestore && updatedUser.id) {
      try {
        const { id, ...userData } = updatedUser;
        await setDoc(doc(firestore, 'users', String(id)), userData, { merge: true });
      } catch (err) {
        console.error('Error updating user document in Firestore:', err);
      }
    }

    // C) Update local storage & IndexedDB
    try {
      localStorage.setItem('s_current_user', JSON.stringify(updatedUser));
      const savedUsers = localStorage.getItem('s_users');
      let usersList = savedUsers ? JSON.parse(savedUsers) : [];
      if (Array.isArray(usersList)) {
        const idx = usersList.findIndex(u => u.id === updatedUser.id || (u.email && u.email.toLowerCase() === (updatedUser.email || '').toLowerCase()));
        if (idx >= 0) {
          usersList[idx] = updatedUser;
        } else {
          usersList.push(updatedUser);
        }
        localStorage.setItem('s_users', JSON.stringify(usersList));
      }
      await syncToIndexedDB();
    } catch (e) {
      console.error('Error syncing user profile to IndexedDB:', e);
    }

    return { updatedUser, firebaseAuthUpdated };
  },

  /**
   * Optional Microsoft Account / OneDrive Linking
   */
  async linkMicrosoftAccount(currentUser, microsoftEmail) {
    const updated = {
      ...currentUser,
      isOneDriveLinked: true,
      microsoftEmail: microsoftEmail.trim(),
      oneDriveLinkedAt: new Date().toISOString()
    };
    return await this.updateUserProfile(updated);
  },

  async unlinkMicrosoftAccount(currentUser) {
    const updated = {
      ...currentUser,
      isOneDriveLinked: false,
      microsoftEmail: ''
    };
    return await this.updateUserProfile(updated);
  }
};
