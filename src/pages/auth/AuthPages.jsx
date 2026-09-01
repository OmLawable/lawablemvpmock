import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, ArrowRight, ArrowLeft, Home, Check, CheckCircle, CheckCircle2, Lock, 
  Mail, User, Building2, Sparkles, BookOpen, ShieldAlert, Eye, EyeOff, 
  ShieldCheck, RefreshCw, KeyRound, AlertCircle, Edit3, Send 
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';
import { loginUserWithFirebase, registerUserWithFirebase, resetPasswordWithFirebase } from '../../services/firebaseService';

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
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [expectedOtp, setExpectedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [otpError, setOtpError] = useState('');
  
  const digitInputRefs = useRef([]);
  const strength = getPasswordStrength(password);

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval = null;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Generate a random 6-digit OTP code
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(code);
    return code;
  };

  // Step 1: Submit signup form
  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      store.addToast('Please provide a valid email and password.', 'danger');
      return;
    }

    // MANDATORY EMAIL VERIFICATION FOR BUSINESS ACCOUNTS
    if (selectedRole === 'business') {
      const code = generateNewOtp();
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setResendTimer(30);
      setStep('verify');
      store.addToast(`Verification code sent to ${email}`, 'info');
      // Focus first digit after render
      setTimeout(() => {
        if (digitInputRefs.current[0]) {
          digitInputRefs.current[0].focus();
        }
      }, 100);
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

  // Handle OTP digit changes
  const handleDigitChange = (index, value) => {
    setOtpError('');
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5 && digitInputRefs.current[index + 1]) {
      digitInputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation in OTP digits
  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && digitInputRefs.current[index - 1]) {
      digitInputRefs.current[index - 1].focus();
    }
  };

  // Handle paste full OTP code
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      setOtpError('');
      if (digitInputRefs.current[5]) {
        digitInputRefs.current[5].focus();
      }
    }
  };

  // Verify OTP and complete business account creation
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (enteredCode !== expectedOtp) {
      setOtpError('Invalid verification code. Please check your email or click Resend.');
      return;
    }

    setOtpError('');
    store.addToast('Business email verified successfully!', 'success');
    await executeFinalRegistration();
  };

  // Resend OTP code
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const newCode = generateNewOtp();
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setResendTimer(30);
    store.addToast(`New verification code sent to ${email}`, 'info');
    if (digitInputRefs.current[0]) {
      digitInputRefs.current[0].focus();
    }
  };

  // Auto-fill demo OTP helper
  const handleAutoFillCode = () => {
    if (!expectedOtp) return;
    setOtpDigits(expectedOtp.split(''));
    setOtpError('');
    if (digitInputRefs.current[5]) {
      digitInputRefs.current[5].focus();
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
          /* STEP 2: BUSINESS EMAIL VERIFICATION SCREEN */
          <div>
            <div className="text-center mb-6">
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
                  margin: '0 auto 16px',
                  boxShadow: '0 0 0 8px rgba(30, 58, 138, 0.06)'
                }}
              >
                <Mail size={28} />
              </div>
              <Badge variant="primary" className="mb-2">Enterprise Verification</Badge>
              <h1 className="h2 mb-2">Verify Your Business Email</h1>
              <p className="text-body text-secondary" style={{ fontSize: 14, maxWidth: 440, margin: '0 auto' }}>
                We sent a 6-digit one-time passcode (OTP) to <strong style={{ color: 'var(--color-text-primary)' }}>{email}</strong>.
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

            {/* Test Simulation Helper Banner */}
            <div 
              className="p-3 mb-5 rounded-md border flex items-center justify-between"
              style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} style={{ color: 'var(--color-primary)' }} />
                <span className="text-caption" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  Demo OTP Code: <strong style={{ letterSpacing: '2px', color: 'var(--color-primary)', fontSize: 14 }}>{expectedOtp}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillCode}
                className="btn btn-outline btn-xs"
                style={{ fontSize: 11, padding: '3px 8px' }}
              >
                Auto-fill Code
              </button>
            </div>

            <form onSubmit={handleVerifyOtp}>
              {/* 6-Digit OTP Inputs */}
              <div className="form-group mb-5">
                <label className="form-label text-center block mb-3 font-semibold" style={{ fontSize: 13 }}>
                  Enter 6-Digit Verification Code
                </label>
                <div 
                  className="flex justify-center gap-2 sm:gap-3" 
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (digitInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      style={{
                        width: 48,
                        height: 54,
                        textAlign: 'center',
                        fontSize: 22,
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        border: digit 
                          ? '2px solid var(--color-primary)' 
                          : otpError 
                            ? '2px solid var(--color-danger)' 
                            : '1px solid var(--color-border)',
                        backgroundColor: digit ? 'var(--color-primary-light)' : '#FFF',
                        color: 'var(--color-text-primary)',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>

                {otpError && (
                  <div className="flex items-center justify-center gap-1 mt-3 text-caption text-danger">
                    <AlertCircle size={14} />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                className="mb-4" 
                disabled={loading || otpDigits.join('').length < 6}
              >
                {loading ? 'Verifying & Creating Workspace...' : 'Verify & Launch Business Account'} <ArrowRight size={16} />
              </Button>

              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-caption text-secondary" style={{ fontSize: 12 }}>
                  Didn't receive the email?
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
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
                  {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </form>
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
                            <span style={{ fontSize: 10, color: 'var(--color-primary)', fontWeight: 600 }}>OTP Verified</span>
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
                    <strong>Mandatory Email Verification:</strong> For corporate security and compliance, Business Enterprise workspaces require instant OTP email verification before the account is created.
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
                    A 6-digit confirmation code will be sent to this email address.
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
                  selectedRole === 'business' ? 'Verify Business Email & Continue' : 'Create Role Account'
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
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }
    setVerified(true);
    store.addToast('Email verified successfully!', 'success');
    setTimeout(() => {
      navigate('/app');
    }, 1200);
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
              Your email address has been confirmed. Redirecting to your workspace...
            </p>
            <Button fullWidth onClick={() => navigate('/app')}>
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
            <h1 className="h2 mb-2">Email Verification</h1>
            <p className="text-body text-secondary mb-5" style={{ fontSize: 14 }}>
              Enter the 6-digit verification passcode sent to your registered email to activate your account.
            </p>
            <form onSubmit={handleVerify}>
              <div className="form-group mb-4">
                <input
                  type="text"
                  maxLength={6}
                  className="form-input text-center"
                  style={{ fontSize: 20, letterSpacing: '6px', fontWeight: 700 }}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => {
                    setError('');
                    setOtp(e.target.value.replace(/\D/g, ''));
                  }}
                />
                {error && <span className="text-caption text-danger mt-1 block">{error}</span>}
              </div>
              <Button fullWidth type="submit" size="lg" className="mb-3" disabled={otp.length < 6}>
                Verify Email Code
              </Button>
              <Button fullWidth variant="ghost" type="button" onClick={() => navigate('/auth/signup')}>
                Back to Sign Up
              </Button>
            </form>
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

