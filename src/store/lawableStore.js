import { INITIAL_DATA } from './initialData';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, updateUserProfileInFirestore, logoutUserWithFirebase } from '../services/firebaseService';
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
        const logoUrl = (profile && (profile.logo || profile.avatar)) || '';
        const userEmail = firebaseUser.email || (profile && profile.email) || '';
        const userName = firebaseUser.displayName || (profile && profile.name) || userEmail.split('@')[0];

        this.state.currentUser = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: userEmail,
          name: userName,
          role: (profile && profile.role) || (this.state.currentUser && this.state.currentUser.role) || 'client',
          avatar: logoUrl || (profile && profile.avatar) || (this.state.currentUser && this.state.currentUser.avatar) || '',
          emailVerified: firebaseUser.emailVerified,
          ...profile
        };

        const isSameUser = this.state.businessProfile && (
          this.state.businessProfile.officialEmail === userEmail || 
          this.state.businessProfile.userId === firebaseUser.uid
        );
        const existingBiz = isSameUser ? this.state.businessProfile : {};

        this.state.businessProfile = {
          ...existingBiz,
          userId: firebaseUser.uid,
          logo: logoUrl || existingBiz.logo || '',
          companyName: (profile && (profile.companyName || profile.name)) || (isSameUser ? existingBiz.companyName : userName) || userName,
          entityType: (profile && profile.entityType) || existingBiz.entityType || 'pvt_ltd',
          cin: (profile && profile.cin) || (isSameUser ? existingBiz.cin : '') || '',
          gstin: (profile && profile.gstin) || (isSameUser ? existingBiz.gstin : '') || '',
          pan: (profile && profile.pan) || (isSameUser ? existingBiz.pan : '') || '',
          registeredAddress: (profile && profile.registeredAddress) || (isSameUser ? existingBiz.registeredAddress : '') || '',
          city: (profile && profile.city) || (isSameUser ? existingBiz.city : '') || '',
          state: (profile && profile.state) || (isSameUser ? existingBiz.state : '') || '',
          officialEmail: (profile && (profile.officialEmail || profile.email)) || userEmail,
          phone: (profile && profile.phone) || (isSameUser ? existingBiz.phone : '') || '',
          signatoryName: (profile && (profile.signatoryName || profile.name)) || (isSameUser ? existingBiz.signatoryName : userName) || userName,
          signatoryDesignation: (profile && profile.signatoryDesignation) || (isSameUser ? existingBiz.signatoryDesignation : '') || '',
          employeeCount: (profile && profile.employeeCount) || (isSameUser ? existingBiz.employeeCount : '') || '',
          complianceScore: (profile && profile.complianceScore) || (isSameUser ? existingBiz.complianceScore : 0) || 0,
          ...(profile && profile.businessProfile ? profile.businessProfile : {})
        };

        this.notify();
      } else {
        // Clear any old mock session if Firebase has no logged-in user
        if (this.state.currentUser && this.state.currentUser.id === 'user-001') {
          this.state.currentUser = null;
          this.state.businessProfile = null;
          this.notify();
        }
      }
    });
  }

  loadState() {
    try {
      // Clear all legacy storage versions with old mock data
      ['lawable_state_v1', 'lawable_state_v2', 'lawable_state_v3'].forEach((k) => localStorage.removeItem(k));

      const saved = localStorage.getItem('lawable_state_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        let loadedUser = parsed.currentUser || null;
        if (loadedUser && (loadedUser.id === 'user-001' || loadedUser.email === 'aarav.sharma@example.com' || loadedUser.name === 'NexWave Solutions')) {
          loadedUser = null;
        }

        let loadedBiz = parsed.businessProfile || null;
        if (loadedBiz && loadedBiz.companyName === 'NexWave Solutions Pvt Ltd') {
          loadedBiz = null;
        }

        this.state = {
          ...INITIAL_DATA,
          ...parsed,
          currentUser: loadedUser,
          businessProfile: loadedBiz,
          roles: INITIAL_DATA.roles,
          lawyers: (parsed.lawyers && parsed.lawyers.length >= 10) ? parsed.lawyers : INITIAL_DATA.lawyers,
          categories: INITIAL_DATA.categories,
          services: (parsed.services && parsed.services.length >= 6) ? parsed.services : INITIAL_DATA.services,
          aiConversations: (parsed.aiConversations || []).filter(c => c.id !== 'conv-301'),
          documents: (parsed.documents || []).filter(d => d.id !== 'doc-001' && d.id !== 'doc-002' && d.id !== 'doc-003'),
          requests: (parsed.requests || []).filter(r => r.id !== 'req-9001' && r.id !== 'req-9002'),
          contracts: (parsed.contracts || []).filter(c => c.id !== 'cnt-1' && c.id !== 'cnt-2'),
          complianceChecklist: parsed.complianceChecklist || [],
          courses: INITIAL_DATA.courses,
          certificates: (parsed.certificates || []).filter(c => c.id !== 'cert-1'),
          notifications: parsed.notifications || [],
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
      localStorage.setItem('lawable_state_v4', JSON.stringify(this.state));
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
    if (this.state.currentUser) {
      this.state.currentUser.role = roleId;
    }
    this.addToast(`Switched active workspace role to ${roleId.toUpperCase()}`, 'info');
    this.notify();
  }

  async updateProfile(profileData) {
    this.state.currentUser = { ...(this.state.currentUser || {}), ...profileData };
    const uid = this.state.currentUser && (this.state.currentUser.uid || this.state.currentUser.id);
    if (uid) {
      try {
        await updateUserProfileInFirestore(uid, {
          ...profileData,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Could not sync user profile to Firestore:', e);
      }
    }
    this.addToast('Profile details updated successfully', 'success');
    this.notify();
  }

  async updateBusinessProfile(profileData) {
    const logoUrl = profileData.logo !== undefined ? profileData.logo : (this.state.businessProfile?.logo || '');
    this.state.businessProfile = {
      ...(this.state.businessProfile || {}),
      ...profileData,
      logo: logoUrl
    };
    if (this.state.currentUser) {
      if (profileData.companyName) {
        this.state.currentUser.name = profileData.companyName;
      }
      this.state.currentUser = {
        ...this.state.currentUser,
        ...profileData,
        avatar: logoUrl || this.state.currentUser.avatar || ''
      };

      const uid = this.state.currentUser.uid || this.state.currentUser.id;
      if (uid) {
        const firestoreData = {
          name: profileData.companyName || profileData.name || this.state.currentUser.name || '',
          email: profileData.officialEmail || profileData.email || this.state.currentUser.email || '',
          phone: profileData.phone || this.state.currentUser.phone || '',
          logo: logoUrl,
          avatar: logoUrl,
          entityType: profileData.entityType || 'pvt_ltd',
          cin: profileData.cin || '',
          gstin: profileData.gstin || '',
          pan: profileData.pan || '',
          registeredAddress: profileData.registeredAddress || '',
          city: profileData.city || '',
          state: profileData.state || '',
          signatoryName: profileData.signatoryName || '',
          signatoryDesignation: profileData.signatoryDesignation || '',
          employeeCount: profileData.employeeCount || '',
          updatedAt: new Date().toISOString()
        };
        try {
          await updateUserProfileInFirestore(uid, firestoreData);
        } catch (e) {
          console.warn('Could not sync business profile to Firestore:', e);
        }
      }
    }
    this.addToast('Business profile updated successfully', 'success');
    this.notify();
  }

  setCurrentUser(userData) {
    if (!userData) {
      this.state.currentUser = null;
      this.state.businessProfile = null;
    } else {
      this.state.currentUser = { ...(this.state.currentUser || {}), ...userData };
      
      const userEmail = userData.email || (this.state.currentUser && this.state.currentUser.email) || '';
      const userName = userData.companyName || userData.name || (this.state.currentUser && this.state.currentUser.name) || (userEmail ? userEmail.split('@')[0] : '');
      const uid = userData.id || userData.uid || (this.state.currentUser && this.state.currentUser.id) || '';
      
      const isSameUser = this.state.businessProfile && (
        (userEmail && this.state.businessProfile.officialEmail === userEmail) ||
        (uid && this.state.businessProfile.userId === uid)
      );
      const existingBiz = isSameUser ? this.state.businessProfile : {};

      this.state.businessProfile = {
        ...existingBiz,
        userId: uid,
        logo: userData.avatar || userData.logo || existingBiz.logo || '',
        companyName: userData.companyName || (isSameUser ? existingBiz.companyName : userName) || userName,
        entityType: userData.entityType || existingBiz.entityType || 'pvt_ltd',
        cin: userData.cin || (isSameUser ? existingBiz.cin : '') || '',
        gstin: userData.gstin || (isSameUser ? existingBiz.gstin : '') || '',
        pan: userData.pan || (isSameUser ? existingBiz.pan : '') || '',
        registeredAddress: userData.registeredAddress || (isSameUser ? existingBiz.registeredAddress : '') || '',
        city: userData.city || (isSameUser ? existingBiz.city : '') || '',
        state: userData.state || (isSameUser ? existingBiz.state : '') || '',
        officialEmail: userEmail || existingBiz.officialEmail || '',
        phone: userData.phone || (isSameUser ? existingBiz.phone : '') || '',
        signatoryName: userData.signatoryName || (isSameUser ? existingBiz.signatoryName : userName) || userName,
        signatoryDesignation: userData.signatoryDesignation || (isSameUser ? existingBiz.signatoryDesignation : '') || '',
        employeeCount: userData.employeeCount || (isSameUser ? existingBiz.employeeCount : '') || '',
        complianceScore: userData.complianceScore || (isSameUser ? existingBiz.complianceScore : 0) || 0,
        ...(userData.businessProfile || {})
      };
    }
    this.notify();
  }

  async logout() {
    try {
      await logoutUserWithFirebase();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    this.state.currentUser = null;
    this.state.businessProfile = null;
    ['lawable_state_v1', 'lawable_state_v2', 'lawable_state_v3', 'lawable_state_v4'].forEach(k => localStorage.removeItem(k));
    this.addToast('Logged out successfully', 'info');
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

  // --- Academy Quizzes & Examinations ---
  getQuizForLearner(courseId) {
    const course = (this.state.courses || []).find((c) => c.id === courseId) || (this.state.courses && this.state.courses[0]);
    if (!course) return null;

    const sampleQuestions = [
      {
        id: 'q1',
        question: `Under Indian contract jurisprudence, what is essential for contract validity under Section 10 of the Indian Contract Act 1872?`,
        options: [
          'Free consent of parties competent to contract for a lawful consideration',
          'Oral agreement without lawful consideration',
          'Execution exclusively in High Court presence',
          'Unilateral execution without acceptance notice'
        ],
        correctIndex: 0
      },
      {
        id: 'q2',
        question: 'Under Section 73 of the Indian Contract Act 1872, what damages are recoverable upon contract breach?',
        options: [
          'Indirect and remote losses regardless of foreseeability',
          'Direct losses that naturally arose in the usual course of things',
          'Punitive damages without actual loss proof',
          'Speculative prospective profits'
        ],
        correctIndex: 1
      },
      {
        id: 'q3',
        question: 'Why are uncapped indemnity clauses flagged as high-risk in commercial contracts?',
        options: [
          'They waive arbitration rights',
          'They override statutory Section 73 restrictions and expose parties to unlimited liability',
          'They are automatically void under Bar Council rules',
          'They require mandatory stamp duty payment in all states'
        ],
        correctIndex: 1
      }
    ];

    return {
      courseId: course.id,
      title: `${course.title} — Final Examination`,
      passMark: 65,
      questions: sampleQuestions
    };
  }

  submitQuizAnswers(courseId, answers) {
    const quiz = this.getQuizForLearner(courseId);
    if (!quiz) return { passed: false, score: 0 };

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passMark;

    let cert = null;
    if (passed) {
      const course = (this.state.courses || []).find((c) => c.id === courseId) || {};
      const user = this.state.currentUser || {};
      const randCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      cert = {
        id: `cert-${Date.now()}`,
        userId: user.id || user.uid || 'user-001',
        learnerName: user.name || 'Learner',
        learnerEmail: user.email || '',
        courseId: course.id || courseId,
        courseTitle: course.title || 'Practical Contract Drafting under Indian Jurisprudence',
        certificateNumber: `LWB-2026-${randCode}`,
        score,
        issueDate: new Date().toISOString().split('T')[0],
        verified: true
      };

      if (!this.state.certificates) this.state.certificates = [];
      this.state.certificates.unshift(cert);
      this.addToast(`Congratulations! You passed with ${score}% and earned Certificate #${cert.certificateNumber}`, 'success');
      this.notify();
    } else {
      this.addToast(`Exam score: ${score}%. Minimum passing grade is ${quiz.passMark}%.`, 'warning');
    }

    return { passed, score, certificate: cert };
  }

  // --- Reset Local Demo State ---
  resetDemoData() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    ['lawable_state_v1', 'lawable_state_v2', 'lawable_state_v3', 'lawable_state_v4'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('lawable_state_v4', JSON.stringify(INITIAL_DATA));
    this.addToast('Demo workspace reset to initial state', 'success');
    this.notify();
  }
}

export const store = new LawableStore();
