import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Star, MapPin, CheckCircle, Clock, FileText, ArrowRight,
  Shield, Check, AlertCircle, ChevronRight, MessageSquare
} from 'lucide-react';
import { Card, Button, Badge, SearchInput, StatusChip } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 27 — SERVICE REQUEST WIZARD (SELECTED ADVOCATE CARD REDESIGN)
export const MarketplaceRequestWizardPage = ({ navigate, source, sourceRefId, lawyerId, serviceId }) => {
  const { lawyers, services } = store.getState();
  
  const initialLawyer = lawyers.find(l => l.id === lawyerId) || lawyers[0];
  const initialService = services.find(s => s.id === serviceId) || services[0];

  const [selectedLawyer, setSelectedLawyer] = useState(initialLawyer);
  const [selectedService, setSelectedService] = useState(initialService);
  const [matterDesc, setMatterDesc] = useState(
    source === 'ai_escalation'
      ? 'High risk indemnification clause flagged during Lawable AI document review. Requesting advocate redline and liability cap limitation per Sec 73 Indian Contract Act.'
      : 'Need legal assistance for contract review and dispute prevention under Indian law.'
  );
  const [contactMethod, setContactMethod] = useState('In-App Messages');
  const [timeWindow, setTimeWindow] = useState('Afternoon (2 PM - 5 PM)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (matterDesc.length < 30) {
      store.addToast('Please provide a matter description of at least 30 characters.', 'warning');
      return;
    }

    const reqId = store.createServiceRequest({
      serviceId: selectedService?.id,
      serviceTitle: selectedService?.title || 'Custom Consultation',
      lawyerId: selectedLawyer.id,
      lawyerName: selectedLawyer.name,
      source: source || 'direct',
      sourceRefId: sourceRefId || null,
      matterDescription: matterDesc,
      preferredContact: contactMethod,
      preferredTime: timeWindow,
      fee: selectedService?.price || selectedLawyer.consultationFee,
      note: source === 'ai_escalation' ? 'Created from AI Escalation Hook.' : 'Request created by client.'
    });

    navigate(`/app/requests/${reqId}`);
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <Badge variant="primary" className="mb-2">Request Legal Service</Badge>
      <h1 className="h2 mb-6">Submit Service Request to Verified Advocate</h1>

      <Card padding="36px" style={{ backgroundColor: '#FFF' }}>
        <form onSubmit={handleSubmit}>
          {/* Selected Lawyer Header Redesign (64px Avatar, 24px Padding, Spacious Gaps) */}
          <div
            className="p-6 border rounded-lg mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{
              backgroundColor: 'var(--color-bg-surface-muted)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div className="flex items-center gap-5">
              <img
                src={selectedLawyer.avatar}
                alt={selectedLawyer.name}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--color-primary-border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text-primary)' }}>{selectedLawyer.name}</span>
                  <Badge variant="success" size="sm" style={{ padding: '4px 10px' }}>
                    <Check size={12} /> Bar Verified
                  </Badge>
                </div>
                <p className="text-caption text-secondary" style={{ margin: 0, fontSize: 13 }}>
                  {selectedLawyer.firm} • <MapPin size={13} style={{ display: 'inline', margin: '0 2px' }} /> {selectedLawyer.city}
                </p>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Experience: {selectedLawyer.experience} Yrs • ★ {selectedLawyer.rating} ({selectedLawyer.reviewCount} reviews)
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md text-right bg-white" style={{ minWidth: 180, borderColor: 'var(--color-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consultation Fee</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)', marginTop: 2 }}>
                ₹ {selectedLawyer.consultationFee}
              </div>
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Matter Description (Min 30 Characters)</label>
            <textarea
              className="form-textarea"
              required
              minLength={30}
              rows={5}
              value={matterDesc}
              onChange={(e) => setMatterDesc(e.target.value)}
              placeholder="Describe your legal matter, contract clause, or advice required in detail..."
            />
            <div className="text-caption text-muted text-right mt-1">{matterDesc.length}/30 characters minimum</div>
          </div>

          <div className="grid grid-2 gap-6 mb-8">
            <div className="form-group">
              <label className="form-label">Preferred Contact Method</label>
              <select className="form-select" value={contactMethod} onChange={(e) => setContactMethod(e.target.value)}>
                <option>In-App Messages</option>
                <option>Email & Phone Call</option>
                <option>External Meeting Link</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Time Window</label>
              <select className="form-select" value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)}>
                <option>Morning (10 AM - 1 PM)</option>
                <option>Afternoon (2 PM - 5 PM)</option>
                <option>Evening (6 PM - 8 PM)</option>
              </select>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg">
            Submit Request to Advocate <ArrowRight size={16} />
          </Button>
        </form>
      </Card>
    </div>
  );
};

// SCREEN 28 — MY REQUESTS LIST PAGE
export const MyRequestsListPage = ({ navigate }) => {
  const requests = store.getState().requests;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Service Requests</Badge>
          <h1 className="h2" style={{ margin: 0 }}>My Submitted Advocate Requests</h1>
          <p className="text-caption text-secondary mt-1">Track request status, advocate reviews, and delivery audit timelines.</p>
        </div>
        <Button onClick={() => navigate('/app/marketplace/request/new')}>+ Request New Service</Button>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-16">
          <Clock size={48} style={{ margin: '0 auto 16px', color: 'var(--color-text-muted)' }} />
          <h3 className="h3 mb-2">No Active Requests Submitted</h3>
          <p className="text-caption text-secondary mb-6" style={{ maxWidth: 400, margin: '0 auto 24px' }}>
            You haven't submitted any advocate requests yet. Request contract review or legal consultation directly.
          </p>
          <Button onClick={() => navigate('/app/marketplace/request/new')}>Find Advocates & Submit Request</Button>
        </Card>
      ) : (
        <div className="grid grid-2 gap-6">
          {requests.map((r) => (
            <Card key={r.id} hover onClick={() => navigate(`/app/requests/${r.id}`)} padding="28px" style={{ backgroundColor: '#FFF' }}>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="neutral">#{r.id}</Badge>
                <StatusChip status={r.status} />
              </div>
              <h3 className="h3 mb-2" style={{ fontSize: 17 }}>{r.serviceTitle}</h3>
              <p className="text-caption text-secondary mb-4">Assigned Advocate: {r.lawyerName}</p>
              <div className="flex items-center justify-between pt-4 border-t text-caption" style={{ borderColor: 'var(--color-border)' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 15 }}>Fee: ₹ {r.fee}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>View Timeline & Detail →</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// SCREEN 29 — REQUEST TIMELINE DETAIL PAGE
export const MarketplaceRequestDetailPage = ({ navigate, requestId }) => {
  const requests = store.getState().requests;
  const req = requests.find((r) => r.id === requestId) || requests[0];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Button variant="ghost" size="sm" onClick={() => navigate('/app/requests')} className="mb-4">← Back to My Requests</Button>
      
      <Card className="mb-8" padding="32px" style={{ backgroundColor: '#FFF' }}>
        <div className="flex items-center justify-between border-b pb-5 mb-6">
          <div>
            <Badge variant="primary" className="mb-2">Request #{req.id}</Badge>
            <h1 className="h2" style={{ margin: 0 }}>{req.serviceTitle}</h1>
            <p className="text-caption text-secondary mt-1">Assigned Advocate: {req.lawyerName}</p>
          </div>
          <StatusChip status={req.status} />
        </div>

        <div className="p-5 border rounded-md mb-8 bg-muted">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Matter Scope & Context</div>
          <p className="text-body text-secondary" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>{req.matterDescription}</p>
          <div className="flex items-center justify-between pt-4 mt-4 border-t text-caption text-secondary">
            <span>Contact: {req.preferredContact}</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 15 }}>Fee: ₹ {req.quotedFee}</span>
          </div>
        </div>

        {/* Audit Trail Timeline */}
        <h3 className="h3 mb-6">Service Audit Trail & Activity Timeline</h3>
        <div className="flex flex-col gap-6 border-l-2 pl-6 ml-3" style={{ borderColor: 'var(--color-primary-border)' }}>
          {req.timeline.map((event, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -31, top: 4, width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
              <div style={{ fontWeight: 600, fontSize: 14 }}>{event.actor} — <span style={{ color: 'var(--color-primary)' }}>{event.action.replace('_', ' ').toUpperCase()}</span></div>
              <p className="text-caption text-secondary mt-1" style={{ margin: 0 }}>{event.note}</p>
              <div className="text-caption text-muted mt-1">{new Date(event.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
