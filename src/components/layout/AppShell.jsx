import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, MessageSquare, ShoppingBag, BookOpen, Building2, 
  FileText, Clock, Bell, User, Settings, HelpCircle, LogOut, Shield, 
  Search, Menu, X, ChevronDown, Sparkles
} from 'lucide-react';
import { store } from '../../store/lawableStore';
import { ToastContainer } from '../common/UIComponents';

export const AppShell = ({ children, currentRoute, navigate }) => {
  const [state, setState] = useState(store.getState());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  useEffect(() => {
    return store.subscribe((newState) => setState({ ...newState }));
  }, []);

  const currentState = state || store.getState() || {};
  const currentUser = currentState.currentUser || { name: 'My Account', email: '', role: 'client', avatar: '' };
  const userInitial = (currentUser.name ? currentUser.name[0] : (currentUser.email ? currentUser.email[0] : 'U')).toUpperCase();
  const roles = currentState.roles || [];
  const notifications = currentState.notifications || [];
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const getMenuItems = () => {
    const role = currentUser.role || 'client';
    switch (role) {
      case 'student':
        return [
          { label: 'Dashboard', route: '/app', icon: LayoutDashboard },
          { label: 'Academy Courses', route: '/app/academy', icon: BookOpen },
          { label: 'Lawable AI', route: '/app/ai', icon: Sparkles },
          { label: 'Advocate Marketplace', route: '/app/marketplace', icon: ShoppingBag },
          { label: 'My Documents', route: '/app/documents', icon: FileText },
          { label: 'My Certificates', route: '/app/certificates', icon: Shield },
          { label: 'Notifications', route: '/app/notifications', icon: Bell, badge: unreadNotifs },
          { label: 'Profile', route: '/app/profile', icon: User },
          { label: 'Settings', route: '/app/settings', icon: Settings }
        ];
      case 'lawyer':
        return [
          { label: 'Dashboard', route: '/app/lawyer', icon: LayoutDashboard },
          { label: 'Request Inbox', route: '/app/lawyer/requests', icon: Clock },
          { label: 'Marketplace Profile', route: '/app/lawyer/profile', icon: User },
          { label: 'Services Catalogue', route: '/app/lawyer/services', icon: ShoppingBag },
          { label: 'Documents', route: '/app/documents', icon: FileText },
          { label: 'Notifications', route: '/app/notifications', icon: Bell, badge: unreadNotifs },
          { label: 'Profile', route: '/app/profile', icon: User },
          { label: 'Settings', route: '/app/settings', icon: Settings }
        ];
      case 'business':
        return [
          { label: 'Dashboard', route: '/app/business', icon: LayoutDashboard },
          { label: 'Compliance Checklist', route: '/app/business/compliance', icon: Shield },
          { label: 'Document Vault', route: '/app/business/documents', icon: FileText },
          { label: 'Contract Register', route: '/app/business/contracts', icon: FileText },
          { label: 'Lawable AI', route: '/app/ai', icon: Sparkles },
          { label: 'Marketplace', route: '/app/marketplace', icon: ShoppingBag },
          { label: 'Requests', route: '/app/requests', icon: Clock },
          { label: 'Notifications', route: '/app/notifications', icon: Bell, badge: unreadNotifs },
          { label: 'Profile', route: '/app/profile', icon: User },
          { label: 'Settings', route: '/app/settings', icon: Settings }
        ];
      case 'admin':
        return [
          { label: 'Admin Ops Panel', route: '/admin', icon: Shield },
          { label: 'Return to App', route: '/app', icon: LayoutDashboard }
        ];
      default: // client / individual
        return [
          { label: 'Dashboard', route: '/app', icon: LayoutDashboard },
          { label: 'Lawable AI', route: '/app/ai', icon: Sparkles },
          { label: 'Advocate Marketplace', route: '/app/marketplace', icon: ShoppingBag },
          { label: 'My Documents', route: '/app/documents', icon: FileText },
          { label: 'My Requests', route: '/app/requests', icon: Clock },
          { label: 'Academy', route: '/app/academy', icon: BookOpen },
          { label: 'Notifications', route: '/app/notifications', icon: Bell, badge: unreadNotifs },
          { label: 'Profile', route: '/app/profile', icon: User },
          { label: 'Settings', route: '/app/settings', icon: Settings }
        ];
    }
  };

  const navItems = getMenuItems();

  const isItemActive = (itemRoute) => {
    if (currentRoute === itemRoute) return true;
    const exactHubs = ['/app', '/app/lawyer', '/app/business', '/app/academy'];
    if (exactHubs.includes(itemRoute)) {
      return currentRoute === itemRoute;
    }
    return currentRoute && currentRoute.startsWith(itemRoute + '/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}>
      <ToastContainer toasts={store.getToasts()} />

      {/* Desktop Left Corporate Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)'
        }}
        className="hidden-mobile"
      >
        <div>
          {/* Logo Mark Header (Strict 74px Height Matching Topbar, Perfectly Vertically Centered) */}
          <div
            style={{
              height: 'var(--topbar-height)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              borderBottom: '1px solid var(--color-border)',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/app')}
          >
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', width: 38, height: 38, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                L
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Lawable</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginTop: 2 }}>Legal OS • India</div>
              </div>
            </div>
          </div>
          {/* User Role Indicator (Locked to Authenticated Role) */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface-muted)' }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Account Role</div>
            <div className="flex items-center gap-2">
              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-primary)' }}>
                {roles.find(r => r.id === currentUser.role)?.title || (currentUser.role ? currentUser.role.toUpperCase() : 'Student')}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '16px 12px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.route);
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => { e.preventDefault(); navigate(item.route); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                    borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                    fontWeight: active ? 600 : 500,
                    marginBottom: 4,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="badge badge-danger" style={{ fontSize: 10, padding: '2px 6px' }}>{item.badge}</span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Info */}
        <div style={{ padding: 16, borderTop: '1px solid var(--color-border)' }}>
          <div
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)' }}
            onClick={() => navigate(currentUser.role === 'business' ? '/app/business/profile' : '/app/profile')}
          >
            {(currentUser.avatar || (currentState.businessProfile && currentState.businessProfile.logo)) ? (
              <img 
                src={currentUser.avatar || (currentState.businessProfile && currentState.businessProfile.logo)} 
                alt="Logo/Avatar" 
                style={{ 
                  width: 38, 
                  height: 38, 
                  borderRadius: currentUser.role === 'business' ? '8px' : '50%', 
                  objectFit: 'contain',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  padding: currentUser.role === 'business' ? 2 : 0,
                  flexShrink: 0
                }} 
              />
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: currentUser.role === 'business' ? '8px' : '50%', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {userInitial}
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{currentUser.email}</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {currentUser.role === 'admin' ? (
              <a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }} className="btn btn-ghost btn-sm text-caption" style={{ color: 'var(--color-text-secondary)' }}>
                <Shield size={14} /> Admin Ops
              </a>
            ) : (
              <span className="text-caption text-secondary" style={{ fontSize: 11 }}>Lawable OS</span>
            )}
            <button className="btn btn-ghost btn-sm" title="Log Out" onClick={async () => { await store.logout(); navigate('/auth/login'); }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header Bar with Guaranteed Margin-Left Auto & Zero Overlap */}
        <header
          style={{
            height: 'var(--topbar-height)',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '0 40px',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm show-mobile" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={20} />
            </button>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text-primary)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {navItems.find(n => isItemActive(n.route))?.label || 'Lawable Workspace'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto', flexShrink: 0 }}>
            <button
              className="btn btn-secondary btn-sm flex items-center gap-2"
              onClick={() => navigate('/app/ai')}
              style={{ backgroundColor: 'var(--color-bg-surface-muted)', border: '1px solid var(--color-border)', padding: '9px 16px', borderRadius: 'var(--radius-md)' }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
              <span className="text-caption" style={{ fontWeight: 600 }}>Ask Lawable AI...</span>
            </button>

            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                style={{ position: 'relative', padding: 8 }}
              >
                <Bell size={18} />
                {unreadNotifs > 0 && (
                  <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-danger)' }} />
                )}
              </button>

              {notifMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 340, backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 100 }}>
                  <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
                    <a href="/app/notifications" onClick={(e) => { e.preventDefault(); navigate('/app/notifications'); setNotifMenuOpen(false); }} className="text-caption font-semibold">View all</a>
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {notifications.slice(0, 4).map((n) => (
                      <div key={n.id} className="p-4 border-b hover:bg-muted" style={{ borderColor: 'var(--color-border)', cursor: 'pointer' }} onClick={() => { store.markNotificationRead(n.id); navigate(n.link); setNotifMenuOpen(false); }}>
                        <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-primary)' }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{n.message}</div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>{n.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '36px 40px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
