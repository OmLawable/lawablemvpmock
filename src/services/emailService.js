import emailjs from '@emailjs/browser';
import { db } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

/**
 * Service to send notification and alert emails.
 * Email verification is handled natively via Firebase Auth email verification links.
 */

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export async function sendNotificationEmail({ to, subject, html, text }) {
  const result = {
    success: false,
    deliveredVia: [],
    error: null
  };

  // 1. Deliver via EmailJS if configured
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: to,
          subject: subject,
          message_html: html,
          message_text: text
        },
        EMAILJS_PUBLIC_KEY
      );
      result.deliveredVia.push('emailjs');
      result.success = true;
    } catch (emailjsErr) {
      console.warn('EmailJS delivery failed:', emailjsErr);
    }
  }

  // 2. Queue Email in Firestore `mail` collection (Trigger Email extension)
  try {
    await addDoc(collection(db, 'mail'), {
      to: [to],
      message: {
        subject,
        text: text || '',
        html: html || ''
      },
      createdAt: new Date().toISOString()
    });
    result.deliveredVia.push('firebase_mail_queue');
    result.success = true;
  } catch (mailErr) {
    console.warn('Could not queue to mail collection in Firestore:', mailErr.message);
  }

  return result;
}
