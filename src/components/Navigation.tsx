import { useState, useEffect, type MouseEvent } from 'react';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  Inbox,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { ambientSound } from '../audio/ambientEngine';
import { AcranixLogo } from './AcranixLogo';
import { getStoredSubmissions } from '../lib/submissions';
import { getCurrentUser, signOutUser } from '../lib/auth';
import type { UserProfile } from '../types';

interface NavigationProps {
  onOpenJoinModal: () => void;
  onOpenAdminModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
  activeSection: string;
}

export function Navigation({
  onOpenJoinModal,
  onOpenAdminModal,
  onOpenAuthModal,
  onOpenProfileModal,
  activeSection,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const updateAuth = () => {
      setCurrentUser(getCurrentUser());
    };
    updateAuth();

    window.addEventListener('acranix_auth_changed', updateAuth);
    return () => window.removeEventListener('acranix_auth_changed', updateAuth);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const subs = getStoredSubmissions();
      // Count unread submissions
      const unread = subs.filter((s) => s.status !== 'archived').length;
      setSubmissionCount(unread);
    };
    updateCount();

    window.addEventListener('acranix_submission_updated', updateCount);
    return () => window.removeEventListener('acranix_submission_updated', updateCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPercent(scrolled);
      setIsScrolled(winScroll > 40);
      ambientSound.modulateWithScroll(scrolled / 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = async () => {
    const active = await ambientSound.toggle();
    setIsAudioActive(active);
    if (active) {
      ambientSound.playSubtlePulse();
    }
  };

  const handleLogout = () => {
    signOutUser();
    setCurrentUser(null);
  };

  const navLinks = [
    { label: 'Vision', href: '#vision', id: 'vision' },
    { label: 'Philosophy', href: '#philosophy', id: 'philosophy' },
    { label: 'What We Build', href: '#what-we-build', id: 'what-we-build' },
    { label: 'Journey', href: '#journey', id: 'journey' },
    { label: 'Team', href: '#team', id: 'team' },
  ];

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <>
      {/* Top micro progress line */}
      <div
        id="scroll-progress-line"
        className="fixed top-0 left-0 h-[1px] bg-white z-50 transition-all duration-150"
        style={{ width: `${scrollPercent}%` }}
      />

      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-[#020202]/90 backdrop-blur-xl border-b border-[#222222]'
            : 'py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a
            id="brand-logo-link"
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="group flex items-center focus:outline-none transition-transform hover:opacity-90 active:scale-98"
          >
            <AcranixLogo size="sm" showSince={true} colorScheme="gold-accent" />
          </a>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-nav-menu"
            className="hidden md:flex items-center gap-8 lg:gap-12 text-[11px] uppercase tracking-[0.3em] font-medium text-[#888888]"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-white font-semibold' : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Audio Ambiance Synthesizer Toggle */}
            <button
              id="ambient-sound-toggle-btn"
              type="button"
              onClick={handleToggleAudio}
              aria-label={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] border transition-all duration-300 ${
                isAudioActive
                  ? 'border-white bg-white text-black font-bold'
                  : 'border-[#333333] text-[#888888] hover:text-white hover:border-[#555555]'
              }`}
            >
              {isAudioActive ? (
                <>
                  <Volume2 className="w-3 h-3 text-black" />
                  <span>AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3" />
                  <span>AUDIO OFF</span>
                </>
              )}
            </button>

            {/* 1. ADMIN-ONLY: Admin Submissions Inbox Button with Notification Badge */}
            {currentUser && isAdmin && onOpenAdminModal && (
              <button
                id="nav-submissions-inbox-btn"
                type="button"
                onClick={onOpenAdminModal}
                title="Admin Inbox — Review Submissions"
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono uppercase tracking-wider border border-white/40 bg-[#0d0d0d] hover:border-white text-white transition-all duration-300"
              >
                <Inbox className="w-3.5 h-3.5 text-white" />
                <span>Inbox</span>
                {submissionCount > 0 && (
                  <span
                    id="admin-inbox-badge"
                    className="flex items-center gap-1 px-1.5 py-0.2 bg-white text-black font-bold text-[9px] font-mono ml-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-pulse" />
                    {submissionCount}
                  </span>
                )}
              </button>
            )}

            {/* 2. AUTHENTICATED USER (USER OR ADMIN): Profile & Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-user-profile-btn"
                  type="button"
                  onClick={onOpenProfileModal}
                  title="View Profile & Settings"
                  className="flex items-center gap-2 px-3 py-1.5 border border-[#333333] bg-[#0c0c0c] hover:border-white text-white transition-all"
                >
                  <div className="w-5 h-5 bg-white text-black font-bold text-[10px] flex items-center justify-center font-mono">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide text-white">
                    {currentUser.name || 'Akash'}
                  </span>
                </button>

                <button
                  id="nav-logout-btn"
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-[10px] font-mono uppercase tracking-wider border border-[#333333] hover:border-red-500 text-[#888888] hover:text-red-400 transition-all"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              /* 3. GUEST USER: Sign In + Join Us */
              <button
                id="nav-signin-btn"
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono uppercase tracking-wider border border-[#333333] hover:border-white text-[#cccccc] hover:text-white transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary Action Button: Join Us */}
            <button
              id="nav-join-button"
              type="button"
              onClick={onOpenJoinModal}
              className="border border-[#333333] px-4 sm:px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e0e0e0] hover:bg-white hover:text-black transition-all duration-300"
            >
              Join Us
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 border border-[#333333] text-[#888888] hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 bg-[#020202]/98 backdrop-blur-2xl md:hidden flex flex-col justify-between p-8 animate-in fade-in duration-300 border-b border-[#222222]"
        >
          <div className="flex items-center justify-between">
            <AcranixLogo size="sm" showSince={true} colorScheme="gold-accent" />
            <button
              id="close-mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 border border-[#333333] text-[#888888] hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-6 my-auto">
            {navLinks.map((link) => (
              <a
                key={link.id}
                id={`mobile-nav-${link.id}`}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-xl font-medium tracking-[0.25em] uppercase text-[#888888] hover:text-white transition-colors flex items-center justify-between border-b border-[#1a1a1a] pb-4"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#444444]" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-[#222222]">
            {currentUser ? (
              <>
                <button
                  id="mobile-user-profile-btn"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenProfileModal) onOpenProfileModal();
                  }}
                  className="w-full py-3 bg-[#111111] border border-white/50 text-white hover:border-white flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  <div className="w-5 h-5 bg-white text-black font-bold text-[10px] flex items-center justify-center font-mono">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span>Profile: {currentUser.name || 'Akash'}</span>
                </button>

                {isAdmin && onOpenAdminModal && (
                  <button
                    id="mobile-submissions-inbox-btn"
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminModal();
                    }}
                    className="w-full py-2.5 border border-white/40 bg-[#0c0c0c] text-white flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors"
                  >
                    <Inbox className="w-4 h-4" />
                    <span>Admin Inbox {submissionCount > 0 ? `(${submissionCount})` : ''}</span>
                  </button>
                )}

                <button
                  id="mobile-logout-btn"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 border border-[#333333] hover:border-red-500 text-[#888888] hover:text-red-400 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                id="mobile-signin-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                className="w-full py-2.5 border border-[#333333] text-[#cccccc] hover:text-white hover:border-white flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <button
              id="mobile-sound-toggle-btn"
              type="button"
              onClick={handleToggleAudio}
              className="w-full py-2.5 border border-[#333333] text-[#888888] flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest"
            >
              {isAudioActive ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAudioActive ? 'Ambient Sound: ON' : 'Ambient Sound: OFF'}</span>
            </button>

            <button
              id="mobile-join-cta-btn"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="w-full py-3.5 border border-[#333333] bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join ACRANIX</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
