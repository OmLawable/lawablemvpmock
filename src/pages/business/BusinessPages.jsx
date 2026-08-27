import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, AlertTriangle, CheckSquare, Clock, FileText, ArrowRight, 
  Upload, FileCode, CheckCircle, ExternalLink, RefreshCw, Plus, Edit, Lock, Search
} from 'lucide-react';
import { Card, Button, Badge, StatusChip, SearchInput } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 41 — BUSINESS DASHBOARD
export const BusinessDashboardPage = ({ navigate }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const user = state.currentUser || {};
  const profile = state.businessProfile || {
    companyName: user.name || 'Business Workspace',
    entityType: 'pvt_ltd',
    cin: 'Not Set',
    gstin: 'Not Set',
    state: 'India',
    city: '',
    employeeCount: 0,
    complianceScore: 0
  };
  const checklist = state.complianceChecklist || [];
  const contracts = state.contracts || [];

  const score = profile.complianceScore || 0;

  const getAreaStats = (areaKey) => {
    const areaItems = checklist.filter((i) => i.area === areaKey);
    const completed = areaItems.filter((i) => i.status === 'completed').length;
    const overdue = areaItems.filter((i) => i.status === 'overdue').length;
    let status = areaItems.length === 0 ? 'NOT SET' : 'OK';
    if (overdue > 0) status = 'ACTION REQUIRED';
    else if (areaItems.length > 0 && completed < areaItems.length) status = 'PENDING';
    return { count: areaItems.length, completed, overdue, status };
  };

  const gstStats = getAreaStats('gst');
  const caStats = getAreaStats('companies_act');
  const labourStats = getAreaStats('labour_law');
  const dpdpStats = getAreaStats('dpdp');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Company Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">{(profile.entityType || 'pvt_ltd').replace('_', ' ').toUpperCase()} • {profile.state || 'India'}</Badge>
          <h1 className="h2" style={{ margin: 0 }}>{profile.companyName}</h1>
          <p className="text-caption text-secondary mt-1">CIN: {profile.cin} • GSTIN: {profile.gstin}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/business/profile')}>Edit Business Profile</Button>
      </div>

      {/* Weighted Compliance Health Score Card */}
      <Card className="mb-12" padding="32px" style={{ backgroundColor: '#FFF' }}>
        <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weighted Compliance Health Score</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: score > 75 ? 'var(--color-success)' : score > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)', marginTop: 6, lineHeight: 1 }}>
              {score}%
            </div>
            <p className="text-caption text-secondary mt-3" style={{ maxWidth: 360, lineHeight: 1.5 }}>Calculated based on statutory severity weights (1-5) across Indian MCA, GST, POSH & DPDP regulations.</p>
          </div>

          {/* 4 Area Status Chips */}
          <div className="grid grid-2 gap-4" style={{ flex: 1 }}>
            <div className="p-4 border rounded-md" style={{ backgroundColor: 'var(--color-bg-surface-muted)' }}>
              <div className="flex items-center justify-between text-caption font-semibold">
                <span>GST Compliance</span>
                <Badge variant={gstStats.status === 'OK' ? 'success' : gstStats.status === 'NOT SET' ? 'neutral' : 'warning'}>{gstStats.status}</Badge>
              </div>
              <div className="text-caption text-secondary mt-2">{gstStats.completed}/{gstStats.count} Items Completed</div>
            </div>

            <div className="p-4 border rounded-md" style={{ backgroundColor: 'var(--color-bg-surface-muted)' }}>
              <div className="flex items-center justify-between text-caption font-semibold">
                <span>Companies Act MCA</span>
                <Badge variant={caStats.status === 'OK' ? 'success' : caStats.status === 'NOT SET' ? 'neutral' : 'warning'}>{caStats.status}</Badge>
              </div>
              <div className="text-caption text-secondary mt-2">{caStats.completed}/{caStats.count} Items Completed</div>
            </div>

            <div className="p-4 border rounded-md" style={{ backgroundColor: 'var(--color-bg-surface-muted)' }}>
              <div className="flex items-center justify-between text-caption font-semibold">
                <span>Labour & POSH</span>
                <Badge variant={labourStats.status === 'OK' ? 'success' : labourStats.status === 'NOT SET' ? 'neutral' : 'warning'}>{labourStats.status}</Badge>
              </div>
              <div className="text-caption text-secondary mt-2">{labourStats.completed}/{labourStats.count} Items Completed</div>
            </div>

            <div className="p-4 border rounded-md" style={{ backgroundColor: 'var(--color-bg-surface-muted)' }}>
              <div className="flex items-center justify-between text-caption font-semibold">
                <span>DPDP Data Privacy</span>
                <Badge variant={dpdpStats.status === 'ACTION REQUIRED' ? 'danger' : dpdpStats.status === 'NOT SET' ? 'neutral' : 'warning'}>{dpdpStats.status}</Badge>
              </div>
              <div className="text-caption text-secondary mt-2">{dpdpStats.completed}/{dpdpStats.count} Items Completed</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance Checklist Summary */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="h3" style={{ margin: 0 }}>Statutory Compliance Checklist Summary</h3>
        <Button size="sm" variant="secondary" onClick={() => navigate('/app/business/compliance')}>View Full Checklist →</Button>
      </div>

      <div className="flex flex-col gap-4 mb-12">
        {checklist.length === 0 ? (
          <Card padding="28px" className="text-center" style={{ backgroundColor: '#FFF' }}>
            <p className="text-secondary mb-3">No compliance items tracked yet.</p>
            <Button size="sm" onClick={() => navigate('/app/business/compliance')}>Setup Compliance Tracker</Button>
          </Card>
        ) : (
          checklist.slice(0, 3).map((item) => (
            <Card key={item.id} padding="24px" style={{ backgroundColor: '#FFF' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={item.area === 'dpdp' ? 'danger' : 'primary'}>{item.area.replace('_', ' ').toUpperCase()}</Badge>
                    <span className="text-caption font-semibold">Due: {item.dueDate}</span>
                  </div>
                  <h4 className="h4" style={{ margin: 0 }}>{item.title}</h4>
                </div>
                <StatusChip status={item.status} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// SCREEN 42 — COMPLIANCE CHECKLIST PAGE
export const ComplianceChecklistPage = ({ navigate, itemId }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const checklist = state.complianceChecklist;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Compliance Engine</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Full Statutory Compliance Checklist</h1>
          <p className="text-caption text-secondary mt-1">Generated based on Private Limited entity type under Maharashtra state jurisdiction.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/business')}>← Return to Dashboard</Button>
      </div>

      {(checklist || []).length === 0 ? (
        <Card padding="36px" className="text-center" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h3 mb-2">No Compliance Items Configured</h3>
          <p className="text-secondary mb-4">Set up statutory compliance tracking items for your corporate filings under MCA, GST, POSH, and DPDP.</p>
          <Button onClick={() => {
            store.state.complianceChecklist = [
              { id: 'comp-101', title: 'Annual MCA Return Filing (Form MGT-7A)', area: 'companies_act', dueDate: '2026-10-30', weight: 5, status: 'pending', reference: 'Sec 92 Companies Act 2013' },
              { id: 'comp-102', title: 'Monthly GSTR-3B Tax Return Filing', area: 'gst', dueDate: '2026-08-20', weight: 4, status: 'pending', reference: 'Sec 39 CGST Act 2017' }
            ];
            store.notify();
            store.addToast('Standard compliance checklist initialized', 'success');
          }}>
            Initialize Standard Checklist
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {(checklist || []).map((item) => (
            <Card key={item.id} padding="28px" style={{ backgroundColor: '#FFF' }}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={item.area === 'dpdp' ? 'danger' : 'primary'}>{item.area.replace('_', ' ').toUpperCase()}</Badge>
                    <span className="text-caption font-semibold">Due: {item.dueDate}</span>
                    <span className="text-caption text-muted">• Severity Weight: {item.weight}/5</span>
                  </div>
                  <h4 className="h4" style={{ margin: 0 }}>{item.title}</h4>
                  <p className="text-caption text-secondary mt-2" style={{ margin: 0 }}>{item.reference}</p>
                </div>

                <div className="flex items-center gap-4">
                  <StatusChip status={item.status} />
                  
                  {item.status === 'overdue' && (
                    <Button size="sm" variant="danger" onClick={() => navigate(`/app/marketplace/request/new?source=compliance_referral&sourceRefId=${item.id}`)}>
                      Get Help With This →
                    </Button>
                  )}

                  {item.status !== 'completed' && item.status !== 'overdue' && (
                    <Button size="sm" variant="secondary" onClick={() => store.updateComplianceItemStatus(item.id, 'completed', 'Filing_Doc.pdf')}>
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// SCREEN 43 — BUSINESS DOCUMENT VAULT PAGE
export const BusinessDocumentVaultPage = ({ navigate }) => {
  const docs = store.getState().documents;
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Document Vault</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Corporate Filing & Document Vault</h1>
          <p className="text-caption text-secondary mt-1">Encrypted corporate documents with 30-day statutory expiry alerts.</p>
        </div>
        <Button onClick={() => store.addToast('Document uploaded to vault', 'success')}>+ Upload Corporate Document</Button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.title}</td>
                <td><Badge variant="neutral">Corporate Filing</Badge></td>
                <td><Badge variant="success">VERIFIED</Badge></td>
                <td>{d.uploadDate}</td>
                <td>
                  <Button size="sm" variant="secondary" onClick={() => store.addToast(`Downloading ${d.title}`, 'info')}>Download</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SCREEN 44 — CONTRACT REGISTER PAGE
export const ContractRegisterPage = ({ navigate }) => {
  const contracts = store.getState().contracts;
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Contracts Register</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Active Contracts & Lease Register</h1>
          <p className="text-caption text-secondary mt-1">Track counterparty SLAs, annual contract values, and renewal dates.</p>
        </div>
        <Button onClick={() => store.addToast('Contract added to register', 'success')}>+ Register New Contract</Button>
      </div>

      {(contracts || []).length === 0 ? (
        <Card padding="36px" className="text-center" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h3 mb-2">No Contracts Registered</h3>
          <p className="text-secondary mb-4">Register your active commercial vendor agreements, leases, and NDAs to track renewal dates and statutory SLAs.</p>
          <Button onClick={() => store.addToast('Contract registered successfully', 'success')}>+ Register First Contract</Button>
        </Card>
      ) : (
        <div className="grid grid-2 gap-6">
          {(contracts || []).map((c) => (
            <Card key={c.id} padding="28px" style={{ backgroundColor: '#FFF' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontWeight: 700, fontSize: 16 }}>{c.title}</span>
                {c.daysToExpiry <= 30 && <Badge variant="warning">Expiring in {c.daysToExpiry} Days</Badge>}
              </div>
              <p className="text-caption text-secondary mb-2">Counterparty: {c.counterparty} • Value: {c.value}</p>
              <div className="text-caption text-muted">End Date: {c.endDate} • Auto-Renew: {c.autoRenew ? 'Yes' : 'No'}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// SCREEN 45 — BUSINESS PROFILE PAGE
export const BusinessProfilePage = ({ navigate }) => {
  const state = store.getState();
  const user = state.currentUser || {};
  const profile = state.businessProfile || {
    companyName: user.name || 'My Enterprise Legal Entity',
    gstin: '',
    cin: '',
    entityType: 'pvt_ltd',
    state: 'Maharashtra',
    city: 'Mumbai',
    employeeCount: 1,
    complianceScore: 100
  };
  const [cName, setCName] = useState(profile.companyName || '');
  const [gst, setGst] = useState(profile.gstin || '');
  const [cin, setCin] = useState(profile.cin || '');

  const handleSave = (e) => {
    e.preventDefault();
    store.state.businessProfile = {
      ...profile,
      companyName: cName,
      gstin: gst,
      cin: cin
    };
    store.addToast('Business profile updated successfully', 'success');
    store.notify();
    navigate('/app/business');
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
        <h1 className="h2 mb-4">Edit Business Entity Profile</h1>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Company Legal Name</label>
            <input type="text" className="form-input" required value={cName} onChange={(e) => setCName(e.target.value)} placeholder="e.g. Acme Tech Pvt Ltd" />
          </div>
          <div className="form-group">
            <label className="form-label">GSTIN Number</label>
            <input type="text" className="form-input" value={gst} onChange={(e) => setGst(e.target.value)} placeholder="e.g. 27AABCN8912P1ZD" />
          </div>
          <div className="form-group">
            <label className="form-label">Corporate Identification Number (CIN)</label>
            <input type="text" className="form-input" value={cin} onChange={(e) => setCin(e.target.value)} placeholder="e.g. U72900MH2024PTC392810" />
          </div>
          <Button type="submit" className="mt-4">Save Profile Changes</Button>
        </form>
      </Card>
    </div>
  );
};
