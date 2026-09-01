import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, ShieldCheck, AlertTriangle, CheckSquare, Clock, FileText, ArrowRight, 
  Upload, FileCode, CheckCircle, ExternalLink, RefreshCw, Plus, Edit, Lock, Search,
  User, Mail, Phone, Globe, MapPin, Hash, Briefcase, Landmark, Users, Award, Scale, HelpCircle,
  Camera, Trash2, Image, Sparkles, Check, Link, Eye, Download, ZoomIn
} from 'lucide-react';
import { Card, Button, Badge, StatusChip, SearchInput, Modal } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 41 — BUSINESS DASHBOARD
export const BusinessDashboardPage = ({ navigate }) => {
  const [state, setState] = useState(store.getState());
  const [viewLogoModal, setViewLogoModal] = useState(false);
  useEffect(() => store.subscribe(setState), []);

  const user = state.currentUser || {};
  const profile = state.businessProfile || {
    logo: user.avatar || '',
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

  const displayLogo = profile.logo || user.avatar || '';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* View Full Size Logo Modal on Dashboard */}
      {viewLogoModal && displayLogo && (
        <Modal title={`Company Logo — ${profile.companyName || 'Business'}`} onClose={() => setViewLogoModal(false)} maxWidth={580}>
          <div className="flex flex-col items-center">
            <div style={{
              width: '100%',
              maxHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              overflow: 'hidden'
            }}>
              <img 
                src={displayLogo} 
                alt="Company Logo Full Size" 
                style={{ maxWidth: '100%', maxHeight: 350, objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
              />
            </div>
            <div className="flex items-center justify-between w-full mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  setViewLogoModal(false);
                  navigate('/app/business/profile');
                }}
                className="flex items-center gap-1.5"
              >
                <Edit size={14} /> Edit in Profile
              </Button>
              <Button variant="primary" size="sm" onClick={() => setViewLogoModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Company Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div 
            style={{
              width: 64,
              height: 64,
              borderRadius: '14px',
              backgroundColor: displayLogo ? '#FFFFFF' : 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 22,
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)',
              cursor: displayLogo ? 'pointer' : 'default'
            }}
            onClick={() => displayLogo && setViewLogoModal(true)}
            title={displayLogo ? 'Click to view full size logo' : ''}
          >
            {displayLogo ? (
              <img src={displayLogo} alt={profile.companyName} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }} />
            ) : (
              <Building2 size={32} />
            )}
          </div>
          <div>
            <Badge variant="primary" className="mb-2">{(profile.entityType || 'pvt_ltd').replace('_', ' ').toUpperCase()} • {profile.state || 'India'}</Badge>
            <h1 className="h2" style={{ margin: 0 }}>{profile.companyName}</h1>
            <p className="text-caption text-secondary mt-1">CIN: {profile.cin} • GSTIN: {profile.gstin}</p>
          </div>
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

// SCREEN 45 — BUSINESS PROFILE COMPONENT / EDITOR
export const BusinessProfileEditor = ({ navigate, isFullPage = false }) => {
  const [state, setState] = useState(store.getState());
  const fileInputRef = useRef(null);
  const [viewLogoModal, setViewLogoModal] = useState(false);

  useEffect(() => store.subscribe(setState), []);

  const user = state.currentUser || {};
  const currentLogo = (state.businessProfile && state.businessProfile.logo) || user.avatar || '';

  const initial = state.businessProfile || {
    logo: currentLogo,
    companyName: user.name || '',
    entityType: 'pvt_ltd',
    cin: '',
    gstin: '',
    pan: '',
    registeredAddress: '',
    city: '',
    state: '',
    officialEmail: user.email || '',
    phone: user.phone || '',
    signatoryName: '',
    signatoryDesignation: '',
    employeeCount: '',
    complianceScore: 0
  };

  const [formData, setFormData] = useState({
    ...initial,
    logo: (state.businessProfile && state.businessProfile.logo) || user.avatar || initial.logo || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      store.addToast('Logo file size must be under 10MB', 'danger');
      if (e.target) e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      handleChange('logo', base64);
      store.addToast('Company logo uploaded. Click "Update Business Profile" to save.', 'info');
      if (e.target) e.target.value = '';
    };
    reader.onerror = () => {
      store.addToast('Error reading image file', 'danger');
      if (e.target) e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    handleChange('logo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    store.addToast('Logo removed. Save to apply changes.', 'info');
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    store.updateBusinessProfile(formData);
    if (navigate && isFullPage) {
      navigate('/app/business');
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      {/* Full-Size Logo Viewer Modal */}
      {viewLogoModal && formData.logo && (
        <Modal 
          title={`Company Logo Preview — ${formData.companyName || 'Business'}`} 
          onClose={() => setViewLogoModal(false)} 
          maxWidth={620}
        >
          <div className="flex flex-col items-center">
            <div style={{
              width: '100%',
              minHeight: 280,
              maxHeight: 460,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              overflow: 'hidden'
            }}>
              <img 
                src={formData.logo} 
                alt="Company Logo Full Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 400, 
                  objectFit: 'contain', 
                  borderRadius: '8px', 
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)' 
                }} 
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-6 pt-4 border-t gap-3" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setViewLogoModal(false);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <Upload size={14} /> Replace Logo
                </Button>

                <a
                  href={formData.logo}
                  download={`${(formData.companyName || 'company').toLowerCase().replace(/\s+/g, '_')}_logo`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm flex items-center gap-1.5 text-secondary"
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleRemoveLogo();
                    setViewLogoModal(false);
                  }}
                  style={{ color: 'var(--color-danger)' }}
                  className="flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Remove
                </Button>
              </div>

              <Button type="button" variant="primary" size="sm" onClick={() => setViewLogoModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Card padding="36px" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        {/* Header with Interactive Company Logo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b">
          <div className="flex items-center gap-4">
            {/* Interactive Logo Avatar */}
            <div 
              className="logo-uploader-box"
              style={{
                position: 'relative',
                width: 68,
                height: 68,
                borderRadius: '16px',
                backgroundColor: formData.logo ? '#FFFFFF' : 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 24,
                border: '2px solid var(--color-border)',
                overflow: 'hidden',
                flexShrink: 0,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                if (formData.logo) {
                  setViewLogoModal(true);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              title={formData.logo ? 'Click to view full size logo' : 'Click to upload company logo'}
            >
              {formData.logo ? (
                <img 
                  src={formData.logo} 
                  alt="Company Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} 
                />
              ) : (
                <Building2 size={32} />
              )}
              
              <div
                className="logo-hover-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  fontSize: 10,
                  fontWeight: 600,
                  gap: 2
                }}
              >
                {formData.logo ? (
                  <>
                    <Eye size={18} />
                    <span>View</span>
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    <span>Upload</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <h1 className="h2" style={{ margin: 0, fontSize: 24 }}>{formData.companyName || 'Business Profile'}</h1>
              <p className="text-caption text-secondary mt-1">
                {(formData.entityType || 'pvt_ltd').replace(/_/g, ' ').toUpperCase()} • {formData.city || formData.state || 'Location Not Set'}
              </p>
            </div>
          </div>
          <Badge variant="neutral">Draft Profile</Badge>
        </div>

        {/* Hidden File Input (Accepts all image types) */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*, .webp, .png, .jpg, .jpeg, .svg, .gif, .avif, .bmp, .ico, .jfif, .pjpeg, .pjp" 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />

        {/* Form */}
        <form onSubmit={handleSave}>
          {/* SECTION 0: Brand & Profile Logo Management */}
          <div className="mb-8 p-5 rounded-lg border" style={{ backgroundColor: 'var(--color-bg-surface-muted)', borderColor: 'var(--color-border)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '12px',
                    backgroundColor: formData.logo ? '#FFFFFF' : 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    cursor: formData.logo ? 'pointer' : 'default'
                  }}
                  onClick={() => formData.logo && setViewLogoModal(true)}
                  title={formData.logo ? 'Click to view full size logo' : ''}
                >
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                  ) : (
                    <Building2 size={26} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>Company Profile Logo</div>
                  <div className="text-caption text-secondary mt-0.5">Add your official corporate logo. It appears on your dashboard, vault, and sidebar.</div>
                  <div className="text-caption text-muted mt-0.5">All formats supported (WEBP, PNG, JPG, SVG, GIF, AVIF, BMP). Max 10MB.</div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {formData.logo && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setViewLogoModal(true)}
                    className="flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    View Logo
                  </Button>
                )}

                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5"
                >
                  <Upload size={14} />
                  {formData.logo ? 'Change Logo' : 'Upload Logo'}
                </Button>

                {formData.logo && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRemoveLogo}
                    style={{ color: 'var(--color-danger)' }}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 1: Company Identity & Tax */}
          <div className="mb-8">
            <h3 className="h4 mb-4 text-primary" style={{ color: 'var(--color-primary)' }}>1. Corporate & Tax Identification</h3>
            <div className="grid grid-2 gap-4">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Company Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="e.g. LegalEdge Enterprises Pvt Ltd"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Entity Type</label>
                <select
                  className="form-select"
                  value={formData.entityType}
                  onChange={(e) => handleChange('entityType', e.target.value)}
                >
                  <option value="pvt_ltd">Private Limited (Pvt Ltd)</option>
                  <option value="llp">Limited Liability Partnership (LLP)</option>
                  <option value="opc">One Person Company (OPC)</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership Firm</option>
                  <option value="public_ltd">Public Limited</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Identification Number (CIN / LLPIN)</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={formData.cin}
                  onChange={(e) => handleChange('cin', e.target.value)}
                  placeholder="e.g. U72900MH2022PTC381920"
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN Number</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={formData.gstin}
                  onChange={(e) => handleChange('gstin', e.target.value)}
                  placeholder="e.g. 27AABCL1234F1Z5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company PAN</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={formData.pan || ''}
                  onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                  placeholder="e.g. AABCL1234F"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Registered Location & Contacts */}
          <div className="mb-8 pt-6 border-t">
            <h3 className="h4 mb-4 text-primary" style={{ color: 'var(--color-primary)' }}>2. Registered Office & Official Contacts</h3>
            <div className="grid grid-2 gap-4">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Registered Office Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.registeredAddress || ''}
                  onChange={(e) => handleChange('registeredAddress', e.target.value)}
                  placeholder="e.g. Suite 502, Prestige Tech Tower, BKC"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Mumbai"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="e.g. Maharashtra"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Legal Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.officialEmail || ''}
                  onChange={(e) => handleChange('officialEmail', e.target.value)}
                  placeholder="e.g. legal@legaledge.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Signatory & Workforce */}
          <div className="mb-8 pt-6 border-t">
            <h3 className="h4 mb-4 text-primary" style={{ color: 'var(--color-primary)' }}>3. Authorized Signatory & Workforce</h3>
            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label">Authorized Signatory Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.signatoryName || ''}
                  onChange={(e) => handleChange('signatoryName', e.target.value)}
                  placeholder="e.g. Sarthak Kadam"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Signatory Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.signatoryDesignation || ''}
                  onChange={(e) => handleChange('signatoryDesignation', e.target.value)}
                  placeholder="e.g. Managing Director"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Employee Count</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.employeeCount || ''}
                  onChange={(e) => handleChange('employeeCount', e.target.value)}
                  placeholder="e.g. 15"
                />
                <span className="text-caption text-secondary mt-1">Used for statutory POSH (10+) and PF (20+) compliance checks.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit">Update Business Profile</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// SCREEN 45 — BUSINESS PROFILE PAGE WRAPPER
export const BusinessProfilePage = ({ navigate }) => {
  return <BusinessProfileEditor navigate={navigate} isFullPage={true} />;
};

