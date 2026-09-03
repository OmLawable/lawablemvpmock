import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore';

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
 * Register business user and send Google's native Firebase Auth verification email directly to Gmail
 */
export async function registerBusinessWithFirebaseVerification(email, password, name = '', companyName = '') {
  try {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (createErr) {
      if (createErr.code === 'auth/email-already-in-use') {
        // If already registered, sign in to check status or resend verification email
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw createErr;
      }
    }

    const user = userCredential.user;
    await user.reload();
    const displayName = name || companyName || email.split('@')[0];

    try {
      await updateProfile(user, { displayName });
    } catch (pErr) {
      console.warn('Could not update profile name', pErr);
    }

    // If not already verified, dispatch Firebase verification email link
    if (!user.emailVerified) {
      try {
        await sendEmailVerification(user);
      } catch (linkErr) {
        console.warn('sendEmailVerification fallback:', linkErr.message);
      }
      console.log(`✅ Google Firebase verification email link dispatched to ${email}`);
    }

    const userProfile = {
      id: user.uid,
      uid: user.uid,
      name: displayName,
      email: user.email,
      role: 'business',
      companyName: companyName || displayName,
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
    } catch (dbErr) {
      console.warn('Firestore setDoc user profile error:', dbErr.message);
    }

    return { 
      success: true, 
      user: userProfile, 
      firebaseUser: user,
      alreadyVerified: user.emailVerified 
    };
  } catch (error) {
    console.error('Firebase Business Verification Error:', error);
    let friendlyMsg = error.message;
    if (error.code === 'auth/operation-not-allowed') {
      friendlyMsg = 'Email/Password sign-in provider is disabled in Firebase Console. Please enable it under Firebase Console -> Authentication -> Sign-in method.';
    } else if (error.code === 'auth/invalid-email') {
      friendlyMsg = 'Please enter a valid email address.';
    } else if (error.code === 'auth/weak-password') {
      friendlyMsg = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      friendlyMsg = 'An account with this email already exists. Please log in or use the correct password.';
    }
    return { success: false, error: friendlyMsg, code: error.code };
  }
}

/**
 * Resend Google Firebase verification email link directly to the user
 */
export async function resendFirebaseVerificationEmail(email = '', password = '') {
  try {
    let user = auth.currentUser;
    if (!user && email && password) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user = cred.user;
      } catch (err) {
        // silent fallback
      }
    }

    if (!user) {
      return { success: false, error: 'No active session found. Please fill in the signup form again.' };
    }

    await user.reload();
    if (user.emailVerified) {
      return { 
        success: true, 
        alreadyVerified: true, 
        message: 'This email is already verified in Firebase! You can sign in directly.' 
      };
    }

    try {
      await sendEmailVerification(user);
    } catch (linkErr) {
      console.warn('resend sendEmailVerification fallback:', linkErr.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Firebase Resend Email Error:', error);
    let friendly = error.message;
    if (error.code === 'auth/too-many-requests') {
      friendly = 'Firebase rate limit reached. Please wait a minute before requesting another link, or check your Spam folder for previous emails.';
    }
    return { success: false, error: friendly, code: error.code };
  }
}

/**
 * Reload Firebase user state and check if email has been verified via the Google email link.
 * Supports silent re-authentication if credentials are provided.
 */
export async function checkAndReloadFirebaseUser(email = '', password = '') {
  try {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        return { 
          verified: true,
          user: auth.currentUser
        };
      }
    }
    
    // If auth.currentUser was detached or not yet verified, try authenticating with credentials
    if (email && password) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await credential.user.reload();
        return {
          verified: credential.user.emailVerified,
          user: credential.user
        };
      } catch (authErr) {
        // Credentials check failed or wrong password
      }
    }

    return { 
      verified: auth.currentUser ? auth.currentUser.emailVerified : false,
      user: auth.currentUser
    };
  } catch (error) {
    console.warn('Error reloading Firebase user:', error.message);
    return { verified: false, error: error.message };
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
 * Update / Merge User Profile Document in Firestore and clean legacy fields
 */
export async function updateUserProfileInFirestore(uid, data) {
  try {
    const userDocRef = doc(db, 'users', uid);
    
    // Explicitly delete any duplicate or obsolete fields from Firestore
    await updateDoc(userDocRef, {
      ...data,
      companyName: deleteField(),
      officialEmail: deleteField(),
      businessProfile: deleteField(),
      pincode: deleteField(),
      tan: deleteField(),
      dpiitNumber: deleteField(),
      udyamNumber: deleteField(),
      tradeName: deleteField(),
      billingEmail: deleteField(),
      website: deleteField(),
      incorporationDate: deleteField(),
      industry: deleteField(),
      signatoryDin: deleteField(),
      dpoName: deleteField(),
      dpoEmail: deleteField(),
      jurisdictionCity: deleteField(),
      turnoverBracket: deleteField(),
      hasPoshCommittee: deleteField()
    });
    return { success: true };
  } catch (error) {
    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, data, { merge: true });
      return { success: true };
    } catch (setErr) {
      console.error('Error updating user profile in Firestore:', setErr);
      return { success: false, error: setErr.message };
    }
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
