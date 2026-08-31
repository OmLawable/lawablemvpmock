import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Register a new user with Firebase Auth and store user profile & role in Firestore.
 * Allowed roles: 'student' | 'client' | 'lawyer' | 'business' | 'admin'
 */
export async function registerUserWithFirebase(email, password, role = 'client', name = '') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const displayName = name || email.split('@')[0];
    try {
      await updateProfile(user, { displayName });
    } catch (e) {
      console.warn('Could not update Auth displayName', e);
    }

    const userProfile = {
      id: user.uid,
      uid: user.uid,
      name: displayName,
      email: user.email,
      role: role, // 'student' | 'client' | 'lawyer' | 'business' | 'admin'
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString()
    };

    // Store profile document in Firestore `users` collection
    try {
      await setDoc(doc(db, 'users', user.uid), userProfile);
      if (role === 'lawyer') {
        const lawyerDoc = {
          id: `lawyer-${user.uid}`,
          userId: user.uid,
          name: displayName,
          email: user.email,
          verificationStatus: 'verified',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'lawyers', `lawyer-${user.uid}`), lawyerDoc);
      }
    } catch (dbErr) {
      console.warn('Firestore setDoc failed (credentials may be needed):', dbErr.message);
    }

    return { success: true, user: userProfile };
  } catch (error) {
    console.error('Firebase Signup Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Login existing user with Firebase Auth and retrieve their stored role from Firestore.
 */
export async function loginUserWithFirebase(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let userRole = 'client';
    let profileData = {};

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        profileData = userDocSnap.data();
        userRole = profileData.role || 'client';
      }
    } catch (dbErr) {
      console.warn('Could not read user profile from Firestore:', dbErr.message);
    }

    const currentUser = {
      id: user.uid,
      uid: user.uid,
      name: user.displayName || profileData.name || user.email.split('@')[0],
      email: user.email,
      role: userRole,
      emailVerified: user.emailVerified,
      ...profileData
    };

    return { success: true, user: currentUser };
  } catch (error) {
    console.error('Firebase Login Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out user from Firebase Auth
 */
export async function logoutUserWithFirebase() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase Logout Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email via Firebase Auth
 */
export async function resetPasswordWithFirebase(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Firebase Reset Password Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch User Profile Document by UID
 */
export async function getUserProfile(uid) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile:', error.message);
    return null;
  }
}

/**
 * Save / Update Lawyer Profile directly in Firebase Firestore `lawyers` collection.
 */
export async function saveLawyerProfileToFirebase(lawyerProfile) {
  try {
    const docId = lawyerProfile.id || lawyerProfile.userId || `lawyer-${Date.now()}`;
    const docRef = doc(db, 'lawyers', docId);
    const dataToSave = {
      ...lawyerProfile,
      id: docId,
      verificationStatus: lawyerProfile.verificationStatus || 'verified',
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, dataToSave, { merge: true });
    console.log(`✅ Lawyer profile saved to Firebase Firestore: ${docId}`);
    return { success: true, id: docId, data: dataToSave };
  } catch (error) {
    console.error('Error saving lawyer profile to Firebase:', error);
    return { success: false, error: error.message };
  }
}

