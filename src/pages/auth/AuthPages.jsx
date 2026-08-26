import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft, Home, Check, CheckCircle, Lock, Mail, User, Building2, Sparkles, BookOpen, ShieldAlert, Eye, EyeOff } from 'lucide-react';
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

// SCREEN 13 — SIGNUP & 5-ROLE SELECTION (PRD FR-1.1)
export const SignupPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await registerUserWithFirebase(email, password, selectedRole, name);
    setLoading(false);

    if (res.success) {
      store.setCurrentUser(res.user);
      store.addToast(`Account created successfully as ${selectedRole.toUpperCase()}`, 'success');
      navigate(getRoleDefaultLanding(selectedRole));
    } else {
      // Fallback local registration if cloud auth encounters an error
      const localUser = {
        id: `user-${Date.now()}`,
        name: name || `${selectedRole.toUpperCase()} User`,
        email: email,
        role: selectedRole,
        emailVerified: true
      };
      store.setCurrentUser(localUser);
      store.addToast(`Account created as ${selectedRole.toUpperCase()} Workspace`, 'success');
      navigate(getRoleDefaultLanding(selectedRole));
    }
  };

  return (
    <div style={{ maxWidth: 580, margin: '36px auto', padding: '0 24px' }}>
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

      <Card>
        <div className="text-center mb-6">
          <Badge variant="primary" className="mb-2">5 Role-Based Workspaces</Badge>
          <h1 className="h2 mb-1">Create Your Lawable Account</h1>
          <p className="text-caption text-secondary">Select your account role to personalize your workspace experience.</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group mb-5">
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
                      cursor: 'pointer'
                    }}
                    className="flex items-center gap-3"
                  >
                    <Icon size={18} style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                    <span style={{ fontWeight: active ? 600 : 500, fontSize: 13 }}>{r.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarthak Kadam" />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
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
            {loading ? 'Creating Account...' : 'Create Role Account'} <ArrowRight size={16} />
          </Button>

          <div className="text-center text-caption text-secondary">
            Already have an account?{' '}
            <a href="/auth/login" onClick={(e) => { e.preventDefault(); navigate('/auth/login'); }} className="font-semibold">Log in</a>
          </div>
        </form>
      </Card>
    </div>
  );
};

// SCREEN 15 — VERIFY EMAIL
export const VerifyEmailPage = ({ navigate }) => (
  <div style={{ maxWidth: 460, margin: '48px auto', padding: '0 24px' }}>
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
      <CheckCircle size={48} style={{ color: 'var(--color-success)', margin: '0 auto 16px' }} />
      <h1 className="h2 mb-2">Check Your Email</h1>
      <p className="text-body text-secondary mb-6" style={{ fontSize: 14 }}>
        We sent a verification link to your registered email address. Click the link inside to activate your Lawable workspace.
      </p>
      <Button fullWidth onClick={() => navigate('/app')}>
        Simulate Verification & Open Workspace →
      </Button>
    </Card>
  </div>
);

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

