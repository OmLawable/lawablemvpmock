import React, { useState } from 'react';
import { Shield, ArrowRight, Check, CheckCircle, Lock, Mail, User, Building2, Sparkles, BookOpen } from 'lucide-react';
import { Card, Button, Badge } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

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

  const handleLogin = (e) => {
    e.preventDefault();
    store.addToast('Logged in successfully', 'success');
    const currentRole = store.getState().currentUser.role;
    navigate(getRoleDefaultLanding(currentRole));
  };

  return (
    <div style={{ maxWidth: 440, margin: '64px auto', padding: '0 24px' }}>
      <Card>
        <div className="text-center mb-6">
          <div style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, margin: '0 auto 12px' }}>
            L
          </div>
          <h1 className="h2 mb-1">Log in to Lawable</h1>
          <p className="text-caption text-secondary">Access conversational AI, advocate marketplace, and business compliance.</p>
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
              placeholder="aarav.sharma@example.com"
            />
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-1">
              <label className="form-label">Password</label>
              <a href="/auth/reset-password" onClick={(e) => { e.preventDefault(); navigate('/auth/reset-password'); }} className="text-caption font-semibold">Forgot?</a>
            </div>
            <input
              type="password"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth size="lg" className="mb-4">
            Sign In to Workspace
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

// SCREEN 13 — SIGNUP & ROLE SELECTION (PRD FR-1.1)
export const SignupPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('client');
  const strength = getPasswordStrength(password);

  const handleSignup = (e) => {
    e.preventDefault();
    store.setRole(selectedRole);
    store.addToast(`Account registered as ${selectedRole.toUpperCase()}`, 'success');
    navigate('/app');
  };

  return (
    <div style={{ maxWidth: 540, margin: '48px auto', padding: '0 24px' }}>
      <Card>
        <div className="text-center mb-6">
          <Badge variant="primary" className="mb-2">Get Started Free</Badge>
          <h1 className="h2 mb-1">Create Your Lawable Account</h1>
          <p className="text-caption text-secondary">Select your account role to personalize your workspace experience.</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group mb-5">
            <label className="form-label">Select Account Workspace Role</label>
            <div className="grid grid-2 gap-3 mt-2">
              {[
                { id: 'client', title: 'Client / Individual', icon: User },
                { id: 'student', title: 'Law Student', icon: BookOpen },
                { id: 'lawyer', title: 'Advocate / Lawyer', icon: Shield },
                { id: 'business', title: 'Business Enterprise', icon: Building2 }
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
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aarav@example.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password..." />
            {password && (
              <div className="mt-2 flex items-center justify-between text-caption">
                <span style={{ color: strength.color, fontWeight: 600 }}>Strength: {strength.label}</span>
              </div>
            )}
          </div>

          <Button type="submit" fullWidth size="lg" className="mb-4">
            Create Free Account <ArrowRight size={16} />
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
  <div style={{ maxWidth: 460, margin: '64px auto', padding: '0 24px' }}>
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
  const [sent, setSent] = useState(false);
  return (
    <div style={{ maxWidth: 440, margin: '64px auto', padding: '0 24px' }}>
      <Card padding="32px">
        <h1 className="h2 mb-2">Reset Password</h1>
        <p className="text-caption text-secondary mb-6">Enter your registered email to receive a password reset link.</p>

        {sent ? (
          <div className="p-4 border rounded-md bg-muted text-center" style={{ borderColor: 'var(--color-success-border)' }}>
            <p className="text-caption text-success font-semibold" style={{ margin: 0 }}>Password reset instructions sent to your email!</p>
            <Button size="sm" variant="ghost" onClick={() => navigate('/auth/login')} className="mt-3">Back to Login</Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="form-group mb-6">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required placeholder="aarav@example.com" />
            </div>
            <Button type="submit" fullWidth size="lg">Send Reset Link</Button>
          </form>
        )}
      </Card>
    </div>
  );
};
