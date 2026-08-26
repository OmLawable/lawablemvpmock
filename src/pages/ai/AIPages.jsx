import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Send, Upload, FileText, Download, Copy, RefreshCw, AlertTriangle, 
  Check, ThumbsUp, ThumbsDown, Shield, FileCode, Plus, Search, ChevronRight, CornerDownRight, AlertCircle, X, CheckCircle, ArrowRight
} from 'lucide-react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 18 & 19 — LAWABLE AI CHAT & RESEARCH ASSISTANT (PRD FR-2.1 & FR-2.5)
export const AIChatPage = ({ navigate, conversationId }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), []);

  const [activeConvId, setActiveConvId] = useState(conversationId || state.aiConversations[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const [feedbackModalMsgId, setFeedbackModalMsgId] = useState(null);
  const [feedbackReason, setFeedbackReason] = useState('');

  const activeConv = state.aiConversations.find((c) => c.id === activeConvId);

  const handleSend = (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;
    const convId = store.addAIMessage(activeConvId, textToSend);
    setActiveConvId(convId);
    setInputText('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, minHeight: 'calc(100vh - 140px)' }}>
      {/* Left Conversations Sidebar */}
      <Card padding="28px" className="flex flex-col justify-between" style={{ backgroundColor: '#FFF' }}>
        <div>
          <Button fullWidth size="sm" onClick={() => { setActiveConvId(null); setInputText(''); }} className="mb-6">
            <Plus size={16} /> New Lawable AI Chat
          </Button>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>
            Recent Conversations
          </div>

          <div className="flex flex-col gap-2" style={{ maxHeight: 440, overflowY: 'auto' }}>
            {state.aiConversations.map((c) => {
              const active = c.id === activeConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                    border: active ? '1px solid var(--color-primary-border)' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ fontWeight: active ? 600 : 500, fontSize: 13, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }} className="truncate">
                      {c.title}
                    </span>
                    {c.riskLevel === 'high' && <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-danger)' }} />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{new Date(c.updatedAt).toLocaleDateString()}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rate Limit Counter */}
        <div className="p-4 border rounded-md mt-6" style={{ backgroundColor: 'var(--color-bg-surface-muted)', borderColor: 'var(--color-border)', fontSize: 12 }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontWeight: 600 }}>Daily Message Limit</span>
            <Badge variant="neutral" size="sm">2 / 50 Used</Badge>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>Free tier includes 50 AI messages / day under Indian jurisprudence.</p>
        </div>
      </Card>

      {/* Main Chat Stream Area */}
      <Card padding="32px" className="flex flex-col justify-between" style={{ backgroundColor: '#FFF' }}>
        {/* Chat Stream Header */}
        <div className="flex items-center justify-between pb-4 border-b mb-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="icon-box" style={{ padding: 8 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{activeConv ? activeConv.title : 'Lawable AI Legal Assistant'}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>Jurisdiction: India (Bare Acts & Rules Indexed)</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="secondary" onClick={() => navigate('/app/ai/draft')}>
              <FileCode size={16} /> Guided Document Drafting
            </Button>
          </div>
        </div>

        {/* Messages Stream */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }} className="flex flex-col gap-6 mb-6">
          {activeConv && activeConv.messages && activeConv.messages.length > 0 ? (
            activeConv.messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '16px 22px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: m.sender === 'user' ? 'var(--color-primary)' : 'var(--color-bg-surface-muted)',
                    color: m.sender === 'user' ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--color-border)',
                    fontSize: 14,
                    lineHeight: 1.65
                  }}
                >
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0, color: m.sender === 'user' ? '#FFFFFF' : 'var(--color-text-primary)', fontWeight: m.sender === 'user' ? 500 : 400 }}>
                    {m.text}
                  </p>

                  {/* Source Citations */}
                  {m.citations && (
                    <div className="mt-4 pt-3 border-t flex flex-col gap-1.5" style={{ borderColor: 'rgba(0,0,0,0.1)', fontSize: 12 }}>
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>Source Citations:</span>
                      {m.citations.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                          <span style={{ fontWeight: 600 }}>{c.source}</span> — {c.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Escalation Hook Banner -> Navigates to /app/marketplace */}
                {m.sender === 'ai' && m.escalationRecommended && (
                  <div
                    className="mt-6 p-6 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    style={{
                      maxWidth: '85%',
                      backgroundColor: '#FEF2F2',
                      borderColor: '#FECACA',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1" style={{ color: '#DC2626', fontWeight: 700, fontSize: 15 }}>
                        <AlertTriangle size={18} /> Professional Review Recommended
                      </div>
                      <p style={{ fontSize: 13, color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                        High risk clause or unlimited liability detected. Have a Bar Council verified advocate conduct formal contract redline.
                      </p>
                    </div>
                    <Button
                      size="md"
                      variant="danger"
                      onClick={() => navigate('/app/marketplace')}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Get Reviewed by Advocate <ArrowRight size={14} />
                    </Button>
                  </div>
                )}

                {/* Feedback Buttons */}
                {m.sender === 'ai' && (
                  <div className="flex items-center gap-3 mt-3" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    <button className="btn btn-ghost btn-sm p-1.5" onClick={() => store.logAIFeedback(m.id, 'up')}>
                      <ThumbsUp size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm p-1.5" onClick={() => setFeedbackModalMsgId(m.id)}>
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            /* Interactive Welcome State when starting a fresh session */
            <div className="py-12 text-center">
              <Sparkles size={48} style={{ margin: '0 auto 16px', color: 'var(--color-primary)' }} />
              <h3 className="h3 mb-3">Welcome to Lawable AI Assistant</h3>
              <p className="text-secondary mb-8" style={{ maxWidth: 520, margin: '0 auto 32px', fontSize: 14, lineHeight: 1.6 }}>
                Ask any question on Indian law, verify contract clauses under Section 73 Contract Act, or select a starter prompt below:
              </p>

              <div className="grid grid-3 gap-4 text-left" style={{ maxWidth: 740, margin: '0 auto' }}>
                <Card hover onClick={(e) => handleSend(null, 'Does Section 8 uncapped indemnity expose our company under Indian Contract Act?')} padding="20px" style={{ backgroundColor: 'var(--color-bg-surface-muted)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-primary)' }}>Clause Risk Analysis</div>
                  <p className="text-caption text-secondary mt-1" style={{ margin: 0 }}>"Check Section 8 uncapped indemnity risk under Indian Contract Act..."</p>
                </Card>

                <Card hover onClick={(e) => handleSend(null, 'What are the Data Fiduciary requirements under DPDP Act 2023 for SaaS?')} padding="20px" style={{ backgroundColor: 'var(--color-bg-surface-muted)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-primary)' }}>DPDP Act 2023 Audit</div>
                  <p className="text-caption text-secondary mt-1" style={{ margin: 0 }}>"What are the Data Fiduciary duties under DPDP Act 2023?"</p>
                </Card>

                <Card hover onClick={(e) => handleSend(null, 'Draft a mutual Non-Disclosure Agreement for co-founders in Mumbai.')} padding="20px" style={{ backgroundColor: 'var(--color-bg-surface-muted)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-primary)' }}>Drafting Prompt</div>
                  <p className="text-caption text-secondary mt-1" style={{ margin: 0 }}>"Draft a mutual NDA for co-founders under Mumbai jurisdiction..."</p>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleSend(e)} className="flex gap-3 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
          <input
            type="text"
            className="form-input"
            style={{ height: 48 }}
            placeholder="Ask a legal query, e.g., 'What is the liability cap under Section 73 Indian Contract Act?'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button type="submit" size="md">
            <Send size={16} /> Send
          </Button>
        </form>
      </Card>

      {/* Feedback Modal */}
      {feedbackModalMsgId && (
        <Modal title="Help Us Improve Lawable AI" onClose={() => setFeedbackModalMsgId(null)}>
          <div className="form-group">
            <label className="form-label">Why was this AI response unsatisfactory?</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Missing relevant Bare Act section or citation..."
              value={feedbackReason}
              onChange={(e) => setFeedbackReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setFeedbackModalMsgId(null)}>Cancel</Button>
            <Button onClick={() => { store.logAIFeedback(feedbackModalMsgId, 'down', feedbackReason); setFeedbackModalMsgId(null); setFeedbackReason(''); }}>Submit Feedback</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// SCREEN 22 — GUIDED DOCUMENT DRAFTING
export const AIDraftPage = ({ navigate }) => {
  const templates = store.getState().draftTemplates;
  const [selectedTmpl, setSelectedTmpl] = useState(templates[0]);
  const [parties, setParties] = useState('');
  const [governingLaw, setGoverningLaw] = useState('Mumbai, Maharashtra (India)');
  const [consideration, setConsideration] = useState('₹ 5,00,000');

  const [generatedDraft, setGeneratedDraft] = useState('');
  const [unfilledCount, setUnfilledCount] = useState(0);
  const [ackModalOpen, setAckModalOpen] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    const draftText = `MUTUAL NON-DISCLOSURE & CONFIDENTIALITY AGREEMENT

THIS AGREEMENT is entered into on this 12th day of August 2026 by and between:
1. ${parties.split('&')[0] || 'Party A'} ("Disclosing Party")
2. ${parties.split('&')[1] || 'Party B'} ("Receiving Party")

RECITALS:
WHEREAS the parties intend to engage in business discussions regarding [TO BE COMPLETED: Specific Scope of Project] and wish to protect proprietary information.

SECTION 1: CONFIDENTIAL INFORMATION
Confidential Information includes technical data, trade secrets, software code, and financial terms.

SECTION 2: OBLIGATIONS & RESTRICTIONS
The Receiving Party agrees to hold all Confidential Information in strict confidence and shall not disclose it without prior written consent.

SECTION 3: LIMITATION OF LIABILITY & GOVERNING LAW
This agreement is governed by the laws of ${governingLaw}. Monetary consideration is set at ${consideration}. Liabilities for indirect damages are excluded per Section 73 Indian Contract Act 1872.

SECTION 4: TERM & TERMINATION
This agreement shall remain effective for 2 years from execution date.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement.
Signed for Party A: [TO BE COMPLETED: Authorized Signatory Name & Designation]
Signed for Party B: [TO BE COMPLETED: Authorized Signatory Name & Designation]`;

    setGeneratedDraft(draftText);
    const matches = draftText.match(/\[TO BE COMPLETED:[^\]]+\]/g);
    setUnfilledCount(matches ? matches.length : 0);
  };

  const handleExport = () => {
    if (unfilledCount > 0) {
      setAckModalOpen(true);
    } else {
      store.addToast('Document exported to DOCX successfully', 'success');
      navigate('/app/documents');
    }
  };

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Guided Contract Generator</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Draft Legal Document with Lawable AI</h1>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/documents')}>My Saved Documents</Button>
      </div>

      <div className="grid grid-3 gap-8">
        {/* Template Selector */}
        <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h4 mb-4">1. Select Document Template</h3>
          <div className="flex flex-col gap-2.5" style={{ maxHeight: 480, overflowY: 'auto' }}>
            {templates.map((t) => {
              const active = t.id === selectedTmpl.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTmpl(t)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: active ? 'var(--color-primary-light)' : '#FFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3 }}>{t.category}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Guided Parameter Form */}
        <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
          <h3 className="h4 mb-4">2. Guided Parameters</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Contracting Parties</label>
              <input type="text" className="form-input" value={parties} onChange={(e) => setParties(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Governing Law Jurisdiction</label>
              <input type="text" className="form-input" value={governingLaw} onChange={(e) => setGoverningLaw(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Consideration Amount</label>
              <input type="text" className="form-input" value={consideration} onChange={(e) => setConsideration(e.target.value)} required />
            </div>
            <Button type="submit" fullWidth className="mt-6">
              <Sparkles size={16} /> Generate Draft via AI
            </Button>
          </form>
        </Card>

        {/* Editor Preview */}
        <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h3 className="h4" style={{ margin: 0 }}>3. Rich Editor Preview</h3>
            {unfilledCount > 0 && <Badge variant="warning">{unfilledCount} Unfilled Placeholders</Badge>}
          </div>

          <textarea
            className="form-textarea mb-6"
            style={{ minHeight: 300, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6 }}
            value={generatedDraft || 'Click "Generate Draft via AI" to render editable text with clause structure...'}
            onChange={(e) => setGeneratedDraft(e.target.value)}
          />

          <div className="flex gap-3">
            <Button fullWidth size="sm" onClick={handleExport} disabled={!generatedDraft}>
              <Download size={14} /> Export DOCX
            </Button>
            <Button variant="secondary" size="sm" onClick={() => store.addToast('Draft saved to My Documents', 'success')}>
              Save Draft
            </Button>
          </div>
        </Card>
      </div>

      {/* Unfilled Placeholder Guardrail Modal */}
      {ackModalOpen && (
        <Modal title="Unfilled Placeholders Acknowledgment" onClose={() => setAckModalOpen(false)}>
          <div className="p-5 border rounded-md mb-6 bg-muted" style={{ borderColor: 'var(--color-warning-border)' }}>
            <div className="flex items-center gap-2 mb-2 text-warning">
              <AlertTriangle size={20} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>{unfilledCount} Unfilled Placeholders Detected</span>
            </div>
            <p className="text-body text-secondary" style={{ margin: 0, fontSize: 13 }}>
              This document contains unfilled bracketed items (e.g. <code>[TO BE COMPLETED: ...]</code>). Please confirm you understand that export contains incomplete fields.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setAckModalOpen(false)}>Edit Document First</Button>
            <Button onClick={() => { setAckModalOpen(false); store.addToast('Document exported with acknowledgment', 'warning'); navigate('/app/documents'); }}>
              I Understand, Export Anyway
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// SCREEN 24 — DOCUMENTS VAULT
export const DocumentsVaultPage = ({ navigate }) => {
  const docs = store.getState().documents;
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h2" style={{ margin: 0 }}>My Documents Vault</h1>
          <p className="text-caption text-secondary mt-1">Saved AI drafts and uploaded contracts.</p>
        </div>
        <Button onClick={() => navigate('/app/ai/draft')}>+ New Draft</Button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Source</th>
              <th>Risk Level</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.title}</td>
                <td><Badge variant="neutral">{d.source}</Badge></td>
                <td>
                  <Badge variant={d.riskLevel === 'high' ? 'danger' : 'success'}>
                    {d.riskLevel.toUpperCase()}
                  </Badge>
                </td>
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
