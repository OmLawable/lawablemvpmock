import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, Clock, User, ShoppingBag, AlertTriangle, 
  FileText, Check, X, Send, Plus, Edit
} from 'lucide-react';
import { Card, Button, Badge, StatusChip, MetricCard } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';
import { saveLawyerProfileToFirebase } from '../../services/firebaseService';

// SCREEN 36 — LAWYER DASHBOARD
export const LawyerDashboardPage = ({ navigate }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const currentUser = state.currentUser || {};
  const lawyers = state.lawyers || [];
  const requests = state.requests || [];
  const lawyer = (state.lawyerProfile) || lawyers.find(l => l.userId === currentUser.id) || {
    id: currentUser.id || 'lawyer-me',
    name: currentUser.name || 'Advocate',
    specialties: ['General Practice'],
    verificationStatus: 'verified',
    consultationFee: 0,
    rating: 5.0,
    reviewCount: 0,
    barCouncilNo: 'Not Set',
    bio: '',
    city: '',
    experienceYears: 0
  };

  const pendingCount = requests.filter(r => r.status === 'submitted').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress' || r.status === 'accepted').length;

  const isVerified = (lawyer.verificationStatus || 'verified') === 'verified';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Advocate Verification Status Banner */}
      <div
        className="p-6 border rounded-lg mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{
          backgroundColor: isVerified ? '#ECFDF5' : '#FFFBEB',
          borderColor: isVerified ? '#A7F3D0' : '#FDE68A',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: isVerified ? '#D1FAE5' : '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Shield size={24} style={{ color: isVerified ? '#059669' : '#D97706' }} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span style={{ fontWeight: 700, fontSize: 16, color: isVerified ? '#065F46' : '#92400E' }}>
                Advocate Verification Status: {(lawyer.verificationStatus || 'verified').toUpperCase()}
              </span>
              <Badge variant={isVerified ? 'success' : 'warning'} style={{ padding: '4px 10px' }}>
                {isVerified ? 'Live on Marketplace' : 'Action Required'}
              </Badge>
            </div>
            <p style={{ fontSize: 13, color: '#334155', margin: 0, lineHeight: 1.5 }}>
              {isVerified
                ? 'Your credentials have been verified by Lawable Platform Admin. Your profile is active on the Marketplace.'
                : 'Your Bar Council credentials are under review by Admin Ops. You can still manage your services.'}
            </p>
          </div>
        </div>
        <Button
          size="md"
          variant="secondary"
          onClick={() => navigate('/app/lawyer/profile')}
          style={{ whiteSpace: 'nowrap', backgroundColor: '#FFFFFF', borderColor: isVerified ? '#6EE7B7' : '#FCD34D' }}
        >
          Manage Credentials
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-4 gap-6 mb-8">
        <MetricCard title="Pending Inbox" value={pendingCount} subtitle="Requires Advocate Action" icon={Clock} onClick={() => navigate('/app/lawyer/requests')} />
        <MetricCard title="Active Matters" value={inProgressCount} subtitle="In Progress Review" icon={FileText} onClick={() => navigate('/app/lawyer/requests')} />
        <MetricCard title="Consultation Fee" value={`₹ ${lawyer.consultationFee || 2500}`} subtitle="Standard 45 Min Rate" icon={ShoppingBag} onClick={() => navigate('/app/lawyer/profile')} />
        <MetricCard title="Public Rating" value={`★ ${lawyer.rating || 5.0}`} subtitle={`${lawyer.reviewCount || 0} Verified Reviews`} icon={CheckCircle} />
      </div>

      {/* Pending Requests Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="h3">Client Requests Requiring Advocate Response</h2>
        <Button size="sm" variant="ghost" onClick={() => navigate('/app/lawyer/requests')}>View All Inbox →</Button>
      </div>

      {requests.length === 0 ? (
        <Card padding="36px" className="text-center" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h3 mb-2">No Active Client Requests</h3>
          <p className="text-secondary mb-4">When clients book consultations or escalate contract reviews from the AI assistant, they will appear here in your advocate inbox.</p>
          <Button variant="secondary" onClick={() => navigate('/app/lawyer/services')}>Manage Services Catalogue</Button>
        </Card>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Client</th>
                <th>Service Title</th>
                <th>Source</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>#{r.id}</td>
                  <td>{r.clientName}</td>
                  <td>{r.serviceTitle}</td>
                  <td><Badge variant="neutral">{r.source}</Badge></td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹ {r.fee}</td>
                  <td><StatusChip status={r.status} /></td>
                  <td>
                    <Button size="sm" onClick={() => navigate(`/app/lawyer/requests/${r.id}`)}>Open Detail</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// SCREEN 37 & 38 — LAWYER REQUEST INBOX & ACTION DETAIL
export const LawyerRequestsInboxPage = ({ navigate, requestId }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const requests = state.requests || [];
  const [selectedId, setSelectedId] = useState(requestId || requests[0]?.id);
  const req = requests.find((r) => r.id === selectedId) || requests[0];

  const handleAction = (status, note) => {
    if (req) {
      store.updateRequestStatus(req.id, status, note);
    }
  };

  if (requests.length === 0) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="primary" className="mb-2">Advocate Inbox</Badge>
            <h1 className="h2" style={{ margin: 0 }}>Client Legal Matters</h1>
          </div>
          <Button variant="secondary" onClick={() => navigate('/app/lawyer')}>← Back to Dashboard</Button>
        </div>
        <Card padding="48px" className="text-center" style={{ backgroundColor: '#FFF' }}>
          <Clock size={40} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 16px' }} />
          <h3 className="h3 mb-2">Your Inbox is Clean</h3>
          <p className="text-secondary mb-4">No active client service requests at the moment. As clients book consultations or escalate documents, requests will show up here.</p>
          <Button onClick={() => navigate('/app/lawyer')}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32 }}>
      {/* Left Inbox List */}
      <Card padding="24px" style={{ backgroundColor: '#FFF' }}>
        <h3 className="h3 mb-4">Request Inbox</h3>
        <div className="flex flex-col gap-3">
          {requests.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className="p-4 border rounded-md cursor-pointer"
              style={{
                backgroundColor: r.id === selectedId ? 'var(--color-primary-light)' : '#FFF',
                borderColor: r.id === selectedId ? 'var(--color-primary)' : 'var(--color-border)'
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontWeight: 700, fontSize: 13 }}>#{r.id}</span>
                <StatusChip status={r.status} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)' }}>{r.clientName}</div>
              <div className="text-caption text-secondary" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: 2 }}>{r.serviceTitle}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Right Detail Pane */}
      {req && (
        <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="h2" style={{ margin: 0 }}>Request #{req.id}</h1>
                <StatusChip status={req.status} />
              </div>
              <p className="text-caption text-secondary mt-1">Client: {req.clientName} • Source: {(req.source || 'DIRECT').toUpperCase()}</p>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>₹ {req.fee}</div>
          </div>

          <div className="mb-6">
            <h3 className="h4 mb-2">Matter Summary provided by Client</h3>
            <p className="text-body text-secondary p-4 border rounded-md bg-white" style={{ fontSize: 14, lineHeight: 1.6 }}>{req.matterDescription}</p>
          </div>

          {/* Lawyer Action State Machine Buttons */}
          <div className="p-5 border rounded-md mb-8" style={{ backgroundColor: 'var(--color-surface-muted)' }}>
            <h3 className="h4 mb-4">Advocate Status Actions</h3>
            <div className="flex flex-wrap gap-3">
              {req.status === 'submitted' && (
                <>
                  <Button size="sm" onClick={() => handleAction('accepted', 'Advocate accepted client request.')}>
                    <Check size={16} /> Accept Request
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleAction('rejected', 'Advocate rejected request due to conflict of interest.')}>
                    <X size={16} /> Reject Request
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleAction('needs_info', 'Advocate requested additional contract documents.')}>
                    Request Additional Info
                  </Button>
                </>
              )}

              {req.status === 'accepted' && (
                <Button size="sm" onClick={() => handleAction('in_progress', 'Started contract redline and review.')}>
                  <Clock size={16} /> Mark In Progress
                </Button>
              )}

              {req.status === 'in_progress' && (
                <Button size="sm" onClick={() => handleAction('delivered', 'Delivered completed contract review and legal note.')}>
                  <Send size={16} /> Deliver Completed Advice
                </Button>
              )}

              {req.status === 'delivered' && (
                <Button size="sm" variant="secondary" onClick={() => handleAction('completed', 'Client confirmed delivery. Request completed.')}>
                  <CheckCircle size={16} /> Close & Mark Completed
                </Button>
              )}
            </div>
          </div>

          {/* Audit Timeline */}
          <h3 className="h4 mb-4">Audit Timeline</h3>
          <div className="flex flex-col gap-4 pl-4 border-l-2" style={{ borderColor: 'var(--color-primary-border)' }}>
            {(req.timeline || []).map((ev, idx) => (
              <div key={idx} className="text-caption">
                <div style={{ fontWeight: 600, fontSize: 13 }}>{ev.actor} — <span style={{ color: 'var(--color-primary)' }}>{ev.action}</span></div>
                <div className="text-secondary mt-0.5">{ev.note}</div>
                <div className="text-muted mt-1">{new Date(ev.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// SCREEN 39 — LAWYER PROFILE
export const LawyerProfilePage = ({ navigate }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const currentUser = state.currentUser || {};
  const lawyers = state.lawyers || [];
  const lawyer = (state.lawyerProfile) || lawyers.find(l => l.userId === currentUser.id) || {
    id: currentUser.id || 'lawyer-me',
    name: currentUser.name || 'Advocate',
    designation: '',
    experience: 0,
    firm: '',
    city: '',
    state: '',
    practiceAreas: [],
    barCouncilNo: '',
    courtsPracticedIn: [],
    education: '',
    certifications: '',
    bio: '',
    notableCases: '',
    achievements: '',
    publications: '',
    languages: [],
    consultationFee: 2000
  };

  // 1. Basic Identity state (no avatar input as requested)
  const [name, setName] = useState(lawyer.name || '');
  const [designation, setDesignation] = useState(lawyer.designation || '');
  const [experience, setExperience] = useState(lawyer.experience || 0);
  const [firm, setFirm] = useState(lawyer.firm || '');
  const [fee, setFee] = useState(lawyer.consultationFee !== undefined && lawyer.consultationFee !== null ? lawyer.consultationFee : '');

  // 2. Professional Credentials state
  const [practiceAreas, setPracticeAreas] = useState(Array.isArray(lawyer.practiceAreas) ? lawyer.practiceAreas.join(', ') : (lawyer.practiceAreas || ''));
  const [barCouncilNo, setBarCouncilNo] = useState(lawyer.barCouncilNo || '');
  const [courtsPracticedIn, setCourtsPracticedIn] = useState(Array.isArray(lawyer.courtsPracticedIn) ? lawyer.courtsPracticedIn.join(', ') : (lawyer.courtsPracticedIn || ''));
  const [education, setEducation] = useState(lawyer.education || lawyer.qualification || '');
  const [certifications, setCertifications] = useState(lawyer.certifications || '');

  // 3. Experience & Track Record state
  const [bio, setBio] = useState(lawyer.bio || '');
  const [notableCases, setNotableCases] = useState(lawyer.notableCases || '');
  const [achievements, setAchievements] = useState(lawyer.achievements || '');
  const [publications, setPublications] = useState(lawyer.publications || '');
  const [languages, setLanguages] = useState(Array.isArray(lawyer.languages) ? lawyer.languages.join(', ') : (lawyer.languages || ''));

  const handleSave = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...lawyer,
      name,
      designation,
      experience: Number(experience) || 0,
      firm,
      consultationFee: fee !== '' ? Number(fee) : 0,
      practiceAreas: typeof practiceAreas === 'string' ? practiceAreas.split(',').map(s => s.trim()).filter(Boolean) : practiceAreas,
      barCouncilNo,
      courtsPracticedIn: typeof courtsPracticedIn === 'string' ? courtsPracticedIn.split(',').map(s => s.trim()).filter(Boolean) : courtsPracticedIn,
      education,
      certifications,
      bio,
      notableCases,
      achievements,
      publications,
      languages: typeof languages === 'string' ? languages.split(',').map(s => s.trim()).filter(Boolean) : languages
    };

    store.state.lawyerProfile = updatedProfile;

    // Update in lawyers list if exists
    const idx = store.state.lawyers.findIndex(l => l.id === lawyer.id || l.userId === currentUser.id);
    if (idx !== -1) {
      store.state.lawyers[idx] = { ...store.state.lawyers[idx], ...updatedProfile };
    } else {
      store.state.lawyers.unshift(updatedProfile);
    }

    // Direct write to Firebase Firestore
    saveLawyerProfileToFirebase(updatedProfile).then((res) => {
      if (res.success) {
        store.addToast('Profile document saved & synced to Firebase Firestore!', 'success');
      } else {
        console.warn('Firebase sync warning:', res.error);
      }
    });

    store.notify();
    store.addToast('Advocate profile updated successfully with 3 complete sections', 'success');
    navigate('/app/lawyer');
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Badge variant="primary" className="mb-2">Advocate Credentials</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Manage Lawyer Profile</h1>
          <p className="text-caption text-secondary mt-1">Configure your public marketplace profile divided into 3 professional sections.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/lawyer')}>← Back to Dashboard</Button>
      </div>

      <form onSubmit={handleSave}>
        {/* SECTION 1: BASIC IDENTITY */}
        <Card className="mb-8" padding="32px" style={{ backgroundColor: '#FFF' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <User size={22} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h2 className="h3" style={{ margin: 0 }}>1. Basic Identity</h2>
              <p className="text-caption text-secondary mt-0.5">Name, title, professional designation, and experience level</p>
            </div>
          </div>

          <div className="grid grid-2 gap-6 mb-6">
            <div className="form-group">
              <label className="form-label">Full Name (and Title)</label>
              <input type="text" className="form-input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Adv. Priya Malhotra, Senior Counsel" />
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Position</label>
              <input type="text" className="form-input" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior Partner, Founder, Managing Counsel" />
            </div>
          </div>

          <div className="grid grid-3 gap-6">
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input type="number" className="form-input" min={0} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 12" />
            </div>

            <div className="form-group">
              <label className="form-label">Law Firm / Chamber Name</label>
              <input type="text" className="form-input" value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="e.g. Malhotra & Associates Legal" />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee (INR)</label>
              <input type="number" className="form-input" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="e.g. 2500" />
            </div>
          </div>
        </Card>

        {/* SECTION 2: PROFESSIONAL CREDENTIALS */}
        <Card className="mb-8" padding="32px" style={{ backgroundColor: '#FFF' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <Shield size={22} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h2 className="h3" style={{ margin: 0 }}>2. Professional Credentials</h2>
              <p className="text-caption text-secondary mt-0.5">Bar registration, practice specializations, courts, and degrees</p>
            </div>
          </div>

          <div className="grid grid-2 gap-6 mb-6">
            <div className="form-group">
              <label className="form-label">Bar Council Enrolment ID / Reg Number</label>
              <input type="text" className="form-input" required value={barCouncilNo} onChange={(e) => setBarCouncilNo(e.target.value)} placeholder="e.g. MAH/4521/2014" />
            </div>

            <div className="form-group">
              <label className="form-label">Practice Areas / Specializations (Comma Separated)</label>
              <input type="text" className="form-input" value={practiceAreas} onChange={(e) => setPracticeAreas(e.target.value)} placeholder="e.g. Corporate Law, Contract Review, Cyber Law" />
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Courts Practiced In (Comma Separated)</label>
            <input type="text" className="form-input" value={courtsPracticedIn} onChange={(e) => setCourtsPracticedIn(e.target.value)} placeholder="e.g. Supreme Court of India, High Court of Delhi, NCLT" />
          </div>

          <div className="grid grid-2 gap-6">
            <div className="form-group">
              <label className="form-label">Education (Law School & Degrees)</label>
              <input type="text" className="form-input" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. LL.M (Corporate Law, NLSIU), B.A. LL.B" />
            </div>

            <div className="form-group">
              <label className="form-label">Certifications / Additional Qualifications</label>
              <input type="text" className="form-input" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="e.g. CIPP/A Privacy Certified, Bar Mediator" />
            </div>
          </div>
        </Card>

        {/* SECTION 3: EXPERIENCE & TRACK RECORD */}
        <Card className="mb-8" padding="32px" style={{ backgroundColor: '#FFF' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <FileText size={22} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h2 className="h3" style={{ margin: 0 }}>3. Experience & Track Record</h2>
              <p className="text-caption text-secondary mt-0.5">Professional summary, notable cases handled, awards, and publications</p>
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Short Professional Bio / Summary</label>
            <textarea className="form-textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Describe your background, expertise in commercial/civil law, and client focus..." />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Notable Cases or Case Types Handled</label>
            <textarea className="form-textarea" rows={2} value={notableCases} onChange={(e) => setNotableCases(e.target.value)} placeholder="Describe key matters or transaction types handled without breaching confidentiality..." />
          </div>

          <div className="grid grid-2 gap-6 mb-6">
            <div className="form-group">
              <label className="form-label">Key Achievements or Awards</label>
              <input type="text" className="form-input" value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="e.g. Ranked Top 40 Under 40 Corporate Lawyers (2024)" />
            </div>

            <div className="form-group">
              <label className="form-label">Languages Spoken (Comma Separated)</label>
              <input type="text" className="form-input" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. English, Hindi, Marathi" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Publications, Articles, or Legal Commentary</label>
            <input type="text" className="form-input" value={publications} onChange={(e) => setPublications(e.target.value)} placeholder="e.g. Author of 'DPDP Act Compliance Guide' (National Law Journal)" />
          </div>
        </Card>

        <div className="flex justify-end gap-4 mb-12">
          <Button variant="secondary" type="button" onClick={() => navigate('/app/lawyer')}>Cancel</Button>
          <Button type="submit" size="lg">Save Profile Updates</Button>
        </div>
      </form>
    </div>
  );
};

// SCREEN 40 — LAWYER SERVICES CATALOGUE MANAGEMENT
export const LawyerServicesCataloguePage = ({ navigate }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const services = state.services || [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Services Management</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Assigned Marketplace Legal Services</h1>
          <p className="text-caption text-secondary mt-1">Manage fixed-price services, delivery SLAs, and document requirements.</p>
        </div>
        <Button onClick={() => store.addToast('New service proposal submitted to Admin for publishing', 'info')}>+ Propose New Service</Button>
      </div>

      <div className="grid grid-2 gap-6">
        {services.map((s) => (
          <Card key={s.id} padding="28px" style={{ backgroundColor: '#FFF' }}>
            <Badge variant="primary" className="mb-2">{(s.serviceType || 'LEGAL_SERVICE').replace('_', ' ').toUpperCase()}</Badge>
            <h3 className="h3 mb-2">{s.title}</h3>
            <p className="text-caption text-secondary mb-4" style={{ lineHeight: 1.5 }}>{s.description}</p>
            <div className="flex items-center justify-between pt-3 border-t text-caption" style={{ borderColor: 'var(--color-border)' }}>
              <span>Timeline: {s.timelineDays || 3} Days</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 16 }}>₹ {s.price}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
