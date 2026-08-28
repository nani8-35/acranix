import { ArrowUp, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import { AcranixLogo } from './AcranixLogo';

interface FooterProps {
  onOpenJoinModal: () => void;
  onOpenAdminModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
}

export function Footer({
  onOpenJoinModal,
  onOpenAdminModal,
  onOpenAuthModal,
  onOpenProfileModal,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Vision', href: '#vision' },
    { label: 'What We Build', href: '#what-we-build' },
    { label: 'Our Journey', href: '#journey' },
    { label: 'Team', href: '#team' },
  ];

  return (
    <footer id="footer" className="relative border-t border-[#222222] bg-[#020202] pt-24 pb-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand Identity Column */}
          <div className="md:col-span-5 space-y-4">
            <AcranixLogo size="md" showSince={true} colorScheme="gold-accent" />

            <p className="text-xs font-mono tracking-widest text-[#888888] uppercase pt-2">
              Intelligence in Action.
            </p>

            <p className="text-xs text-[#777777] max-w-sm leading-relaxed font-light">
              Building the next generation of intelligent technology to help people and businesses understand, think, and take meaningful action.
            </p>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-[#666666] block mb-1 uppercase tracking-wider">Direct Communications:</span>
              <a
                href="mailto:akashyeginati@acranix.com"
                className="text-xs font-mono text-white hover:underline transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>akashyeginati@acranix.com</span>
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">Navigation</p>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[#888888] hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenJoinModal}
                  className="text-white hover:underline transition-colors text-left font-mono"
                >
                  Join Us
                </button>
              </li>
              <li>
                <a
                  href="mailto:akashyeginati@acranix.com"
                  className="text-[#888888] hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              {onOpenAdminModal && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdminModal}
                    className="text-[#aaaaaa] hover:text-white transition-colors text-left font-mono inline-flex items-center gap-1"
                  >
                    <span>Submissions Inbox</span>
                  </button>
                </li>
              )}
              {onOpenProfileModal && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenProfileModal}
                    className="text-[#cccccc] hover:text-white transition-colors text-left font-mono inline-flex items-center gap-1"
                  >
                    <span>Profile & Daily Actions</span>
                  </button>
                </li>
              )}
              {onOpenAuthModal && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="text-[#888888] hover:text-white transition-colors text-left font-mono inline-flex items-center gap-1"
                  >
                    <span>Operator Sign In</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Social and Return to Top Column */}
          <div className="md:col-span-3 space-y-4 md:text-right flex flex-col md:items-end">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">Connect</p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-[#050505] border border-[#222222] text-[#888888] hover:text-white hover:border-white transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-[#050505] border border-[#222222] text-[#888888] hover:text-white hover:border-white transition-all"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-[#050505] border border-[#222222] text-[#888888] hover:text-white hover:border-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <button
              id="footer-scroll-top-btn"
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#888888] hover:text-white transition-colors pt-4"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#666666] uppercase tracking-wider">
          <p>© {new Date().getFullYear()} ACRANIX. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Architecture</span>
            <span className="hover:text-white cursor-pointer">System Terms</span>
            <span className="hover:text-white cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
