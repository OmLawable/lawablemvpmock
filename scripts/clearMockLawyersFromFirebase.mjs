import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC_qNT2j7HMc3ZZaVHmjZvwz3yj0Xs97Gs",
  authDomain: "lawable-a6ce0.firebaseapp.com",
  projectId: "lawable-a6ce0",
  storageBucket: "lawable-a6ce0.firebasestorage.app",
  messagingSenderId: "405049175177",
  appId: "1:405049175177:web:d7779c1549faca7e9aaa58"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockLawyerIds = [
  'lawyer-101', 'lawyer-102', 'lawyer-103', 'lawyer-104', 'lawyer-105',
  'lawyer-106', 'lawyer-107', 'lawyer-108', 'lawyer-109', 'lawyer-110'
];

async function clearMockLawyers() {
  console.log('🧹 Clearing mock advocate profiles from Firebase Firestore (lawable-a6ce0)...');
  try {
    for (const id of mockLawyerIds) {
      await deleteDoc(doc(db, 'lawyers', id));
      console.log(`  - Deleted mock lawyer document: ${id}`);
    }
    console.log('✅ Successfully removed all 10 mock advocate profiles from Firebase!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing mock lawyers:', err);
    process.exit(1);
  }
}

clearMockLawyers();
