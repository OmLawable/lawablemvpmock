import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Clock, CheckSquare, Sparkles, BookOpen, FileText, AlertTriangle, 
  Search, Eye, Check, X, Lock, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 50 to 65 — SINGLE OPERATIONAL ADMIN PANEL (32px PADDING, 24px GAP)
export const AdminOpsDashboardPage = ({ navigate, activeTab = 'overview' }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  // Compliance Previewer Tool State (PRD FR-6.7)
  const [prevEntity, setPrevEntity] = useState('pvt_ltd');
  const [prevState, setPrevState] = useState('Maharashtra');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Central Admin Ops</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Lawable Operational Administration</h1>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="tabs mb-8">
        {['overview', 'lawyers', 'users', 'compliance_cms', 'ai_oversight', 'blogs', 'audit_logs'].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => navigate(`/admin/${tab}`)}
          >
            {tab.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD (24px Grid Gap, 32px Card Padding) */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-4 gap-6 mb-12">
            <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Registered Users</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-primary)', marginTop: 6 }}>{state.adminUsers.length}</div>
            </Card>

            <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Lawyer Queue</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-warning)', marginTop: 6 }}>
                {state.lawyers.filter((l) => l.verificationStatus === 'pending').length}
              </div>
            </Card>

            <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open Service Requests</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-info)', marginTop: 6 }}>{state.requests.length}</div>
            </Card>

            <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Conversations (24h)</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-success)', marginTop: 6 }}>{state.aiConversations.length}</div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: LAWYER VERIFICATION QUEUE (32px Card Padding) */}
      {activeTab === 'lawyers' && (
        <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h3 mb-6">Pending Lawyer Verification Queue (SLA Target: 48h)</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Advocate Name</th>
                  <th>Bar Council No</th>
                  <th>State Enrolment</th>
                  <th>SLA Age</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.lawyers.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.name}</td>
                    <td>{l.barCouncilNo}</td>
                    <td>{l.enrolmentState}</td>
                    <td>
                      <Badge variant={l.submissionAgeHours >= 48 ? 'danger' : 'neutral'}>
                        {l.submissionAgeHours}h Old
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={l.verificationStatus === 'verified' ? 'success' : 'warning'}>
                        {l.verificationStatus.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="secondary" onClick={() => setSelectedLawyer(l)}>Review Credentials</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: USER MANAGEMENT & SUSPENSION ONLY (32px Card Padding) */}
      {activeTab === 'users' && (
        <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h3 mb-6">User Directory & Role Permissions (Suspension Only in MVP)</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.adminUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><Badge variant="primary">{u.role.toUpperCase()}</Badge></td>
                    <td><Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status.toUpperCase()}</Badge></td>
                    <td>
                      <Button size="sm" variant="secondary" onClick={() => store.addToast(`Toggled user suspension for ${u.name}`, 'warning')}>
                        {u.status === 'active' ? 'Suspend User' : 'Reactivate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: COMPLIANCE CMS & APPLICABILITY PREVIEWER (32px Card Padding) */}
      {activeTab === 'compliance_cms' && (
        <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h3 mb-2">Interactive Compliance Applicability Rules Previewer</h3>
          <p className="text-body text-secondary mb-6">Simulate business profile parameters to verify generated statutory checklist items.</p>

          <div className="flex gap-6 mb-8">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Hypothetical Entity Type</label>
              <select className="form-select" value={prevEntity} onChange={(e) => setPrevEntity(e.target.value)}>
                <option value="pvt_ltd">Private Limited (Pvt Ltd)</option>
                <option value="llp">Limited Liability Partnership (LLP)</option>
                <option value="proprietorship">Proprietorship</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">State Jurisdiction</label>
              <select className="form-select" value={prevState} onChange={(e) => setPrevState(e.target.value)}>
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Karnataka</option>
              </select>
            </div>
          </div>

          <div className="p-6 border rounded-md bg-muted">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Simulated Statutory Checklist Output ({prevEntity.toUpperCase()} / {prevState}):</div>
            <ul className="flex flex-col gap-3 mt-3 text-body" style={{ fontSize: 13 }}>
              <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Form MGT-7A Annual MCA Filing (Weight 5/5)</li>
              <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Monthly GSTR-3B Filing (Weight 4/5)</li>
              <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> DPDP Data Fiduciary Privacy Notice Audit (Weight 5/5)</li>
            </ul>
          </div>
        </Card>
      )}

      {/* TAB 5: AUDIT LOG INSPECTOR (32px Card Padding) */}
      {activeTab === 'audit_logs' && (
        <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h3 mb-6">System Audit Trail & State-Change Inspector</h3>
          <div className="flex flex-col gap-4">
            {state.auditLogs.map((log) => (
              <div key={log.id} className="p-4 border rounded-md bg-muted" style={{ fontSize: 13 }}>
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>{log.actor} — <span style={{ color: 'var(--color-primary)' }}>{log.action}</span></span>
                  <span className="text-muted text-caption">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-caption text-secondary">Entity: {log.entity} #{log.entityId}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Credential Viewer Modal */}
      {selectedLawyer && (
        <Modal title={`Review Credentials for ${selectedLawyer.name}`} onClose={() => setSelectedLawyer(null)}>
          <div className="p-5 border rounded-md mb-6 bg-muted">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Bar Council No: {selectedLawyer.barCouncilNo}</div>
            <div className="text-body text-secondary">Qualification: {selectedLawyer.qualification}</div>
            <div className="text-body text-secondary">Experience: {selectedLawyer.experience} Years</div>
            <div className="mt-4 p-3 border rounded bg-white font-mono text-caption">
              Document: {selectedLawyer.credentialsUrl} [Verified Digital Copy]
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { store.verifyLawyer(selectedLawyer.id, false, 'Incomplete enrolment document'); setSelectedLawyer(null); }}>
              Reject Application
            </Button>
            <Button onClick={() => { store.verifyLawyer(selectedLawyer.id, true); setSelectedLawyer(null); }}>
              Verify Advocate Credentials
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
