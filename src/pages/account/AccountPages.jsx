import React, { useState, useEffect } from 'react';
import { User, Settings, Bell, Shield, Download, Trash2, CheckCircle, Sparkles, BookOpen, Clock, FileText, ArrowRight, Award, Plus, ShoppingBag } from 'lucide-react';
import { Card, Button, Badge, ConfirmationDialog, MetricCard, StatusChip } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// CLIENT / INDIVIDUAL DASHBOARD (CENTER ALIGNED HEADER & BALANCED SPACING)
export const ClientDashboardPage = ({ navigate }) => {
  const state = store.getState() || {};
  const user = state.currentUser || { name: 'User', role: 'client' };
  const aiConvs = state.aiConversations || [];
  const requests = state.requests || [];
  const docs = state.documents || [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Center Aligned Welcome Banner */}
      <Card className="mb-10 text-center py-10 px-8" padding="40px" style={{ backgroundColor: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Badge variant="primary" className="mb-3" style={{ padding: '8px 16px', fontSize: 13 }}>
          <Sparkles size={14} style={{ color: 'var(--color-primary)' }} /> Client Legal Workspace
        </Badge>
        <h1 className="h1 mb-3" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>Welcome back, {user.name}</h1>
        <p className="text-large text-secondary mb-8" style={{ maxWidth: 620, margin: '0 auto 28px', fontSize: 16, lineHeight: 1.65 }}>
          Access conversational AI legal research, guided contract drafting, and Bar Council verified advocate reviews.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/app/ai')}>
            <Sparkles size={16} /> Open Lawable AI
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/app/marketplace')}>
            Find Advocates
          </Button>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-4 gap-6 mb-12">
        <MetricCard title="AI Research Limit" value="2 / 50" subtitle="Messages Used Today" icon={Sparkles} onClick={() => navigate('/app/ai')} />
        <MetricCard title="Active Requests" value={requests.length} subtitle="Advocate Consultations" icon={Clock} onClick={() => navigate('/app/requests')} />
        <MetricCard title="Saved Documents" value={docs.length} subtitle="Drafts & Vault Files" icon={FileText} onClick={() => navigate('/app/documents')} />
        <MetricCard title="Academy Courses" value="6" subtitle="Accredited Modules" icon={BookOpen} onClick={() => navigate('/app/academy')} />
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-2 gap-8">
        <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="h3" style={{ margin: 0 }}>Recent Lawable AI Research</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/app/ai')}>View All →</Button>
          </div>
          <div className="flex flex-col gap-3">
            {aiConvs.slice(0, 3).map((c) => (
              <div key={c.id} className="p-4 border rounded-md cursor-pointer hover:bg-muted" onClick={() => navigate('/app/ai')}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</span>
                  {c.riskLevel === 'high' && <Badge variant="danger">High Risk Flagged</Badge>}
                </div>
                <div className="text-caption text-secondary">Updated: {new Date(c.updatedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="h3" style={{ margin: 0 }}>Active Advocate Requests</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/app/requests')}>View All →</Button>
          </div>
          <div className="flex flex-col gap-3">
            {requests.slice(0, 3).map((r) => (
              <div key={r.id} className="p-4 border rounded-md cursor-pointer hover:bg-muted" onClick={() => navigate(`/app/requests/${r.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{r.serviceTitle}</span>
                  <StatusChip status={r.status} />
                </div>
                <div className="text-caption text-secondary">Advocate: {r.lawyerName} • Fee: ₹ {r.fee}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// STUDENT DASHBOARD (CENTER ALIGNED HEADER & BALANCED SPACING)
export const StudentDashboardPage = ({ navigate }) => {
  const [state, setState] = useState(store.getState() || {});

  useEffect(() => {
    return store.subscribe((newState) => setState(newState));
  }, []);

  const user = state.currentUser || { name: 'Student', role: 'student' };
  const courses = state.courses || [];

  // Filter certificates specifically for this logged-in student
  const userCertificates = (state.certificates || []).filter(
    (c) => (c.userId && (c.userId === user.id || c.userId === user.uid)) ||
           (c.learnerEmail && user.email && c.learnerEmail.toLowerCase() === user.email.toLowerCase()) ||
           (c.learnerName && user.name && c.learnerName.toLowerCase() === user.name.toLowerCase() && user.name !== 'Student')
  );

  // Filter practice drafts specifically for this logged-in student
  const userDrafts = (state.documents || []).filter(
    (d) => (d.userId && (d.userId === user.id || d.userId === user.uid)) ||
           (d.ownerEmail && user.email && d.ownerEmail.toLowerCase() === user.email.toLowerCase()) ||
           (d.ownerName && user.name && d.ownerName.toLowerCase() === user.name.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Center Aligned Welcome Banner */}
      <Card className="mb-10 text-center py-10 px-8" padding="40px" style={{ backgroundColor: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Badge variant="primary" className="mb-3" style={{ padding: '8px 16px', fontSize: 13 }}>
          Law Student Workspace
        </Badge>
        <h1 className="h1 mb-3" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>Welcome, {user.name}</h1>
        <p className="text-large text-secondary mb-8" style={{ maxWidth: 620, margin: '0 auto 28px', fontSize: 16, lineHeight: 1.65 }}>
          Master practical contract drafting, legal research AI tools, and earn accredited Bar Council-aligned certificates.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/app/academy')}>
            <BookOpen size={16} /> Explore Courses
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/app/ai/draft')}>
            Practise Drafting
          </Button>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-4 gap-6 mb-12">
        <MetricCard title="Available Courses" value={courses.length} subtitle="Accredited Modules" icon={BookOpen} onClick={() => navigate('/app/academy')} />
        <MetricCard title="Earned Certificates" value={userCertificates.length} subtitle="Passed Examinations" icon={Award} onClick={() => navigate('/app/certificates')} />
        <MetricCard title="AI Research Limit" value="2 / 50" subtitle="Daily Messages Free" icon={Sparkles} onClick={() => navigate('/app/ai')} />
        <MetricCard title="Practise Drafts" value={userDrafts.length} subtitle="Saved Exercises" icon={FileText} onClick={() => navigate('/app/documents')} />
      </div>

      {/* Course Overview Cards */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="h3" style={{ margin: 0 }}>Enrolled & Available Academy Courses</h3>
        <Button size="sm" variant="ghost" onClick={() => navigate('/app/academy')}>View All Courses →</Button>
      </div>

      <div className="grid grid-3 gap-6">
        {courses.slice(0, 3).map((crs) => (
          <Card key={crs.id} hover onClick={() => navigate(`/app/academy/${crs.id}`)} padding="32px" style={{ backgroundColor: '#FFF' }}>
            <Badge variant="primary" className="mb-3">{crs.category}</Badge>
            <h3 className="h4 mb-2">{crs.title}</h3>
            <p className="text-caption text-secondary mb-4" style={{ lineHeight: 1.5 }}>{crs.description}</p>
            <div className="flex items-center justify-between pt-3 border-t text-caption" style={{ borderColor: 'var(--color-border)' }}>
              <span>{crs.duration} • {crs.level}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Continue Course →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// USER PROFILE
export const ProfilePage = ({ navigate }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const user = state.currentUser || { name: '', email: '', role: 'client', phone: '' };
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');

  const userInitial = (user.name ? user.name[0] : (user.email ? user.email[0] : 'U')).toUpperCase();

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28, flexShrink: 0 }}>
              {userInitial}
            </div>
          )}
          <div>
            <h1 className="h2" style={{ margin: 0 }}>{user.name || 'Account Profile'}</h1>
            <p className="text-caption text-secondary mt-1">{user.email || 'No email attached'} • Active Role: {(user.role || 'CLIENT').toUpperCase()}</p>
            <Badge variant="success" className="mt-2">Email Verified</Badge>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          store.setCurrentUser({ name, phone });
          store.addToast('Profile saved!', 'success');
        }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarthak Kadam" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <Button type="submit" className="mt-4">Update Profile</Button>
        </form>
      </Card>
    </div>
  );
};

// SETTINGS & DATA MANAGEMENT
export const SettingsPage = ({ navigate }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <ConfirmationDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await store.logout();
          setDeleteOpen(false);
          navigate('/auth/login');
        }}
        title="Confirm Account Deletion"
        message="This action is permanent and soft-deletes your documents, AI conversations, and service requests."
        confirmText="Permanently Delete Account"
      />

      <Card className="mb-6" padding="32px" style={{ backgroundColor: '#FFF' }}>
        <h1 className="h2 mb-4">Account & Security Settings</h1>
        <div className="form-group">
          <label className="form-label">Change Password</label>
          <input type="password" className="form-input" placeholder="New Password" />
        </div>
        <Button variant="secondary" onClick={() => store.addToast('Password updated successfully', 'success')}>
          Update Password
        </Button>
      </Card>

      <Card className="mb-6" padding="32px" style={{ backgroundColor: '#FFF' }}>
        <h2 className="h3 mb-2">Data Privacy & Export</h2>
        <p className="text-caption text-secondary mb-4">Download a full JSON/CSV copy of your AI transcripts and compliance records.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => store.addToast('Data export bundle downloaded!', 'success')}>
            Request Data Export
          </Button>
          <Button variant="ghost" onClick={() => store.resetDemoData()}>
            Reset Local Demo State
          </Button>
        </div>
      </Card>

      <Card padding="32px" style={{ backgroundColor: '#FFF', borderColor: 'var(--color-danger-border)' }}>
        <h2 className="h3 mb-2 text-danger" style={{ color: 'var(--color-danger)' }}>Danger Zone</h2>
        <p className="text-caption text-secondary mb-4">Soft-delete user account and clear session data.</p>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          Delete Lawable Account
        </Button>
      </Card>
    </div>
  );
};

// NOTIFICATIONS CENTER
export const NotificationsPage = ({ navigate }) => {
  const notifications = store.getState()?.notifications || [];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 className="h1 mb-6">Notifications Center</h1>
      {notifications.length === 0 ? (
        <Card className="text-center py-12" padding="32px" style={{ backgroundColor: '#FFF' }}>
          <Bell size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
          <h3 className="h3 mb-2">No Notifications Right Now</h3>
          <p className="text-caption text-secondary mb-6">You're all caught up! Platform alerts and advocate request updates will appear here.</p>
          <Button variant="secondary" onClick={() => navigate('/app')}>Return to Dashboard</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((n) => (
            <Card key={n.id} hover padding="24px" style={{ backgroundColor: '#FFF' }} onClick={() => { store.markNotificationRead(n.id); navigate(n.link || '/app'); }}>
              <div className="flex items-center justify-between mb-2">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                {!n.read && <Badge variant="danger">Unread</Badge>}
              </div>
              <p className="text-body text-secondary mb-3">{n.message}</p>
              <div className="text-caption text-muted">{n.timestamp}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
