import { INITIAL_DATA } from './initialData';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../services/firebaseService';
import { seedInitialDataToFirestore } from '../services/seedFirebase';

class LawableStore {
  constructor() {
    this.toasts = [];
    this.listeners = new Set();
    this.loadState();
    this.initFirebase();
  }

  initFirebase() {
    // Background seed of initial mock data into Firestore if empty
    seedInitialDataToFirestore().catch((err) => console.warn('Seeding check:', err.message));

    // Firebase Auth session synchronization
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);
        this.state.currentUser = {
          ...this.state.currentUser,
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || (profile && profile.name) || firebaseUser.email.split('@')[0],
          role: (profile && profile.role) || this.state.currentUser.role || 'client',
          emailVerified: firebaseUser.emailVerified
        };
        this.notify();
      }
    });
  }

  loadState() {
    try {
      const saved = localStorage.getItem('lawable_state_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = {
          ...INITIAL_DATA,
          ...parsed,
          currentUser: { ...INITIAL_DATA.currentUser, ...(parsed.currentUser || {}) },
          roles: INITIAL_DATA.roles,
          lawyers: (parsed.lawyers && parsed.lawyers.length >= 10) ? parsed.lawyers : INITIAL_DATA.lawyers,
          categories: INITIAL_DATA.categories,
          services: (parsed.services && parsed.services.length >= 6) ? parsed.services : INITIAL_DATA.services,
          aiConversations: parsed.aiConversations && parsed.aiConversations.length ? parsed.aiConversations : INITIAL_DATA.aiConversations,
          documents: parsed.documents && parsed.documents.length ? parsed.documents : INITIAL_DATA.documents,
          requests: parsed.requests && parsed.requests.length ? parsed.requests : INITIAL_DATA.requests,
          courses: INITIAL_DATA.courses,
          certificates: parsed.certificates || INITIAL_DATA.certificates,
          notifications: parsed.notifications || INITIAL_DATA.notifications,
          blogs: INITIAL_DATA.blogs
        };
      } else {
        this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
      }
    } catch (e) {
      console.error('Failed to parse local storage state, fallback to initial data', e);
      this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    try {
      localStorage.setItem('lawable_state_v3', JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to local storage', e);
    }
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Toast System
  addToast(message, type = 'info') {
    const toast = { id: Date.now() + Math.random(), message, type };
    this.toasts.push(toast);
    this.notify();
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== toast.id);
      this.notify();
    }, 4000);
  }

  getToasts() {
    return this.toasts;
  }

  // --- Auth & User State (PRD §6.1) ---
  setRole(roleId) {
    this.state.currentUser.role = roleId;
    this.addToast(`Switched active workspace role to ${roleId.toUpperCase()}`, 'info');
    this.notify();
  }

  updateProfile(profileData) {
    this.state.currentUser = { ...this.state.currentUser, ...profileData };
    this.addToast('Profile details updated successfully', 'success');
    this.notify();
  }

  setCurrentUser(userData) {
    this.state.currentUser = { ...this.state.currentUser, ...userData };
    this.notify();
  }

  // --- Lawable AI State (PRD §6.2) ---
  addAIMessage(conversationId, text) {
    let conv = this.state.aiConversations.find((c) => c.id === conversationId);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        userId: this.state.currentUser.id,
        title: text.length > 35 ? text.substring(0, 35) + '...' : text,
        updatedAt: new Date().toISOString(),
        riskLevel: text.toLowerCase().includes('indemnity') || text.toLowerCase().includes('uncapped') ? 'high' : 'low',
        messages: []
      };
      this.state.aiConversations.unshift(conv);
    }

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    conv.messages.push(userMsg);

    // AI Response synthesis engine with legal citations & escalation trigger
    const isHighRisk = text.toLowerCase().includes('indemnity') || text.toLowerCase().includes('uncapped') || text.toLowerCase().includes('liability') || text.toLowerCase().includes('breach');
    
    const aiMsg = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ai',
      text: isHighRisk
        ? `Analysis of query regarding **Indemnification & Contract Risks**:\n\nUnder Section 73 of the **Indian Contract Act, 1872**, compensation is ordinarily payable for direct losses that naturally arose in the usual course of things.\n\n⚠️ **High Risk Flag**: Uncapped indemnities and consequential liability terms bypass statutory Section 73 restrictions and expose your organization to unlimited damages. Have a Bar Council verified advocate conduct formal contract redline.`
        : `Under Indian jurisprudence and Bare Acts indexed in Lawable AI:\n\n1. Section 10 of Contract Act requires free consent, lawful consideration, and competent parties.\n2. Digital Personal Data Protection Act 2023 requires explicit consent notices for data processing.\n\nPlease verify contract terms with a Bar Council verified Advocate for binding legal advice.`,
      citations: [
        { source: 'Indian Contract Act 1872', text: 'Sec 73: Damages for breach of contract' },
        { source: 'Supreme Court Citation', text: 'Pannalal Bharulal v. Union of India (1976)' }
      ],
      escalationRecommended: isHighRisk,
      timestamp: new Date().toISOString()
    };

    conv.messages.push(aiMsg);
    conv.updatedAt = new Date().toISOString();
    conv.riskLevel = isHighRisk ? 'high' : 'low';

    this.notify();
    return conv.id;
  }

  logAIFeedback(messageId, rating, reason = '') {
    this.addToast(`Feedback logged for AI Response #${messageId}`, 'success');
  }

  // --- Marketplace & Advocate Requests (PRD §6.3) ---
  createServiceRequest(requestData) {
    const newReq = {
      id: `req-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: this.state.currentUser.id,
      clientName: this.state.currentUser.name,
      serviceId: requestData.serviceId || null,
      serviceTitle: requestData.serviceTitle || 'Legal Service Request',
      lawyerId: requestData.lawyerId,
      lawyerName: requestData.lawyerName,
      source: requestData.source || 'direct', // 'ai_escalation' | 'direct' | 'compliance_referral'
      sourceRefId: requestData.sourceRefId || null,
      matterDescription: requestData.matterDescription,
      preferredContact: requestData.preferredContact || 'In-App Messages',
      preferredTime: requestData.preferredTime || 'Afternoon (2 PM - 5 PM)',
      fee: requestData.fee || 2500,
      quotedFee: requestData.fee || 2500,
      status: 'submitted', // 'submitted' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'rejected' | 'needs_info'
      timeline: [
        {
          actor: `${this.state.currentUser.name} (Client)`,
          action: 'submitted',
          note: requestData.note || 'Service request submitted.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.state.requests.unshift(newReq);
    
    // Add Notification
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Service Request Created',
      message: `Your request #${newReq.id} to ${requestData.lawyerName} has been submitted.`,
      timestamp: 'Just now',
      read: false,
      link: `/app/requests/${newReq.id}`
    });

    this.addToast(`Service request #${newReq.id} created successfully!`, 'success');
    this.notify();
    return newReq.id;
  }

  updateRequestStatus(requestId, status, note = '') {
    const req = this.state.requests.find((r) => r.id === requestId);
    if (!req) return;
    req.status = status;
    req.timeline.push({
      actor: `${this.state.currentUser.name} (${this.state.currentUser.role.toUpperCase()})`,
      action: status,
      note: note || `Request status updated to ${status}.`,
      timestamp: new Date().toISOString()
    });

    this.addToast(`Request #${requestId} updated to ${status.toUpperCase()}`, 'info');
    this.notify();
  }

  // --- Notifications ---
  markNotificationRead(id) {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.notify();
    }
  }

  // --- Reset Local Demo State ---
  resetDemoData() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    localStorage.removeItem('lawable_state_v1');
    localStorage.removeItem('lawable_state_v2');
    localStorage.setItem('lawable_state_v3', JSON.stringify(INITIAL_DATA));
    this.addToast('Demo workspace reset to initial PRD seed state', 'success');
    this.notify();
  }
}

export const store = new LawableStore();
