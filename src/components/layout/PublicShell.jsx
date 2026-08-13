import React from 'react';
import { ArrowRight, Sparkles, Shield, BookOpen, Building2, Users } from 'lucide-react';
import { store } from '../../store/lawableStore';
import { ToastContainer } from '../common/UIComponents';

export const PublicShell = ({ children, navigate, currentRoute }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}>
      <ToastContainer toasts={store.getToasts()} />

      {/* Sticky Corporate Header (Height 74px, Generous Spacing) */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo Mark */}
          <div className="flex items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>
              L
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Lawable</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginTop: 2 }}>Legal OS • India</div>
            </div>
          </div>

          {/* Nav Links with 24px Gaps */}
          <nav className="flex items-center gap-6 hidden-mobile">
            {[
              { label: 'Home', route: '/' },
              { label: 'About', route: '/about' },
              { label: 'Find Advocates', route: '/marketplace' },
              { label: 'Academy', route: '/academy' },
              { label: 'Pricing', route: '/pricing' },
              { label: 'Blog', route: '/blog' },
              { label: 'Contact', route: '/contact' }
            ].map((link) => {
              const active = currentRoute === link.route || (link.route !== '/' && currentRoute.startsWith(link.route));
              return (
                <a
                  key={link.route}
                  href={link.route}
                  onClick={(e) => { e.preventDefault(); navigate(link.route); }}
                  style={{
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/auth/login')}>
              Login
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/auth/signup')}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Corporate Dark Footer (64px Top/Bottom Padding) */}
      <footer style={{ backgroundColor: '#0F172A', color: '#94A3B8', padding: '64px 32px 32px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48, marginBottom: 48 }}>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>L</div>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#FFF' }}>Lawable</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: '#94A3B8' }}>
              Integrated Legal Technology Platform connecting Legal AI, Bar Council Verified Advocates, Business Compliance, and Accredited Academy across India.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Product Modules</h4>
            <div className="flex flex-col gap-3" style={{ fontSize: 13 }}>
              <a href="/app/ai" onClick={(e) => { e.preventDefault(); navigate('/auth/login'); }} className="hover:text-white">Lawable AI Assistant</a>
              <a href="/marketplace" onClick={(e) => { e.preventDefault(); navigate('/marketplace'); }} className="hover:text-white">Advocate Marketplace</a>
              <a href="/academy" onClick={(e) => { e.preventDefault(); navigate('/academy'); }} className="hover:text-white">Legal Academy</a>
              <a href="/app/business" onClick={(e) => { e.preventDefault(); navigate('/auth/login'); }} className="hover:text-white">Business Compliance Engine</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Platform & Legal</h4>
            <div className="flex flex-col gap-3" style={{ fontSize: 13 }}>
              <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-white">About Platform</a>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }} className="hover:text-white">Pricing & Plans</a>
              <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }} className="hover:text-white">Legal Editorial Blog</a>
              <a href="/certificates/cert-LAW-2026-8891" onClick={(e) => { e.preventDefault(); navigate('/certificates/cert-LAW-2026-8891'); }} className="hover:text-white">Certificate Verification</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Legal Guardrails</h4>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: '#64748B' }}>
              Lawable AI provides general legal information and document assistance under Indian jurisprudence. It does not constitute legal advice or create an attorney-client relationship. Consult a qualified advocate for specific matters.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', borderTop: '1px solid #1E293B', paddingTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
          © {new Date().getFullYear()} Lawable Legal Technologies Pvt Ltd. All rights reserved. Registered Bar Council Verified Directory.
        </div>
      </footer>
    </div>
  );
};
