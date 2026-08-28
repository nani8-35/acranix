import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  RotateCw,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  signInApi,
  signUpApi,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordApi,
} from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

type AuthMode = 'signin' | 'signup' | 'forgot_email' | 'forgot_otp' | 'forgot_reset' | 'reset_success';

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP flow states
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Status states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'signup') setMode('signup');
      else if (initialMode === 'forgot') setMode('forgot_email');
      else setMode('signin');

      setError(null);
      setSuccessMessage(null);
      setDevOtpHint(null);
    }
  }, [isOpen, initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // ----------------- HANDLERS -----------------

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const res = await signInApi({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Sign in failed. Please check your credentials.');
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your Profile Name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your Email Address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await signUpApi({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Account creation failed. Please try again.');
    }
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    const res = await sendPasswordResetOtp(email.trim());
    setLoading(false);

    if (res.success) {
      setMode('forgot_otp');
      setResendCooldown(60);
      if (res.devHintOtp) {
        setDevOtpHint(res.devHintOtp);
      }
      setSuccessMessage(res.message || 'We sent a 6-digit verification code to your email.');
    } else {
      setError(res.error || 'Failed to dispatch verification code.');
      if (res.retryAfter) {
        setResendCooldown(res.retryAfter);
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email.trim()) return;
    setError(null);
    setLoading(true);
    const res = await sendPasswordResetOtp(email.trim());
    setLoading(false);

    if (res.success) {
      setResendCooldown(60);
      if (res.devHintOtp) {
        setDevOtpHint(res.devHintOtp);
      }
      setSuccessMessage('A fresh 6-digit verification code has been sent.');
    } else {
      setError(res.error || 'Failed to resend verification code.');
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyPasswordResetOtp(email.trim(), otp.trim());
    setLoading(false);

    if (res.success && res.resetToken) {
      setResetToken(res.resetToken);
      setMode('forgot_reset');
      setError(null);
      setSuccessMessage(null);
    } else {
      setError(res.error || 'Invalid 6-digit OTP code. Please try again.');
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    setLoading(true);
    const res = await resetPasswordApi({
      email: email.trim(),
      resetToken,
      newPassword: password,
    });
    setLoading(false);

    if (res.success) {
      setMode('reset_success');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
      setResetToken('');
      setDevOtpHint(null);
    } else {
      setError(res.error || 'Failed to reset password.');
    }
  };

  const handleQuickAccount = (targetEmail: string, targetPass: string) => {
    setEmail(targetEmail);
    setPassword(targetPass);
    setError(null);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#080808] border border-[#262626] max-w-md w-full relative shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Geometric Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#121212] border border-[#333333] text-white">
              {mode === 'signup' ? (
                <Sparkles className="w-4 h-4 text-white" />
              ) : mode.startsWith('forgot') || mode === 'reset_success' ? (
                <KeyRound className="w-4 h-4 text-white" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                {mode === 'signup' && 'Create Account'}
                {mode === 'signin' && 'Sign In'}
                {mode === 'forgot_email' && 'Password Recovery'}
                {mode === 'forgot_otp' && 'Verify 6-Digit OTP'}
                {mode === 'forgot_reset' && 'Create New Password'}
                {mode === 'reset_success' && 'Password Reset'}
              </h3>
              <p className="text-[11px] font-mono text-[#888888]">
                {mode === 'signup' && 'Register your ACRANIX builder credentials'}
                {mode === 'signin' && 'Access your ACRANIX intelligence session'}
                {mode === 'forgot_email' && 'Step 1 of 3 — Enter your registered email'}
                {mode === 'forgot_otp' && 'Step 2 of 3 — Enter the 6-digit code sent to your email'}
                {mode === 'forgot_reset' && 'Step 3 of 3 — Secure your new password'}
                {mode === 'reset_success' && 'Your password has been updated successfully'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1.5 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Mode Tabs (for Sign In & Sign Up only) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="grid grid-cols-2 border-b border-[#222222] bg-[#030303] text-xs font-mono">
            <button
              type="button"
              id="auth-tab-signin"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-3 text-center uppercase tracking-wider transition-colors border-b-2 ${
                mode === 'signin'
                  ? 'border-white text-white font-bold bg-[#0d0d0d]'
                  : 'border-transparent text-[#777777] hover:text-[#cccccc]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-3 text-center uppercase tracking-wider transition-colors border-b-2 ${
                mode === 'signup'
                  ? 'border-white text-white font-bold bg-[#0d0d0d]'
                  : 'border-transparent text-[#777777] hover:text-[#cccccc]'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono leading-relaxed">
              {error}
            </div>
          )}

          {/* Success / Status Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Development / Preview OTP Banner for effortless verification */}
          {devOtpHint && (mode === 'forgot_otp' || mode === 'forgot_email') && (
            <div className="p-3 bg-[#111111] border border-white/40 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#888888] uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3 text-white" /> Generated 6-Digit OTP:
                </span>
                <span className="text-sm font-bold text-white tracking-widest bg-white text-black px-2 py-0.5 font-mono">
                  {devOtpHint}
                </span>
              </div>
              <p className="text-[10px] text-[#777777]">
                Dispatched to <span className="text-white">{email}</span> (Valid for 10 mins).
              </p>
            </div>
          )}

          {/* ----------------- 1. SIGN IN FORM ----------------- */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signin-email-input"
                    type="email"
                    required
                    placeholder="akash@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888]">
                    Password
                  </label>
                  <button
                    type="button"
                    id="signin-forgot-password-link"
                    onClick={() => {
                      setMode('forgot_email');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[10px] font-mono text-[#aaaaaa] hover:text-white transition-colors underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="signin-submit-btn"
                disabled={loading}
                className="w-full py-3.5 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-3 text-center">
                <p className="text-xs text-[#888888] font-mono">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-white font-bold hover:underline ml-1"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Demo Account Selector */}
              <div className="pt-4 border-t border-[#1a1a1a]">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666] mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-white" /> Pre-Configured Accounts for Testing:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAccount('akashyeginati@acranix.com', 'logiN@12')}
                    className="p-2.5 text-left bg-[#0c0c0c] border border-[#222222] hover:border-white transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white">Akash Yeginati</p>
                      <span className="px-1.5 py-0.2 bg-white text-black font-mono text-[9px] font-bold">
                        ADMIN
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-[#888888]">akashyeginati@acranix.com</p>
                    <p className="text-[9px] font-mono text-[#555555] mt-1">Pass: logiN@12</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAccount('akash@gmail.com', 'Password123!')}
                    className="p-2.5 text-left bg-[#0c0c0c] border border-[#222222] hover:border-white transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white">Akash</p>
                      <span className="px-1.5 py-0.2 bg-[#222222] text-[#aaaaaa] font-mono text-[9px]">
                        USER
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-[#888888]">akash@gmail.com</p>
                    <p className="text-[9px] font-mono text-[#555555] mt-1">Pass: Password123!</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ----------------- 2. SIGN UP FORM ----------------- */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  Profile Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    placeholder="Akash"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    placeholder="akash@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                disabled={loading}
                className="w-full py-3.5 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-3 text-center">
                <p className="text-xs text-[#888888] font-mono">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-white font-bold hover:underline ml-1"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ----------------- 3. FORGOT PASSWORD: STEP 1 (ENTER EMAIL) ----------------- */}
          {mode === 'forgot_email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1 text-left">
                <p className="text-xs text-[#cccccc] font-light leading-relaxed">
                  Enter your registered email address. We will dispatch a secure 6-digit OTP code to verify your identity.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    placeholder="akash@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-sans transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="forgot-send-otp-btn"
                disabled={loading}
                className="w-full py-3.5 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-mono text-[#888888] hover:text-white transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ----------------- 4. FORGOT PASSWORD: STEP 2 (VERIFY 6-DIGIT OTP) ----------------- */}
          {mode === 'forgot_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1 text-left">
                <p className="text-xs text-[#cccccc] font-light leading-relaxed">
                  We sent a 6-digit verification code to your email{' '}
                  <span className="font-mono text-white font-semibold">({email})</span>.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  id="forgot-otp-input"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 849201"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center py-3 bg-[#020202] border border-[#262626] text-lg text-white font-mono tracking-[0.4em] placeholder-[#444444] focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-[#666666]">Didn't receive code?</span>
                <button
                  type="button"
                  id="resend-otp-btn"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-white hover:underline disabled:text-[#555555] disabled:no-underline flex items-center gap-1"
                >
                  <RotateCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>{resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}</span>
                </button>
              </div>

              <button
                type="submit"
                id="forgot-verify-otp-btn"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_email');
                    setError(null);
                  }}
                  className="text-xs font-mono text-[#888888] hover:text-white transition-colors"
                >
                  ← Change Email Address
                </button>
              </div>
            </form>
          )}

          {/* ----------------- 5. FORGOT PASSWORD: STEP 3 (CREATE NEW PASSWORD) ----------------- */}
          {mode === 'forgot_reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1 text-left">
                <p className="text-xs text-[#cccccc] font-light leading-relaxed">
                  Identity verified. Enter your new password below.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-new-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="reset-password-submit-btn"
                disabled={loading}
                className="w-full py-3.5 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ----------------- 6. RESET PASSWORD SUCCESS ----------------- */}
          {mode === 'reset_success' && (
            <div className="py-6 text-center space-y-5">
              <div className="w-12 h-12 border border-white flex items-center justify-center mx-auto text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">Password Updated</h4>
                <p className="text-xs text-[#aaaaaa] font-mono leading-relaxed max-w-xs mx-auto">
                  Your password has been reset successfully. You can now sign in using your new credentials.
                </p>
              </div>

              <button
                type="button"
                id="redirect-signin-btn"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="w-full py-3.5 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors"
              >
                Proceed to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
