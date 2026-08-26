import React, { useState, useEffect } from 'react';
import { store } from './store/lawableStore';

// Layouts
import { AppShell } from './components/layout/AppShell';
import { AdminShell } from './components/layout/AdminShell';
import { PublicShell } from './components/layout/PublicShell';

// Pages
import { 
  LandingPage, AboutPage, ContactPage, PricingPage, BlogListingPage, 
  PublicMarketplacePage, PublicAcademyPage, CertificateVerificationPage 
} from './pages/public/PublicPages';

import { 
  LoginPage, SignupPage, VerifyEmailPage, PasswordResetPage, getRoleDefaultLanding 
} from './pages/auth/AuthPages';

import { 
  AIChatPage, AIDraftPage, DocumentsVaultPage 
} from './pages/ai/AIPages';

import { 
  MarketplaceRequestWizardPage, MyRequestsListPage, MarketplaceRequestDetailPage 
} from './pages/marketplace/MarketplacePages';

import { 
  AcademyPage, AcademyQuizPage 
} from './pages/academy/AcademyPages';

import { 
  BusinessDashboardPage, ComplianceChecklistPage, BusinessDocumentVaultPage, 
  ContractRegisterPage, BusinessProfilePage 
} from './pages/business/BusinessPages';

import { 
  LawyerDashboardPage, LawyerRequestsInboxPage, LawyerProfilePage, 
  LawyerServicesCataloguePage 
} from './pages/lawyer/LawyerPages';

import { 
  ProfilePage, SettingsPage, NotificationsPage, ClientDashboardPage, StudentDashboardPage 
} from './pages/account/AccountPages';

import { 
  AdminOpsDashboardPage 
} from './pages/admin/AdminPages';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const [storeState, setStoreState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setStoreState({ ...newState });
    });
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    setSearchParams(new URLSearchParams(path.includes('?') ? path.split('?')[1] : ''));
    window.scrollTo(0, 0);
  };

  // --- Flexible Normalized Route Resolver ---
  const renderRoute = () => {
    // Strip trailing slash except for root '/'
    const p = (currentPath.length > 1 && currentPath.endsWith('/')) ? currentPath.slice(0, -1) : currentPath;

    // PUBLIC MARKETING & DIRECTORY ROUTES
    if (p === '/') return <PublicShell navigate={navigate} currentRoute={p}><LandingPage navigate={navigate} /></PublicShell>;
    if (p === '/about') return <PublicShell navigate={navigate} currentRoute={p}><AboutPage navigate={navigate} /></PublicShell>;
    if (p === '/contact') return <PublicShell navigate={navigate} currentRoute={p}><ContactPage navigate={navigate} /></PublicShell>;
    if (p === '/pricing') return <PublicShell navigate={navigate} currentRoute={p}><PricingPage navigate={navigate} /></PublicShell>;
    if (p === '/blog') return <PublicShell navigate={navigate} currentRoute={p}><BlogListingPage navigate={navigate} /></PublicShell>;
    if (p.startsWith('/blog/')) return <PublicShell navigate={navigate} currentRoute={p}><BlogListingPage navigate={navigate} selectedSlug={p.replace('/blog/', '')} /></PublicShell>;
    
    if (p === '/marketplace') return <PublicShell navigate={navigate} currentRoute={p}><PublicMarketplacePage navigate={navigate} /></PublicShell>;
    if (p.startsWith('/marketplace/lawyers/')) return <PublicShell navigate={navigate} currentRoute={p}><PublicMarketplacePage navigate={navigate} lawyerId={p.replace('/marketplace/lawyers/', '')} /></PublicShell>;
    if (p.startsWith('/marketplace/services/')) return <PublicShell navigate={navigate} currentRoute={p}><PublicMarketplacePage navigate={navigate} serviceId={p.replace('/marketplace/services/', '')} /></PublicShell>;
    
    if (p === '/academy') return <PublicShell navigate={navigate} currentRoute={p}><PublicAcademyPage navigate={navigate} /></PublicShell>;
    if (p.startsWith('/verify/')) return <PublicShell navigate={navigate} currentRoute={p}><CertificateVerificationPage navigate={navigate} certId={p.replace('/verify/', '')} /></PublicShell>;
    if (p.startsWith('/certificates/')) return <PublicShell navigate={navigate} currentRoute={p}><CertificateVerificationPage navigate={navigate} certId={p.replace('/certificates/', '')} /></PublicShell>;

    // AUTH ROUTES
    if (p === '/auth/login') return <LoginPage navigate={navigate} />;
    if (p === '/auth/signup') return <SignupPage navigate={navigate} />;
    if (p === '/auth/verify-email') return <VerifyEmailPage navigate={navigate} />;
    if (p === '/auth/reset-password' || p === '/auth/forgot-password') return <PasswordResetPage navigate={navigate} />;

    // ROLE-SPECIFIC DASHBOARD FOR /app (PRD §6.1 FR-1.7)
    if (p === '/app') {
      const activeRole = store.getState().currentUser?.role || 'client';
      if (activeRole === 'student') return <AppShell navigate={navigate} currentRoute="/app"><StudentDashboardPage navigate={navigate} /></AppShell>;
      if (activeRole === 'lawyer') return <AppShell navigate={navigate} currentRoute="/app/lawyer"><LawyerDashboardPage navigate={navigate} /></AppShell>;
      if (activeRole === 'business') return <AppShell navigate={navigate} currentRoute="/app/business"><BusinessDashboardPage navigate={navigate} /></AppShell>;
      if (activeRole === 'admin') return <AdminOpsDashboardPage navigate={navigate} activeTab="overview" />;
      return <AppShell navigate={navigate} currentRoute="/app"><ClientDashboardPage navigate={navigate} /></AppShell>;
    }

    // LAWABLE AI ROUTES
    if (p === '/app/ai') return <AppShell navigate={navigate} currentRoute={p}><AIChatPage navigate={navigate} /></AppShell>;
    if (p.startsWith('/app/ai/draft')) return <AppShell navigate={navigate} currentRoute={p}><AIDraftPage navigate={navigate} /></AppShell>;
    if (p === '/app/documents') return <AppShell navigate={navigate} currentRoute={p}><DocumentsVaultPage navigate={navigate} /></AppShell>;

    // AUTHENTICATED MARKETPLACE & REQUESTS
    if (p.startsWith('/app/marketplace/lawyers/')) {
      const lId = p.replace('/app/marketplace/lawyers/', '');
      return <AppShell navigate={navigate} currentRoute={p}><PublicMarketplacePage navigate={navigate} lawyerId={lId} /></AppShell>;
    }
    if (p === '/app/marketplace') return <AppShell navigate={navigate} currentRoute={p}><PublicMarketplacePage navigate={navigate} /></AppShell>;
    if (p === '/app/marketplace/request/new') {
      const source = searchParams.get('source');
      const sourceRefId = searchParams.get('sourceRefId');
      const lawyerId = searchParams.get('lawyerId');
      const serviceId = searchParams.get('serviceId');
      return <AppShell navigate={navigate} currentRoute={p}><MarketplaceRequestWizardPage navigate={navigate} source={source} sourceRefId={sourceRefId} lawyerId={lawyerId} serviceId={serviceId} /></AppShell>;
    }
    if (p === '/app/requests') return <AppShell navigate={navigate} currentRoute={p}><MyRequestsListPage navigate={navigate} /></AppShell>;
    if (p.startsWith('/app/requests/')) return <AppShell navigate={navigate} currentRoute={p}><MarketplaceRequestDetailPage navigate={navigate} requestId={p.replace('/app/requests/', '')} /></AppShell>;

    // ACADEMY
    if (p.endsWith('/quiz')) {
      const match = p.match(/\/app\/academy\/([^\/]+)\/quiz/);
      const cId = match ? match[1] : 'crs-1';
      return <AppShell navigate={navigate} currentRoute={p}><AcademyQuizPage navigate={navigate} courseId={cId} /></AppShell>;
    }
    if (p.startsWith('/app/academy/')) return <AppShell navigate={navigate} currentRoute={p}><AcademyPage navigate={navigate} courseId={p.replace('/app/academy/', '')} /></AppShell>;
    if (p === '/app/academy' || p === '/app/certificates') return <AppShell navigate={navigate} currentRoute={p}><AcademyPage navigate={navigate} /></AppShell>;

    // BUSINESS MODULE
    if (p === '/app/business/compliance') return <AppShell navigate={navigate} currentRoute={p}><ComplianceChecklistPage navigate={navigate} /></AppShell>;
    if (p.startsWith('/app/business/compliance/')) return <AppShell navigate={navigate} currentRoute={p}><ComplianceChecklistPage navigate={navigate} itemId={p.replace('/app/business/compliance/', '')} /></AppShell>;
    if (p === '/app/business/documents') return <AppShell navigate={navigate} currentRoute={p}><BusinessDocumentVaultPage navigate={navigate} /></AppShell>;
    if (p === '/app/business/contracts') return <AppShell navigate={navigate} currentRoute={p}><ContractRegisterPage navigate={navigate} /></AppShell>;
    if (p === '/app/business/profile') return <AppShell navigate={navigate} currentRoute={p}><BusinessProfilePage navigate={navigate} /></AppShell>;
    if (p === '/app/business') return <AppShell navigate={navigate} currentRoute={p}><BusinessDashboardPage navigate={navigate} /></AppShell>;

    // LAWYER MODULE
    if (p === '/app/lawyer/requests') return <AppShell navigate={navigate} currentRoute={p}><LawyerRequestsInboxPage navigate={navigate} /></AppShell>;
    if (p.startsWith('/app/lawyer/requests/')) return <AppShell navigate={navigate} currentRoute={p}><LawyerRequestsInboxPage navigate={navigate} requestId={p.replace('/app/lawyer/requests/', '')} /></AppShell>;
    if (p === '/app/lawyer/services') return <AppShell navigate={navigate} currentRoute={p}><LawyerServicesCataloguePage navigate={navigate} /></AppShell>;
    if (p === '/app/lawyer/profile') return <AppShell navigate={navigate} currentRoute={p}><LawyerProfilePage navigate={navigate} /></AppShell>;
    if (p === '/app/lawyer') return <AppShell navigate={navigate} currentRoute={p}><LawyerDashboardPage navigate={navigate} /></AppShell>;

    // USER ACCOUNT ROUTES (EXACT & PREFIX MATCHING)
    if (p === '/app/profile' || p.startsWith('/app/profile')) return <AppShell navigate={navigate} currentRoute={p}><ProfilePage navigate={navigate} /></AppShell>;
    if (p === '/app/settings' || p.startsWith('/app/settings')) return <AppShell navigate={navigate} currentRoute={p}><SettingsPage navigate={navigate} /></AppShell>;
    if (p === '/app/notifications' || p.startsWith('/app/notifications')) return <AppShell navigate={navigate} currentRoute={p}><NotificationsPage navigate={navigate} /></AppShell>;

    // ADMIN ROUTES (/admin/*)
    if (p.startsWith('/admin')) {
      const tab = p.replace('/admin/', '').replace('/admin', '') || 'overview';
      return <AdminOpsDashboardPage navigate={navigate} activeTab={tab} />;
    }

    // DEFAULT FALLBACK
    return <AppShell navigate={navigate} currentRoute={p}><ClientDashboardPage navigate={navigate} /></AppShell>;
  };

  return renderRoute();
}

export default App;
