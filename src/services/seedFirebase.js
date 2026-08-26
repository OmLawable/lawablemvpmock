import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, limit, query } from 'firebase/firestore';
import { INITIAL_DATA } from '../store/initialData';

export async function seedInitialDataToFirestore() {
  try {
    // Check if seeding has already been performed
    const categoriesRef = collection(db, 'categories');
    const existingSnap = await getDocs(query(categoriesRef, limit(1)));
    if (!existingSnap.empty) {
      console.log('⚡ Firestore already contains seeded data. Skipping initial seed.');
      return { success: true, seeded: false };
    }

    console.log('🌱 Seeding initial mock data into Firestore collections...');

    // 1. Seed Categories
    for (const cat of INITIAL_DATA.categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // 2. Seed Verified Lawyers
    for (const lawyer of INITIAL_DATA.lawyers) {
      await setDoc(doc(db, 'lawyers', lawyer.id), lawyer);
    }

    // 3. Seed Fixed-Price Services
    for (const srv of INITIAL_DATA.services) {
      await setDoc(doc(db, 'services', srv.id), srv);
    }

    // 4. Seed Academy Courses
    for (const crs of INITIAL_DATA.courses) {
      await setDoc(doc(db, 'courses', crs.id), crs);
    }

    // 5. Seed Compliance Checklist Items
    for (const comp of INITIAL_DATA.complianceChecklist) {
      await setDoc(doc(db, 'complianceChecklist', comp.id), comp);
    }

    // 6. Seed Contracts Register
    for (const cnt of INITIAL_DATA.contracts) {
      await setDoc(doc(db, 'contracts', cnt.id), cnt);
    }

    // 7. Seed Blogs
    for (const blog of INITIAL_DATA.blogs) {
      await setDoc(doc(db, 'blogs', blog.id), blog);
    }

    // 8. Seed Certificates
    for (const cert of INITIAL_DATA.certificates) {
      await setDoc(doc(db, 'certificates', cert.id), cert);
    }

    // 9. Seed Service Requests
    for (const req of INITIAL_DATA.requests) {
      await setDoc(doc(db, 'requests', req.id), req);
    }

    console.log('✅ Firestore seeding completed successfully!');
    return { success: true, seeded: true };
  } catch (error) {
    console.warn('⚠️ Could not complete Firestore seeding (Firebase config may require project API keys):', error.message);
    return { success: false, error: error.message };
  }
}
