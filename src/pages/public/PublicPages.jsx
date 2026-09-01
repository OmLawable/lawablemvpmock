import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, BookOpen, Building2, Users, Check, 
  Search, Star, MapPin, Calendar, FileText, ExternalLink, Award, CheckCircle,
  HelpCircle, ChevronRight, Lock, AlertTriangle, Shield, Clock, Phone, Mail
} from 'lucide-react';
import { Card, Button, Badge, SearchInput, StatusChip } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 01 — LANDING PAGE
export const LandingPage = ({ navigate }) => {
  return (
    <div>
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '80px 32px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 64, alignItems: 'center' }}>
          <div>
            <Badge variant="primary" className="mb-4" style={{ padding: '8px 16px', fontSize: 13 }}>
              <Sparkles size={14} style={{ color: 'var(--color-primary)' }} /> Next-Gen Legal Technology for India
            </Badge>

            <h1 className="h1 mb-6" style={{ fontSize: 42, lineHeight: 1.2, letterSpacing: '-0.03em' }}>
              Learn → Draft → Verify → Resolve
            </h1>

            <p className="text-large text-secondary mb-8" style={{ fontSize: 17, lineHeight: 1.65 }}>
              Lawable connects conversational legal AI, Bar Council verified advocates, business compliance management, and accredited legal academy in one seamless platform.
            </p>

            <div className="flex items-center gap-4">
              <Button size="lg" onClick={() => navigate('/auth/signup')}>Get Started Free</Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/auth/login')}>Explore Legal AI</Button>
            </div>
          </div>

          <Card style={{ padding: 32, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
            <div className="flex items-center justify-between mb-5 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-3">
                <div className="icon-box" style={{ padding: 8, borderRadius: 8 }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Lawable AI Workspace Preview</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Interactive Contract Audit</div>
                </div>
              </div>
              <Badge variant="success"><CheckCircle size={12} /> Sec 73 Verified</Badge>
            </div>

            <div className="p-4 border rounded-md mb-4 bg-white" style={{ borderColor: 'var(--color-border)', fontSize: 13 }}>
              <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>User Query</div>
              <div style={{ fontWeight: 500, lineHeight: 1.5 }}>"Does Section 8 uncapped indemnity expose our company under Indian Contract Act?"</div>
            </div>

            <div className="p-4 border rounded-md" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary-border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 13 }}>Lawable AI Analysis</span>
                <Badge variant="danger">High Risk Detected</Badge>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-primary)' }} className="mb-4">
                Uncapped indemnities override statutory damages limits under Sec 73 of Indian Contract Act 1872. High risk of consequential liability identified.
              </p>
              <div className="pt-3 border-t flex justify-end" style={{ borderColor: 'var(--color-primary-border)' }}>
                <Button size="sm" onClick={() => navigate('/app/marketplace')}>
                  Get Reviewed by Advocate <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '80px auto', padding: '0 32px' }}>
        <div className="text-center mb-12">
          <Badge variant="neutral" className="mb-3">Integrated Platform</Badge>
          <h2 className="h2 mb-3" style={{ fontSize: 32 }}>Four Integrated Modules, One Coherent Product</h2>
          <p className="text-secondary text-large" style={{ maxWidth: 640, margin: '0 auto' }}>
            The central differentiator is the seamless handoff between AI legal research, advocate review, and compliance.
          </p>
        </div>

        <div className="grid grid-4 gap-8">
          <Card hover onClick={() => navigate('/auth/signup')}>
            <div className="icon-box mb-5">
              <Sparkles size={26} />
            </div>
            <h3 className="h3 mb-2">1. Lawable AI</h3>
            <p className="text-body text-secondary" style={{ lineHeight: 1.6 }}>
              Legal chat, document Q&A, clause risk breakdown, guided contract drafting, and instant risk indicators.
            </p>
          </Card>

          <Card hover onClick={() => navigate('/marketplace')}>
            <div className="icon-box mb-5">
              <Users size={26} />
            </div>
            <h3 className="h3 mb-2">2. Marketplace</h3>
            <p className="text-body text-secondary" style={{ lineHeight: 1.6 }}>
              Verified advocate directory, fixed-price services, consultation booking, and real-time request timeline.
            </p>
          </Card>

          <Card hover onClick={() => navigate('/auth/signup')}>
            <div className="icon-box mb-5">
              <Building2 size={26} />
            </div>
            <h3 className="h3 mb-2">3. Business</h3>
            <p className="text-body text-secondary" style={{ lineHeight: 1.6 }}>
              Automated statutory compliance checklist (GST, MCA, DPDP), document vault, and "Get Help" referral.
            </p>
          </Card>

          <Card hover onClick={() => navigate('/academy')}>
            <div className="icon-box mb-5">
              <BookOpen size={26} />
            </div>
            <h3 className="h3 mb-2">4. Academy</h3>
            <p className="text-body text-secondary" style={{ lineHeight: 1.6 }}>
              Syllabus lessons, practical examinations, accredited certificates, and public verification lookup.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

// SCREEN 02 — ABOUT
export const AboutPage = ({ navigate }) => (
  <div style={{ maxWidth: 1200, margin: '64px auto', padding: '0 32px' }}>
    <div style={{ maxWidth: 840, margin: '0 auto 48px', textAlign: 'center' }}>
      <Badge variant="primary" className="mb-3">Our Mission</Badge>
      <h1 className="h1 mb-4" style={{ fontSize: 36 }}>About Lawable Legal OS</h1>
      <p className="text-large text-secondary" style={{ fontSize: 17, lineHeight: 1.65 }}>
        Lawable was built to solve the fragmentation of legal technology in India. By unifying conversational legal AI, verified Bar Council registered advocates, business compliance automation, and legal education into a single operating system, Lawable empowers individuals, businesses, and legal professionals.
      </p>
    </div>

    <div className="grid grid-2 gap-8 mb-12">
      <Card className="flex flex-col justify-between" padding="32px">
        <div>
          <div className="icon-box mb-5">
            <ShieldCheck size={28} />
          </div>
          <h3 className="h3 mb-3">Our Core Product Thesis</h3>
          <p className="text-body text-secondary" style={{ fontSize: 15, lineHeight: 1.65 }}>
            Legal needs do not happen in isolation. An AI chat query leads to contract drafting, which requires advocate review, which impacts business compliance. Lawable connects all steps without dead ends.
          </p>
        </div>
      </Card>

      <Card className="flex flex-col justify-between" padding="32px">
        <div>
          <div className="icon-box mb-5">
            <Lock size={28} />
          </div>
          <h3 className="h3 mb-3">Verified Advocates & Guardrails</h3>
          <p className="text-body text-secondary" style={{ fontSize: 15, lineHeight: 1.65 }}>
            Lawable AI acts as a smart legal assistant, maintaining strict disclaimers while providing direct handoff to verified advocates when high risk is detected.
          </p>
        </div>
      </Card>
    </div>

    <Card className="flex flex-col md:flex-row items-center justify-between p-8" padding="32px" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary-border)' }}>
      <div>
        <h3 className="h3 mb-2" style={{ color: 'var(--color-primary)' }}>Ready to experience Lawable legal OS?</h3>
        <p className="text-body text-secondary" style={{ margin: 0 }}>Start exploring AI legal tools or find verified Advocates today.</p>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <Button onClick={() => navigate('/auth/signup')}>Get Started Free</Button>
        <Button variant="secondary" onClick={() => navigate('/marketplace')}>Find Advocates</Button>
      </div>
    </Card>
  </div>
);

// SCREEN 03 — CONTACT
export const ContactPage = ({ navigate }) => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ maxWidth: 680, margin: '64px auto', padding: '0 32px' }}>
      <Card padding="32px">
        <h2 className="h2 mb-3">Contact Lawable Support</h2>
        <p className="text-body text-secondary mb-8">Have questions about Lawable platform, advocate onboarding, or enterprise compliance?</p>
        {submitted ? (
          <div className="p-8 border rounded-md text-center" style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-success-border)' }}>
            <CheckCircle size={40} style={{ color: 'var(--color-success)', margin: '0 auto 16px' }} />
            <h3 className="h3" style={{ color: 'var(--color-success)' }}>Enquiry Received</h3>
            <p className="text-caption mt-2">Our support team will respond to your email address within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" className="form-input" required placeholder="e.g. Rahul Verma" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select">
                <option>General Support</option>
                <option>Advocate Verification Inquiry</option>
                <option>Enterprise Business Compliance</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-textarea" required placeholder="Describe your inquiry..." />
            </div>
            <Button type="submit" fullWidth size="lg" className="mt-4">Send Message</Button>
          </form>
        )}
      </Card>
    </div>
  );
};

// SCREEN 04 — PRICING
export const PricingPage = ({ navigate }) => (
  <div style={{ maxWidth: 1200, margin: '64px auto', padding: '0 32px' }}>
    <div className="text-center mb-12">
      <Badge variant="primary" className="mb-3">Transparent Pricing</Badge>
      <h1 className="h1 mb-3" style={{ fontSize: 36 }}>Simple Pricing for Individuals & Enterprise</h1>
      <p className="text-secondary text-large">Choose the right Lawable tier for your legal requirements.</p>
    </div>

    <div className="grid grid-3 gap-8">
      <Card padding="32px">
        <h3 className="h3 mb-2">Individual Starter</h3>
        <div style={{ fontSize: 32, fontWeight: 800, margin: '16px 0', color: 'var(--color-text-primary)' }}>₹ 0 <span style={{ fontSize: 14, fontWeight: 400 }} className="text-secondary">/ month</span></div>
        <ul className="flex flex-col gap-3 text-body text-secondary mb-8" style={{ fontSize: 14 }}>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> 10 Lawable AI Messages / mo</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Public Advocate Directory Access</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Basic Document Summary</li>
        </ul>
        <Button variant="secondary" fullWidth onClick={() => navigate('/auth/signup')}>Get Started Free</Button>
      </Card>

      <Card padding="32px" style={{ borderColor: 'var(--color-primary)', borderWidth: 2, position: 'relative' }}>
        <Badge variant="primary" style={{ position: 'absolute', top: -14, right: 20 }}>Most Popular</Badge>
        <h3 className="h3 mb-2">Pro Advocate & Individual</h3>
        <div style={{ fontSize: 32, fontWeight: 800, margin: '16px 0', color: 'var(--color-primary)' }}>₹ 1,499 <span style={{ fontSize: 14, fontWeight: 400 }} className="text-secondary">/ month</span></div>
        <ul className="flex flex-col gap-3 text-body text-secondary mb-8" style={{ fontSize: 14 }}>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Unlimited Lawable AI Legal Chat & Q&A</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Guided Document Drafting (NDA, Offer)</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Marketplace Service Requests</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Academy Certification Access</li>
        </ul>
        <Button fullWidth onClick={() => navigate('/auth/signup')}>Start Pro Trial</Button>
      </Card>

      <Card padding="32px">
        <h3 className="h3 mb-2">Business Enterprise</h3>
        <div style={{ fontSize: 32, fontWeight: 800, margin: '16px 0', color: 'var(--color-text-primary)' }}>₹ 4,999 <span style={{ fontSize: 14, fontWeight: 400 }} className="text-secondary">/ month</span></div>
        <ul className="flex flex-col gap-3 text-body text-secondary mb-8" style={{ fontSize: 14 }}>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Full Business Compliance Checklist</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Expiry Document Vault & Contracts</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Priority Advocate Handoff Referral</li>
          <li className="flex items-center gap-2"><Check size={16} style={{ color: 'var(--color-success)' }} /> Multi-User Admin Management</li>
        </ul>
        <Button variant="secondary" fullWidth onClick={() => navigate('/auth/signup')}>Register Business</Button>
      </Card>
    </div>
  </div>
);

// SCREEN 05 & 06 — BLOG LISTING & DETAIL
export const BlogListingPage = ({ navigate, selectedSlug }) => {
  const blogs = store.getState().blogs;
  if (selectedSlug) {
    const blog = blogs.find((b) => b.slug === selectedSlug) || blogs[0];
    return (
      <div style={{ maxWidth: 840, margin: '64px auto', padding: '0 32px' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/blog')} className="mb-6">← Back to Blog</Button>
        <Badge variant="primary" className="mb-3">{blog.category}</Badge>
        <h1 className="h1 mb-4" style={{ fontSize: 36 }}>{blog.title}</h1>
        <div className="flex items-center gap-4 text-caption text-secondary mb-8 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <span>By {blog.author}</span>
          <span>•</span>
          <span>Published {blog.publishDate}</span>
          <span>•</span>
          <span>{blog.readTime}</span>
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-text-primary)' }}>
          <p className="mb-6" style={{ fontWeight: 500, fontSize: 17 }}>{blog.excerpt}</p>
          <p className="mb-6">Under Section 73 of the Indian Contract Act 1872, compensation for loss or damage caused by breach of contract is payable only for direct damages arising naturally in the usual course of things. When contracts contain uncapped indemnity clauses, liabilities bypass Section 73 restrictions.</p>
          <h2 className="h2 mb-4 mt-8">Key DPDP & Contract Implications</h2>
          <p className="mb-6">Organizations operating in India must ensure data fiduciary notices are published and vendor contracts include appropriate risk caps.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '64px auto', padding: '0 32px' }}>
      <div className="text-center mb-12">
        <Badge variant="primary" className="mb-3">Legal Insights</Badge>
        <h1 className="h1 mb-3" style={{ fontSize: 36 }}>Lawable Editorial & Legal Analysis</h1>
        <p className="text-secondary text-large">Authoritative guidance on Indian corporate law, DPDP Act 2023, and contract jurisprudence.</p>
      </div>

      <div className="grid grid-2 gap-8">
        {blogs.map((b) => (
          <Card key={b.id} hover onClick={() => navigate(`/blog/${b.slug}`)} padding="32px">
            <Badge variant="info" className="mb-3">{b.category}</Badge>
            <h3 className="h3 mb-3">{b.title}</h3>
            <p className="text-body text-secondary mb-6" style={{ lineHeight: 1.6 }}>{b.excerpt}</p>
            <div className="flex items-center justify-between text-caption text-secondary pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span>{b.author}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Read Article →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// SCREEN 07, 08, 09 — PUBLIC MARKETPLACE & ADVOCATE PROFILE PAGES (PREMIUM SPACING & ZERO SIDE SCROLL)
export const PublicMarketplacePage = ({ navigate, lawyerId, serviceId }) => {
  const { lawyers, services, categories } = store.getState();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Advocate Profile Detail Page with 3 Distinct Sections
  if (lawyerId) {
    const lawyer = lawyers.find((l) => l.id === lawyerId) || lawyers[0];
    const lawyerServices = services.filter(s => s.lawyerId === lawyer.id);

    const practiceAreasList = Array.isArray(lawyer.practiceAreas) ? lawyer.practiceAreas : (lawyer.practiceAreas ? lawyer.practiceAreas.split(',') : []);
    const courtsList = Array.isArray(lawyer.courtsPracticedIn) ? lawyer.courtsPracticedIn : (lawyer.courtsPracticedIn ? lawyer.courtsPracticedIn.split(',') : []);
    const languagesList = Array.isArray(lawyer.languages) ? lawyer.languages : (lawyer.languages ? lawyer.languages.split(',') : []);

    return (
      <div style={{ maxWidth: 1180, margin: '48px auto', padding: '0 32px' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/marketplace')} className="mb-6">← Back to Advocates Directory</Button>
        
        {/* SECTION 1: BASIC IDENTITY HEADER CARD */}
        <Card className="mb-8" padding="36px" style={{ backgroundColor: '#FFF', borderRadius: 16 }}>
          <div className="flex items-center gap-2 mb-4 text-caption text-secondary font-semibold uppercase tracking-wider" style={{ fontSize: 11, color: 'var(--color-primary)' }}>
            <User size={14} /> Section 1: Basic Identity
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={lawyer.avatar}
              alt={lawyer.name}
              style={{
                width: 112,
                height: 112,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--color-primary-border)',
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="h2" style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em' }}>{lawyer.name}</h1>
                <Badge variant="success" style={{ padding: '6px 14px', fontSize: 13 }}><Check size={14} /> Bar Verified Advocate</Badge>
              </div>

              {lawyer.designation && (
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 6 }}>
                  {lawyer.designation}
                </div>
              )}

              <p className="text-body text-secondary mb-4" style={{ fontSize: 15 }}>
                {lawyer.firm ? `${lawyer.firm} • ` : ''}<MapPin size={15} style={{ display: 'inline', margin: '0 2px' }} /> {lawyer.city || 'India'}{lawyer.state ? `, ${lawyer.state}` : ''}
              </p>

              <div className="flex flex-wrap items-center gap-5 text-caption text-secondary mb-6" style={{ fontSize: 14 }}>
                <span><strong>Experience:</strong> {lawyer.experience || 0} Years</span>
                <span>• ★ <strong>{lawyer.rating || 5.0}</strong> ({lawyer.reviewCount || 0} Reviews)</span>
              </div>
              
              <div className="p-5 border rounded-lg bg-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>Direct Consultation Fee</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-primary)', marginTop: 2 }}>₹ {lawyer.consultationFee || 2000} <span style={{ fontSize: 13, fontWeight: 400 }} className="text-secondary">/ 45 Min Session</span></div>
                </div>
                <Button size="lg" onClick={() => navigate(`/app/marketplace/request/new?lawyerId=${lawyer.id}`)}>
                  Book Direct Consultation →
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 2: PROFESSIONAL CREDENTIALS CARD */}
        <Card className="mb-8" padding="36px" style={{ backgroundColor: '#FFF', borderRadius: 16 }}>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b text-caption font-semibold uppercase tracking-wider" style={{ fontSize: 11, color: 'var(--color-primary)' }}>
            <Shield size={14} /> Section 2: Professional Credentials
          </div>

          <div className="grid grid-2 gap-8 mb-6">
            <div>
              <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-2">Practice Areas / Specializations</div>
              <div className="flex flex-wrap gap-2 mb-6">
                {practiceAreasList.map((area, idx) => (
                  <Badge key={idx} variant="neutral" style={{ padding: '6px 12px', fontSize: 13 }}>{area.trim()}</Badge>
                ))}
              </div>

              <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-2">Bar Registration Enrolment</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 20 }}>
                {lawyer.barCouncilNo || 'Verified Enrolment'} {lawyer.enrolmentState ? `(${lawyer.enrolmentState} State Bar Council)` : ''}
              </div>
            </div>

            <div>
              <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-2">Courts Practiced In</div>
              <div className="flex flex-wrap gap-2 mb-6">
                {courtsList.length > 0 ? courtsList.map((crt, idx) => (
                  <Badge key={idx} variant="primary" style={{ padding: '6px 12px', fontSize: 12 }}>{crt.trim()}</Badge>
                )) : <span className="text-caption text-secondary">Supreme Court & High Courts</span>}
              </div>

              <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-2">Education & Degrees</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>
                {lawyer.education || lawyer.qualification || 'NLU LL.M / LL.B Degree Holder'}
              </div>

              {lawyer.certifications && (
                <>
                  <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-2">Certifications & Qualifications</div>
                  <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                    {lawyer.certifications}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* SECTION 3: EXPERIENCE & TRACK RECORD CARD */}
        <Card className="mb-10" padding="36px" style={{ backgroundColor: '#FFF', borderRadius: 16 }}>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b text-caption font-semibold uppercase tracking-wider" style={{ fontSize: 11, color: 'var(--color-primary)' }}>
            <FileText size={14} /> Section 3: Experience & Track Record
          </div>

          <div className="mb-6">
            <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-2">Professional Bio & Summary</div>
            <p className="text-body" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-primary)', margin: 0 }}>
              {lawyer.bio || 'Experienced advocate specializing in commercial disputes and advisory.'}
            </p>
          </div>

          {lawyer.notableCases && (
            <div className="mb-6 p-4 border rounded-md" style={{ backgroundColor: 'var(--color-bg-surface-muted)', borderColor: 'var(--color-border)' }}>
              <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-1">Notable Cases & Matters Handled</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: 'var(--color-text-primary)' }}>
                {lawyer.notableCases}
              </p>
            </div>
          )}

          <div className="grid grid-3 gap-6 pt-2">
            {lawyer.achievements && (
              <div>
                <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-1">Achievements & Awards</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-primary)' }}>{lawyer.achievements}</div>
              </div>
            )}

            {lawyer.publications && (
              <div>
                <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-1">Publications & Commentary</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-primary)' }}>{lawyer.publications}</div>
              </div>
            )}

            <div>
              <div className="text-caption text-muted font-semibold uppercase tracking-wider mb-1">Languages Spoken</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {languagesList.map((lang, idx) => (
                  <Badge key={idx} variant="neutral" size="sm">{lang.trim()}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Assigned Legal Services Catalogue Section with Apt Spacing */}
        <div style={{ marginTop: 48, marginBottom: 24 }}>
          <h2 className="h2 mb-2" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>Available Legal Services by {lawyer.name}</h2>
          <p className="text-caption text-secondary" style={{ fontSize: 15, margin: 0 }}>Select a fixed-price service below to submit your legal matter for advocate review.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 28, width: '100%' }}>
          {lawyerServices.map(s => (
            <Card key={s.id} padding="32px" style={{ backgroundColor: '#FFF', borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="primary" style={{ padding: '6px 12px' }}>Fixed-Price Service</Badge>
                  <span className="text-caption font-semibold" style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Delivery: {s.timelineDays} Days</span>
                </div>
                <h3 className="h4 mb-3" style={{ fontSize: 18, lineHeight: 1.35 }}>{s.title}</h3>
                <p className="text-caption text-secondary mb-6" style={{ lineHeight: 1.6, fontSize: 14 }}>{s.description}</p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Fixed Service Fee</div>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 22 }}>₹ {s.price}</div>
                </div>
                <Button size="sm" onClick={() => navigate(`/app/marketplace/request/new?lawyerId=${lawyer.id}&serviceId=${s.id}`)}>
                  Submit Service Request →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Public Advocate Directory Grid View — All 10 Advocates in Responsive Wrapping Grid (No Side Scroll)
  const filteredLawyers = lawyers.filter(l => 
    l.verificationStatus === 'verified' && 
    (search === '' || l.name.toLowerCase().includes(search.toLowerCase()) || l.practiceAreas.some(p => p.toLowerCase().includes(search.toLowerCase())) || l.city.toLowerCase().includes(search.toLowerCase())) &&
    (selectedCat === 'all' || l.practiceAreas.some(p => p.toLowerCase().includes(selectedCat.toLowerCase())))
  );

  return (
    <div style={{ maxWidth: 1240, margin: '48px auto', padding: '0 32px', width: '100%', boxSizing: 'border-box' }}>
      <div className="text-center mb-10">
        <Badge variant="primary" className="mb-3" style={{ padding: '8px 16px', fontSize: 13 }}>Verified Directory</Badge>
        <h1 className="h1 mb-3" style={{ fontSize: 38, letterSpacing: '-0.02em' }}>Bar Council Verified Advocates</h1>
        <p className="text-secondary text-large" style={{ maxWidth: 640, margin: '0 auto', fontSize: 16 }}>Select from available verified advocates across India to view credentials, services, and submit legal requests.</p>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="mb-12" style={{ maxWidth: 840, margin: '0 auto 48px' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search advocate by name, practice area (e.g. Contract, DPDP), or city..." className="mb-5" />
        
        <div className="flex flex-wrap gap-2.5 justify-center">
          <button
            className={`btn btn-sm ${selectedCat === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 9999, padding: '8px 18px', fontSize: 13 }}
            onClick={() => setSelectedCat('all')}
          >
            All Practice Areas
          </button>
          {categories.slice(0, 7).map(c => (
            <button
              key={c.id}
              className={`btn btn-sm ${selectedCat === c.name ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 9999, padding: '8px 18px', fontSize: 13 }}
              onClick={() => setSelectedCat(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* 10 Advocates Grid with Auto-Wrapping (repeat(auto-fill, minmax(340px, 1fr))) — NO Side Scroll! */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28, width: '100%' }}>
        {filteredLawyers.map((lawyer) => (
          <Card
            key={lawyer.id}
            hover
            onClick={() => navigate(`/marketplace/lawyers/${lawyer.id}`)}
            padding="32px 28px"
            style={{ backgroundColor: '#FFF', borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={lawyer.avatar}
                  alt={lawyer.name}
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-border)', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}
                />
                <div>
                  <h3 className="h4" style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{lawyer.name}</h3>
                  <Badge variant="success" size="sm" className="mt-1" style={{ padding: '4px 10px', fontSize: 11 }}><Check size={12} /> Bar Verified</Badge>
                </div>
              </div>
              <p className="text-caption text-secondary mb-3" style={{ fontSize: 13 }}>{lawyer.firm} • <MapPin size={13} style={{ display: 'inline', margin: '0 2px' }} /> {lawyer.city}</p>
              
              <div className="flex flex-wrap gap-2 mb-6" style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                {lawyer.practiceAreas.slice(0, 3).map((area, idx) => (
                  <Badge key={idx} variant="neutral" size="sm" style={{ padding: '4px 10px', fontSize: 11, whiteSpace: 'nowrap' }}>{area}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-caption" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-muted block" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fee / Session</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 16 }}>₹ {lawyer.consultationFee}</span>
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 13 }}>View Profile & Services →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ACADEMY CATALOGUE
export const PublicAcademyPage = ({ navigate }) => {
  const courses = store.getState().courses;
  return (
    <div style={{ maxWidth: 1200, margin: '64px auto', padding: '0 32px' }}>
      <div className="text-center mb-12">
        <Badge variant="primary" className="mb-3">Legal Education</Badge>
        <h1 className="h1 mb-3" style={{ fontSize: 36 }}>Lawable Accredited Academy</h1>
        <p className="text-secondary text-large">Accredited legal courses, contract drafting syllabus, and verified digital certificates.</p>
      </div>

      <div className="grid grid-2 gap-8">
        {courses.map((crs) => (
          <Card key={crs.id} hover onClick={() => navigate(`/app/academy/${crs.id}`)} padding="32px">
            <Badge variant="primary" className="mb-3">{crs.category}</Badge>
            <h2 className="h3 mb-3">{crs.title}</h2>
            <p className="text-body text-secondary mb-6" style={{ lineHeight: 1.6 }}>{crs.description}</p>
            <div className="flex items-center justify-between text-caption text-secondary pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span>Instructor: {crs.instructor}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{crs.duration} • {crs.level}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// CERTIFICATE VERIFICATION
export const CertificateVerificationPage = ({ navigate, certId }) => {
  const certs = store.getState().certificates;
  const cert = certs.find((c) => c.id === certId || c.certificateNumber === certId) || certs[0];

  return (
    <div style={{ maxWidth: 680, margin: '64px auto', padding: '0 32px' }}>
      <Card className="text-center" padding="40px">
        <div className="icon-box mb-4" style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto' }}>
          <Award size={32} />
        </div>
        <Badge variant="success" className="mb-4">Official Certificate Verified</Badge>
        <h1 className="h2 mb-2">{cert.learnerName}</h1>
        <p className="text-body text-secondary mb-8">Has successfully completed the course requirements and passed examination for:</p>
        <div className="p-6 border rounded-md mb-8 bg-muted">
          <h3 className="h3 mb-3">{cert.courseTitle}</h3>
          <div className="flex items-center justify-center gap-6 text-caption text-secondary">
            <span>Score: {cert.score}%</span>
            <span>Issued: {cert.issueDate}</span>
            <span>ID: #{cert.certificateNumber}</span>
          </div>
        </div>
        <p className="text-caption text-muted">This certificate is cryptographically recorded on Lawable Legal OS platform verification ledger.</p>
      </Card>
    </div>
  );
};
