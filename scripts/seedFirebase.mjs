import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { INITIAL_DATA } from '../src/store/initialData.js';

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

async function seed() {
  console.log('🚀 Connecting to Firestore project: lawable-a6ce0...');
  try {
    console.log('Seeding categories...');
    for (const cat of INITIAL_DATA.categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
      console.log(`  + Category: ${cat.name}`);
    }

    console.log('Seeding 10 verified Advocates with 3-section profiles into Firestore...');
    for (const lawyer of INITIAL_DATA.lawyers) {
      await setDoc(doc(db, 'lawyers', lawyer.id), lawyer);
      console.log(`  + Advocate (${lawyer.id}): ${lawyer.name}`);
    }

    console.log('Seeding fixed-price services...');
    for (const srv of INITIAL_DATA.services) {
      await setDoc(doc(db, 'services', srv.id), srv);
      console.log(`  + Service: ${srv.title}`);
    }

    console.log('✅ ALL LAWYER PROFILES SEEDED SUCCESSFULLY TO FIREBASE FIRESTORE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ SEED ERROR:', err);
    process.exit(1);
  }
}

seed();

