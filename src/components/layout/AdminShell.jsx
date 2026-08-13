import React, { useState } from 'react';
import { 
  Shield, Users, CheckCircle, Building2, ShoppingBag, List, Clock, 
  BookOpen, HelpCircle, FileCheck, Eye, FileText, Settings, History, 
  ArrowLeft, Bell
} from 'lucide-react';
import { store } from '../../store/lawableStore';
import { ToastContainer } from '../common/UIComponents';

export const AdminShell = ({ children, currentRoute, navigate }) => {
  const adminMenuItems = [
    { label: 'Admin Dashboard', route: '/admin', icon: Shield },
    { label: 'User Directory', route: '/admin/users', icon: Users },
    { label: 'Lawyer Verification Queue', route: '/admin/lawyers/verification', icon: CheckCircle },
    { label: 'Business Directory', route: '/admin/businesses', icon: Building2 },
    { label: 'Marketplace Services', route: '/admin/marketplace/services', icon: ShoppingBag },
    { label: 'Service Categories', route: '/admin/marketplace/categories', icon: List },
    { label: 'Service Requests Queue', route: '/admin/marketplace/requests', icon: Clock },
    { label: 'Academy Courses CMS', route: '/admin/academy/courses', icon: BookOpen },
    { label: 'Academy Quizzes CMS', route: '/admin/academy/quizzes', icon: HelpCircle },
    { label: 'Compliance CMS', route: '/admin/compliance/requirements', icon: FileCheck },
    { label: 'Compliance Previewer', route: '/admin/compliance/preview', icon: Eye },
    { label: 'AI Oversight Transcripts', route: '/admin/ai/conversations', icon: FileText },
    { label: 'Blog CMS', route: '/admin/blogs', icon: FileText },
    { label: 'Documents Inspector', route: '/admin/documents', icon: FileText },
    { label: 'Platform Settings', route: '/admin/settings', icon: Settings },
    { label: 'Audit Trail Log', route: '/admin/audit-log', icon: History }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <ToastContainer toasts={store.getToasts()} />

      {/* Single Admin Sidebar */}
      <aside
        style={{
          width: 280,
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100
        }}
      >
        <div>
          {/* Admin Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: 'var(--color-primary)', padding: '6px 10px', borderRadius: 6, fontWeight: 700, fontSize: 16 }}>
                L
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#FFF' }}>Lawable Ops</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Platform Operations</div>
              </div>
            </div>
          </div>

          <div className="p-2 border-b border-slate-800">
            <button
              className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-2"
              onClick={() => navigate('/app')}
              style={{ backgroundColor: '#1E293B', color: '#CBD5E1', border: '1px solid #334155', width: '100%' }}
            >
              <ArrowLeft size={14} /> Return to App View
            </button>
          </div>

          {/* Nav Items */}
          <nav style={{ padding: '8px', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => { e.preventDefault(); navigate(item.route); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 6,
                    color: isActive ? '#FFF' : '#94A3B8',
                    backgroundColor: isActive ? '#312E81' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    marginBottom: 2
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-caption text-slate-400">
          <div>System Operational Status: <span style={{ color: '#10B981', fontWeight: 600 }}>Active</span></div>
          <div className="mt-1">Lawable v1.0.0 (MVP)</div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div style={{ flex: 1, marginLeft: 280, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 60,
            backgroundColor: '#FFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 90
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text-primary)' }}>
            {adminMenuItems.find((i) => i.route === currentRoute)?.label || 'Administrative Operations'}
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-warning" style={{ fontSize: 11 }}>Restricted Ops Workspace</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
