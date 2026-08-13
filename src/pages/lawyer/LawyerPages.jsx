import React, { useState } from 'react';
import { 
  Shield, CheckCircle, Clock, User, ShoppingBag, AlertTriangle, 
  FileText, Check, X, Send, Plus, Edit
} from 'lucide-react';
import { Card, Button, Badge, StatusChip, MetricCard } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 36 — LAWYER DASHBOARD (ADVOCATE VERIFICATION BANNER REDESIGN)
export const LawyerDashboardPage = ({ navigate }) => {
  const currentUser = store.getState().currentUser;
  const lawyers = store.getState().lawyers;
  const requests = store.getState().requests;
  const lawyer = lawyers.find(l => l.userId === currentUser.id) || lawyers[0];

  const pendingCount = requests.filter(r => r.status === 'submitted').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress' || r.status === 'accepted').length;

  const isVerified = lawyer.verificationStatus === 'verified';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Advocate Verification Status Banner Redesign */}
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
              justify: 'center',
              flexShrink: 0
            }}
          >
            <Shield size={24} style={{ color: isVerified ? '#059669' : '#D97706' }} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span style={{ fontWeight: 700, fontSize: 16, color: isVerified ? '#065F46' : '#92400E' }}>
                Advocate Verification Status: {lawyer.verificationStatus.toUpperCase()}
              </span>
              <Badge variant={isVerified ? 'success' : 'warning'} style={{ padding: '4px 10px' }}>
                {isVerified ? 'Live on Marketplace' : 'Action Required'}
              </Badge>
            </div>
            <p style={{ fontSize: 13, color: '#334155', margin: 0, lineHeight: 1.5 }}>
              {isVerified
                ? 'Your credentials have been verified by Lawable Platform Admin. Your profile is live on Marketplace.'
                : 'Your Bar Council credentials are under review by Admin Ops. You can still manage services.'}
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
        <MetricCard title="Consultation Fee" value={`₹ ${lawyer.consultationFee}`} subtitle="Standard 45 Min Rate" icon={ShoppingBag} onClick={() => navigate('/app/lawyer/profile')} />
        <MetricCard title="Public Rating" value={`★ ${lawyer.rating}`} subtitle={`${lawyer.reviewCount} Verified Reviews`} icon={CheckCircle} />
      </div>

      {/* Pending Requests Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="h3">Client Requests Requiring Advocate Response</h2>
        <Button size="sm" variant="ghost" onClick={() => navigate('/app/lawyer/requests')}>View All Inbox →</Button>
      </div>

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
    </div>
  );
};

// SCREEN 37 & 38 — LAWYER REQUEST INBOX & ACTION DETAIL
export const LawyerRequestsInboxPage = ({ navigate, requestId }) => {
  const requests = store.getState().requests;
  const [selectedId, setSelectedId] = useState(requestId || requests[0]?.id);
  const req = requests.find((r) => r.id === selectedId) || requests[0];

  const handleAction = (status, note) => {
    store.updateRequestStatus(req.id, status, note);
  };

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
              <p className="text-caption text-secondary mt-1">Client: {req.clientName} • Source: {req.source.toUpperCase()}</p>
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
            {req.timeline.map((ev, idx) => (
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
  const currentUser = store.getState().currentUser;
  const lawyers = store.getState().lawyers;
  const lawyer = lawyers.find(l => l.userId === currentUser.id) || lawyers[0];

  const [fee, setFee] = useState(lawyer.consultationFee);
  const [bio, setBio] = useState(lawyer.bio);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
        <h1 className="h2 mb-4">Marketplace Advocate Profile</h1>
        <div className="form-group">
          <label className="form-label">Bar Council Enrolment Number (Verification Controlled)</label>
          <input type="text" className="form-input" disabled value={lawyer.barCouncilNo} />
        </div>
        <div className="form-group">
          <label className="form-label">Consultation Fee (INR)</label>
          <input type="number" className="form-input" value={fee} onChange={(e) => setFee(e.target.value)} />
        </div>
        <div className="form-group mb-6">
          <label className="form-label">Professional Bio</label>
          <textarea className="form-textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <Button onClick={() => store.addToast('Profile updated!', 'success')}>Save Profile Updates</Button>
      </Card>
    </div>
  );
};

// SCREEN 40 — LAWYER SERVICES CATALOGUE MANAGEMENT
export const LawyerServicesCataloguePage = ({ navigate }) => {
  const services = store.getState().services;
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
            <Badge variant="primary" className="mb-2">{s.serviceType.replace('_', ' ').toUpperCase()}</Badge>
            <h3 className="h3 mb-2">{s.title}</h3>
            <p className="text-caption text-secondary mb-4" style={{ lineHeight: 1.5 }}>{s.description}</p>
            <div className="flex items-center justify-between pt-3 border-t text-caption" style={{ borderColor: 'var(--color-border)' }}>
              <span>Timeline: {s.timelineDays} Days</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 16 }}>₹ {s.price}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
