import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

const categories = [
  { id: 'cat-1', name: 'Contract Drafting', slug: 'contract-drafting', icon: 'FileText', active: true, order: 1 },
  { id: 'cat-2', name: 'Contract Review', slug: 'contract-review', icon: 'ShieldCheck', active: true, order: 2 },
  { id: 'cat-3', name: 'Legal Notices', slug: 'legal-notices', icon: 'AlertTriangle', active: true, order: 3 },
  { id: 'cat-4', name: 'Corporate & Company Law', slug: 'corporate-law', icon: 'Building2', active: true, order: 4 },
  { id: 'cat-5', name: 'Compliance', slug: 'compliance', icon: 'CheckSquare', active: true, order: 5 },
  { id: 'cat-6', name: 'IP & Trademarks', slug: 'ip-trademarks', icon: 'Lock', active: true, order: 6 },
  { id: 'cat-7', name: 'Employment & HR', slug: 'employment-hr', icon: 'Users', active: true, order: 7 },
  { id: 'cat-8', name: 'Property & Real Estate', slug: 'property-real-estate', icon: 'Home', active: true, order: 8 },
  { id: 'cat-9', name: 'Family Law', slug: 'family-law', icon: 'Heart', active: true, order: 9 },
  { id: 'cat-10', name: 'Consumer Protection', slug: 'consumer-protection', icon: 'ShoppingBag', active: true, order: 10 },
  { id: 'cat-11', name: 'Cyber & Data Protection', slug: 'cyber-data-protection', icon: 'Shield', active: true, order: 11 }
];

const seedUsers = [
  { id: 'user-001', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', role: 'client', city: 'Mumbai', state: 'Maharashtra', createdAt: new Date().toISOString() },
  { id: 'user-002', name: 'Adv. Priya Malhotra', email: 'priya.malhotra@lawable.in', role: 'lawyer', city: 'Mumbai', state: 'Maharashtra', createdAt: new Date().toISOString() },
  { id: 'user-003', name: 'Rohan Mehta', email: 'rohan.student@example.com', role: 'student', city: 'Ahmedabad', state: 'Gujarat', createdAt: new Date().toISOString() },
  { id: 'user-004', name: 'NexWave Admin', email: 'admin@nexwave.in', role: 'business', city: 'Mumbai', state: 'Maharashtra', createdAt: new Date().toISOString() },
  { id: 'user-admin-001', name: 'Lawable Admin Superuser', email: 'admin@lawable.in', role: 'admin', city: 'New Delhi', state: 'Delhi', createdAt: new Date().toISOString() }
];

async function seed() {
  console.log('🚀 Connecting to Firestore for project lawable-a6ce0...');
  try {
    console.log('Seeding categories...');
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
      console.log(`  + Category: ${cat.name}`);
    }
    console.log('Seeding users...');
    for (const u of seedUsers) {
      await setDoc(doc(db, 'users', u.id), u);
      console.log(`  + User (${u.role}): ${u.name}`);
    }
    console.log('✅ SEED SUCCESSFUL!');
    process.exit(0);
  } catch (err) {
    console.error('❌ SEED ERROR:', err);
    process.exit(1);
  }
}

seed();
