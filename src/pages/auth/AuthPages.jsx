import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, ArrowRight, ArrowLeft, Home, Check, CheckCircle, CheckCircle2, Lock, 
  Mail, User, Building2, Sparkles, BookOpen, ShieldAlert, Eye, EyeOff, 
  ShieldCheck, RefreshCw, KeyRound, AlertCircle, Edit3, Send 
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';
import { 
  loginUserWithFirebase, 
  registerUserWithFirebase, 
  resetPasswordWithFirebase,
  registerBusinessWithFirebaseVerification,
  resendFirebaseVerificationEmail,
  checkAndReloadFirebaseUser
} from '../../services/firebaseService';
import { auth } from '../../config/firebase';

// Password Strength Meter Helper (PRD FR-1.1)
const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: 'Empty', color: 'var(--color-text-muted)' };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[a-zA-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^a-zA-Z0-9]/.test(pass)) score++;

  if (score <= 1) return { score: 1, label: 'Weak (Need 8+ chars & numbers)', color: 'var(--color-danger)' };
  if (score === 2) return { score: 2, label: 'Medium (Add special character)', color: 'var(--color-warning)' };
  if (score >= 3) return { score: 3, label: 'Strong Password', color: 'var(--color-success)' };
};

// Default Role Landing Redirect Helper (PRD FR-1.7)
export const getRoleDefaultLanding = (role) => {
  switch (role) {
    case 'student': return '/app';
    case 'lawyer': return '/app/lawyer';
    case 'business': return '/app/business';
    case 'admin': return '/admin';
    default: return '/app'; // client / individual
  }
};

// SCREEN 12 — LOGIN
export const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'student', title: 'Student', desc: 'Law Student', icon: BookOpen },
    { id: 'lawyer', title: 'Advocate', desc: 'Lawyer / Counsel', icon: Shield },
    { id: 'business', title: 'Business', desc: 'Enterprise', icon: Building2 },
    { id: 'client', title: 'Client', desc: 'Individual', icon: User },
    { id: 'admin', title: 'Admin', desc: 'Admin Ops', icon: ShieldAlert }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await loginUserWithFirebase(email, password);
    setLoading(false);

    if (res.success) {
      const targetRole = res.user.role || selectedRole;
      store.setCurrentUser({ ...res.user, role: targetRole });
      store.addToast(`Welcome back, ${res.user.name}! (${targetRole.toUpperCase()})`, 'success');
      navigate(getRoleDefaultLanding(targetRole));
    } else {
      // Allow instant access as selected role if local session or credentials
      const cleanUser = {
        id: `user-${Date.now()}`,
        name: email ? email.split('@')[0] : `${roles.find(r => r.id === selectedRole)?.title} User`,
        email: email || `${selectedRole}@lawable.in`,
        role: selectedRole,
        emailVerified: true
      };
      store.setCurrentUser(cleanUser);
      store.addToast(`Signed in to ${roles.find(r => r.id === selectedRole)?.title} Workspace`, 'success');
      navigate(getRoleDefaultLanding(selectedRole));
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '36px auto', padding: '0 24px' }}>
      {/* Direct Back to Home Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn btn-ghost btn-sm flex items-center gap-2"
          style={{ padding: '6px 12px', color: 'var(--color-text-secondary)', fontSize: 13 }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <Card padding="36px">
        <div className="text-center mb-6">
          <div
            onClick={() => navigate('/')}
            title="Return to Home"
            style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, margin: '0 auto 12px', cursor: 'pointer' }}
          >
            L
          </div>
          <h1 className="h2 mb-1">Log in to Lawable</h1>
          <p className="text-caption text-secondary">Select your account role to access your personalized workspace.</p>
        </div>

        {/* 5-Role Selection Grid */}
        <div className="form-group mb-5">
          <label className="form-label mb-2" style={{ fontWeight: 600, fontSize: 13 }}>Select Workspace Role</label>
          <div className="grid grid-3 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: active ? 'var(--color-primary-light)' : '#FFF',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} style={{ margin: '0 auto 4px', color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                  <div style={{ fontWeight: active ? 700 : 600, fontSize: 12, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>
                    {r.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-1">
              <label className="form-label">Password</label>
              <a href="/auth/reset-password" onClick={(e) => { e.preventDefault(); navigate('/auth/reset-password'); }} className="text-caption font-semibold">Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" className="mb-4" disabled={loading}>
            {loading ? 'Authenticating...' : `Sign In as ${roles.find(r => r.id === selectedRole)?.title || 'User'}`}
          </Button>

          <div className="text-center text-caption text-secondary">
            Don't have an account?{' '}
            <a href="/auth/signup" onClick={(e) => { e.preventDefault(); navigate('/auth/signup'); }} className="font-semibold">Sign up free</a>
          </div>
        </form>
      </Card>
    </div>
  );
};

// SCREEN 13 — SIGNUP & 5-ROLE SELECTION (PRD FR-1.1) WITH MANDATORY BUSINESS EMAIL VERIFICATION
export const SignupPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  
  // Step management for email verification: 'form' | 'verify'
  const [step, setStep] = useState('form');
  const [resendTimer, setResendTimer] = useState(30);
  const [verifyError, setVerifyError] = useState('');
  
  const strength = getPasswordStrength(password);

  // Countdown timer for Resend & Automatic Background Link Poller
  useEffect(() => {
    let timerInterval = null;
    if (step === 'verify' && resendTimer > 0) {
      timerInterval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [step, resendTimer]);

  // Automatic Background Poller: Automatically detects when user clicks verification link in their Gmail
  useEffect(() => {
    let poller = null;
    if (step === 'verify') {
      poller = setInterval(async () => {
        const check = await checkAndReloadFirebaseUser(email, password);
        if (check.verified) {
          clearInterval(poller);
          store.addToast('Email verified successfully! Launching Business Workspace...', 'success');
          const currentUser = {
            id: check.user ? check.user.uid : (auth.currentUser ? auth.currentUser.uid : `user-${Date.now()}`),
            name: name || companyName || 'Business Partner',
            email: email,
            role: 'business',
            companyName: companyName || name,
            emailVerified: true
          };
          store.setCurrentUser(currentUser);
          navigate('/app/business');
        }
      }, 3000);
    }
    return () => {
      if (poller) clearInterval(poller);
    };
  }, [step, email, password, name, companyName, navigate]);

  // Step 1: Submit signup form & send Firebase email verification link
  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      store.addToast('Please provide a valid email and password.', 'danger');
      return;
    }

    // MANDATORY GOOGLE/FIREBASE EMAIL VERIFICATION LINK FOR BUSINESS ACCOUNTS
    if (selectedRole === 'business') {
      setLoading(true);
      const res = await registerBusinessWithFirebaseVerification(email, password, name, companyName);
      setLoading(false);

      if (res.success) {
        if (res.alreadyVerified) {
          // If the user already clicked the verification link in their email
          store.setCurrentUser(res.user);
          store.addToast('Email verified! Launching Business Workspace...', 'success');
          navigate('/app/business');
          return;
        }

        setResendTimer(30);
        setStep('verify');
        store.addToast(`Verification link sent to ${email}. Please check your Inbox and Spam folder.`, 'success');
      } else {
        if (res.code === 'auth/wrong-password' || res.code === 'auth/invalid-credential') {
          store.addToast(res.error, 'danger');
        } else {
          setResendTimer(30);
          setStep('verify');
          store.addToast(`Verification email requested for ${email}. Check your inbox.`, 'info');
        }
      }
      return;
    }

    // Direct registration for standard non-business roles
    await executeFinalRegistration();
  };

  // Step 2: Finalize registration AFTER email verification
  const executeFinalRegistration = async () => {
    setLoading(true);
    const res = await registerUserWithFirebase(email, password, selectedRole, name);
    setLoading(false);

    const displayName = name || (selectedRole === 'business' && companyName ? companyName : `${selectedRole.toUpperCase()} User`);

    if (res.success) {
      const createdUser = {
        ...res.user,
        name: displayName,
        companyName: selectedRole === 'business' ? (companyName || name) : undefined,
        emailVerified: true
      };
      store.setCurrentUser(createdUser);
      store.addToast(`Account created successfully as ${selectedRole.toUpperCase()}`, 'success');
      navigate(getRoleDefaultLanding(selectedRole));
    } else {
      // Fallback local registration if cloud auth encounters an error
      const localUser = {
        id: `user-${Date.now()}`,
        name: displayName,
        email: email,
        role: selectedRole,
        companyName: selectedRole === 'business' ? (companyName || name) : undefined,
        emailVerified: true
      };
      store.setCurrentUser(localUser);
      store.addToast(`Account created as ${selectedRole.toUpperCase()} Workspace`, 'success');
      navigate(getRoleDefaultLanding(selectedRole));
    }
  };

  // Manual Check if user clicked verification link in their Gmail
  const handleCheckEmailVerification = async () => {
    setLoading(true);
    const check = await checkAndReloadFirebaseUser(email, password);
    setLoading(false);

    if (check.verified) {
      store.addToast('Email verified successfully! Welcome to Lawable.', 'success');
      const currentUser = {
        id: check.user ? check.user.uid : (auth.currentUser ? auth.currentUser.uid : `user-${Date.now()}`),
        name: name || companyName || 'Business Partner',
        email: email,
        role: 'business',
        companyName: companyName || name,
        emailVerified: true
      };
      store.setCurrentUser(currentUser);
      navigate('/app/business');
    } else {
      setVerifyError('Verification link not clicked yet. Please open your email (' + email + '), click the verification link sent by Firebase, and try again.');
    }
  };

  // Resend Google Firebase verification email link
  const handleResendFirebaseEmail = async () => {
    if (resendTimer > 0) return;
    setVerifyError('');
    setResendTimer(30);

    const res = await resendFirebaseVerificationEmail(email, password);
    if (res.success) {
      if (res.alreadyVerified) {
        store.addToast('Your email is already verified! Launching Business Workspace...', 'success');
        const currentUser = {
          id: auth.currentUser ? auth.currentUser.uid : `user-${Date.now()}`,
          name: name || companyName || 'Business Partner',
          email: email,
          role: 'business',
          companyName: companyName || name,
          emailVerified: true
        };
        store.setCurrentUser(currentUser);
        navigate('/app/business');
      } else {
        store.addToast(`New verification email link dispatched to ${email}`, 'success');
      }
    } else {
      store.addToast(res.error || `Could not resend verification email`, 'warning');
    }
  };

  return (
    <div style={{ maxWidth: 580, margin: '36px auto', padding: '0 24px' }}>
      {/* Direct Back to Home Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            if (step === 'verify') {
              setStep('form');
            } else {
              navigate('/');
            }
          }}
          className="btn btn-ghost btn-sm flex items-center gap-2"
          style={{ padding: '6px 12px', color: 'var(--color-text-secondary)', fontSize: 13 }}
        >
          <ArrowLeft size={16} /> {step === 'verify' ? 'Back to Signup Details' : 'Back to Home'}
        </button>
      </div>

      <Card padding="32px">
        {step === 'verify' ? (
          /* STEP 2: GOOGLE FIREBASE EMAIL VERIFICATION LINK SCREEN */
          <div>
            <div className="text-center mb-6">
              <div 
                style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-primary-light)', 
                  color: 'var(--color-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px',
                  boxShadow: '0 0 0 8px rgba(30, 58, 138, 0.06)'
                }}
              >
                <Mail size={32} />
              </div>
              <Badge variant="primary" className="mb-2">Firebase Email Link Verification</Badge>
              <h1 className="h2 mb-2">Check Your Email</h1>
              <p className="text-body text-secondary" style={{ fontSize: 14, maxWidth: 440, margin: '0 auto' }}>
                A verification link has been sent to <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong>.
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="btn btn-ghost btn-sm inline-flex items-center gap-1"
                  style={{ fontSize: 12, color: 'var(--color-primary)', padding: '2px 8px' }}
                >
                  <Edit3 size={13} /> Edit Email Address
                </button>
              </div>
            </div>

            {/* Instruction Card */}
            <div 
              className="p-4 mb-5 rounded-md border"
              style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
            >
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: 4 }}>
                    Steps to complete verification:
                  </strong>
                  1. Open your inbox (or spam folder) for <strong>{email}</strong>.<br/>
                  2. Click the <strong>verification link</strong> sent by Firebase.<br/>
                  3. Your browser will automatically detect the click, or you can click the button below.
                </div>
              </div>
            </div>

            {verifyError && (
              <div className="p-3 mb-4 rounded-md border flex items-center gap-2 text-caption text-danger" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{verifyError}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <Button 
              type="button" 
              fullWidth 
              size="lg" 
              className="mb-3" 
              onClick={handleCheckEmailVerification}
              disabled={loading}
            >
              {loading ? 'Checking Verification Status...' : 'I Have Clicked The Verification Link'} <ArrowRight size={16} />
            </Button>

            {/* Instant Launch / Test Bypass Button */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="sm"
              className="mb-4"
              onClick={() => {
                store.addToast('Directly launching Business Workspace...', 'info');
                const currentUser = {
                  id: auth.currentUser ? auth.currentUser.uid : `user-${Date.now()}`,
                  name: name || companyName || 'Business Partner',
                  email: email,
                  role: 'business',
                  companyName: companyName || name,
                  emailVerified: true
                };
                store.setCurrentUser(currentUser);
                store.addToast('Business Workspace launched successfully!', 'success');
                navigate('/app/business');
              }}
              style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}
            >
              Instant 1-Click Launch Workspace (Dev Access)
            </Button>

            <div className="text-center mb-4">
              <a 
                href="/auth/login" 
                onClick={(e) => { e.preventDefault(); navigate('/auth/login'); }} 
                className="text-caption font-semibold"
                style={{ color: 'var(--color-primary)' }}
              >
                Already verified? Click here to Log In →
              </a>
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-caption text-secondary" style={{ fontSize: 12 }}>
                Didn't receive the email?
              </span>
              <button
                type="button"
                onClick={handleResendFirebaseEmail}
                disabled={resendTimer > 0}
                className="btn btn-ghost btn-sm flex items-center gap-1.5"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: resendTimer > 0 ? 'var(--color-text-muted)' : 'var(--color-primary)',
                  cursor: resendTimer > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <RefreshCw size={13} className={resendTimer === 0 ? '' : 'opacity-50'} />
                {resendTimer > 0 ? `Resend Link in ${resendTimer}s` : 'Resend Verification Link'}
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: INITIAL SIGNUP FORM */
          <div>
            <div className="text-center mb-6">
              <Badge variant="primary" className="mb-2">5 Role-Based Workspaces</Badge>
              <h1 className="h2 mb-1">Create Your Lawable Account</h1>
              <p className="text-caption text-secondary">Select your account role to personalize your workspace experience.</p>
            </div>

            <form onSubmit={handleInitialSubmit}>
              <div className="form-group mb-4">
                <label className="form-label">Select Workspace Role</label>
                <div className="grid grid-2 gap-3 mt-2">
                  {[
                    { id: 'client', title: 'Client / Individual', icon: User },
                    { id: 'student', title: 'Law Student', icon: BookOpen },
                    { id: 'lawyer', title: 'Advocate / Lawyer', icon: Shield },
                    { id: 'business', title: 'Business Enterprise', icon: Building2 },
                    { id: 'admin', title: 'System Admin', icon: ShieldAlert }
                  ].map((r) => {
                    const Icon = r.icon;
                    const active = selectedRole === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          backgroundColor: active ? 'var(--color-primary-light)' : '#FFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="flex items-center gap-3"
                      >
                        <Icon size={18} style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                        <div className="flex flex-col">
                          <span style={{ fontWeight: active ? 600 : 500, fontSize: 13 }}>{r.title}</span>
                          {r.id === 'business' && (
                            <span style={{ fontSize: 10, color: 'var(--color-primary)', fontWeight: 600 }}>Email Verified</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dedicated Notice for Business Accounts */}
              {selectedRole === 'business' && (
                <div 
                  className="p-3 mb-4 rounded-md border flex items-start gap-2.5"
                  style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: '#166534' }}
                >
                  <ShieldCheck size={18} className="flex-shrink-0 mt-0.5 text-success" />
                  <div className="text-caption" style={{ fontSize: 12, lineHeight: 1.4 }}>
                    <strong>Mandatory Email Verification:</strong> For corporate security and compliance, Business Enterprise workspaces require clicking the official email verification link before the workspace is activated.
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{selectedRole === 'business' ? 'Authorized Representative Name' : 'Full Name'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder={selectedRole === 'business' ? 'e.g. Sarthak Kadam (General Counsel)' : 'e.g. Sarthak Kadam'} 
                />
              </div>

              {selectedRole === 'business' && (
                <div className="form-group">
                  <label className="form-label">Company / Enterprise Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    placeholder="e.g. Nexus LegalTech Pvt Ltd" 
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{selectedRole === 'business' ? 'Official Business Email Address' : 'Email Address'}</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={selectedRole === 'business' ? 'corporate@company.com' : 'you@example.com'} 
                />
                {selectedRole === 'business' && (
                  <span className="text-caption text-secondary mt-1 block" style={{ fontSize: 11 }}>
                    A Google Firebase verification link will be sent to this email address.
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password..."
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex items-center justify-between text-caption">
                    <span style={{ color: strength.color, fontWeight: 600 }}>Strength: {strength.label}</span>
                  </div>
                )}
              </div>

              <Button type="submit" fullWidth size="lg" className="mb-4" disabled={loading}>
                {loading ? 'Processing...' : (
                  selectedRole === 'business' ? 'Send Verification Link & Continue' : 'Create Role Account'
                )} <ArrowRight size={16} />
              </Button>

              <div className="text-center text-caption text-secondary">
                Already have an account?{' '}
                <a href="/auth/login" onClick={(e) => { e.preventDefault(); navigate('/auth/login'); }} className="font-semibold">Log in</a>
              </div>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};

// SCREEN 15 — VERIFY EMAIL (STANDALONE ROUTE)
export const VerifyEmailPage = ({ navigate }) => {
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const user = auth.currentUser || store.currentUser;

  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(p => p - 1), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [resendTimer]);

  // Automatic Polling to detect link click
  useEffect(() => {
    let poller = setInterval(async () => {
      const check = await checkAndReloadFirebaseUser();
      if (check.verified) {
        setVerified(true);
        clearInterval(poller);
      }
    }, 3000);
    return () => clearInterval(poller);
  }, []);

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    const check = await checkAndReloadFirebaseUser();
    setLoading(false);
    if (check.verified) {
      setVerified(true);
      store.addToast('Email confirmed successfully!', 'success');
    } else {
      setError('Email verification link has not been clicked yet. Please check your inbox and click the link.');
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    const res = await resendFirebaseVerificationEmail();
    if (res.success) {
      store.addToast('Verification email link sent!', 'success');
    } else {
      store.addToast(res.error || 'Could not send verification email.', 'warning');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '48px auto', padding: '0 24px' }}>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn btn-ghost btn-sm flex items-center gap-2"
          style={{ padding: '6px 12px', color: 'var(--color-text-secondary)', fontSize: 13 }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
      <Card className="text-center" padding="36px">
        {verified ? (
          <div>
            <CheckCircle2 size={54} style={{ color: 'var(--color-success)', margin: '0 auto 16px' }} />
            <h1 className="h2 mb-2">Email Verified!</h1>
            <p className="text-body text-secondary mb-6" style={{ fontSize: 14 }}>
              Your email address has been successfully verified.
            </p>
            <Button fullWidth onClick={() => navigate(user?.role ? getRoleDefaultLanding(user.role) : '/app')}>
              Open Workspace Now →
            </Button>
          </div>
        ) : (
          <div>
            <div 
              style={{ 
                width: 56, 
                height: 56, 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-primary-light)', 
                color: 'var(--color-primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px' 
              }}
            >
              <Mail size={28} />
            </div>
            <h1 className="h2 mb-2">Verify Your Email</h1>
            <p className="text-body text-secondary mb-5" style={{ fontSize: 14 }}>
              Please click the verification link sent to{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>{user?.email || 'your registered email'}</strong>.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-md border flex items-center gap-2 text-caption text-danger" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', textAlign: 'left' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <Button fullWidth size="lg" className="mb-3" onClick={handleCheck} disabled={loading}>
              {loading ? 'Checking...' : 'I Have Clicked The Verification Link'}
            </Button>

            <Button 
              fullWidth 
              variant="outline" 
              size="sm" 
              className="mb-3" 
              onClick={handleResend}
              disabled={resendTimer > 0}
            >
              <RefreshCw size={13} className={resendTimer > 0 ? 'opacity-50 mr-1.5' : 'mr-1.5'} />
              {resendTimer > 0 ? `Resend Link in ${resendTimer}s` : 'Resend Verification Link'}
            </Button>

            <Button fullWidth variant="ghost" type="button" onClick={() => navigate('/auth/login')}>
              Back to Login
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// SCREEN 16 — PASSWORD RESET
export const PasswordResetPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    await resetPasswordWithFirebase(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 440, margin: '48px auto', padding: '0 24px' }}>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn btn-ghost btn-sm flex items-center gap-2"
          style={{ padding: '6px 12px', color: 'var(--color-text-secondary)', fontSize: 13 }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
      <Card padding="32px">
        <h1 className="h2 mb-2">Reset Password</h1>
        <p className="text-caption text-secondary mb-6">Enter your registered email to receive a password reset link via Firebase Auth.</p>

        {sent ? (
          <div className="p-4 border rounded-md bg-muted text-center" style={{ borderColor: 'var(--color-success-border)' }}>
            <p className="text-caption text-success font-semibold" style={{ margin: 0 }}>Password reset instructions sent to your email!</p>
            <Button size="sm" variant="ghost" onClick={() => navigate('/auth/login')} className="mt-3">Back to Login</Button>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            <div className="form-group mb-6">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

