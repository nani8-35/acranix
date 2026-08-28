import { useState, type FormEvent } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Mail, Send, X, Terminal, Copy, Check, Loader2 } from 'lucide-react';
import { submitJoinForm } from '../lib/submissions';

interface JoinSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onOpenAdminModal?: () => void;
}

export function JoinSection({ isOpen, onClose, onOpen }: JoinSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discipline: 'AI Systems & Reasoning Architecture',
    portfolioOrGithub: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      // 1. Submit to backend API and local storage
      const res = await submitJoinForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        discipline: formData.discipline,
        portfolioOrGithub: formData.portfolioOrGithub.trim(),
        message: formData.message.trim(),
      });

      if (res.success) {
        // 2. Open pre-filled email client to dispatch to founder directly
        const subject = encodeURIComponent(`[ACRANIX Builder Application] ${formData.discipline} - ${formData.name}`);
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nDiscipline: ${formData.discipline}\nPortfolio/GitHub: ${formData.portfolioOrGithub}\n\nNote / What I want to build:\n${formData.message}\n\n---\nSent via ACRANIX Portal to akashyeginati@acranix.com`
        );
        
        try {
          window.location.href = `mailto:akashyeginati@acranix.com?subject=${subject}&body=${body}`;
        } catch {
          // Ignore if mail client blocked by browser
        }

        setSubmitted(true);
      } else {
        setSubmitError(res.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      setSubmitError('An unexpected error occurred. Please try again or reach out via email.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyFounderEmail = () => {
    navigator.clipboard.writeText('akashyeginati@acranix.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <>
      {/* Inline Section */}
      <section id="join" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto text-center">
        <div className="bg-[#050505] border border-[#222222] p-10 sm:p-16 lg:p-20 max-w-4xl mx-auto space-y-8 relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#020202] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Talent & Collective</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            The Future Needs Builders.
          </h2>

          <p className="text-sm sm:text-lg text-[#aaaaaa] max-w-xl mx-auto font-light leading-relaxed">
            We are looking for curious, ambitious people who want to work on meaningful problems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="join-acranix-cta-btn"
              type="button"
              onClick={onOpen}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2"
            >
              <span>Join ACRANIX</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              id="join-direct-email-btn"
              href="mailto:akashyeginati@acranix.com"
              className="w-full sm:w-auto px-7 py-4 bg-[#020202] text-white hover:text-white border border-[#333333] hover:border-white text-xs font-mono transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>akashyeginati@acranix.com</span>
            </a>
          </div>

          {/* Quick value bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#1a1a1a] text-[10px] font-mono uppercase tracking-widest text-[#666666]">
            <div>Autonomous Ownership</div>
            <div>Zero Bureaucracy</div>
            <div>Action-Oriented Architecture</div>
          </div>
        </div>
      </section>

      {/* Interactive Builder Application Modal */}
      {isOpen && (
        <div
          id="builder-application-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <div
            className="bg-[#050505] border border-[#222222] max-w-xl w-full p-8 sm:p-10 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />

            {/* Close Button */}
            <button
              id="close-join-modal-btn"
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-12 h-12 border border-white flex items-center justify-center mx-auto text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-bold text-white">Application Recorded & Dispatched</h3>
                  <p className="text-xs sm:text-sm text-[#aaaaaa] max-w-md mx-auto font-light leading-relaxed">
                    Your application has been stored in the ACRANIX intake system and forwarded to founder{' '}
                    <span className="font-mono text-white">akashyeginati@acranix.com</span>.
                  </p>
                </div>

                {/* Direct email fallback card */}
                <div className="bg-[#020202] border border-[#222222] p-4 text-left space-y-2.5 max-w-md mx-auto">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">
                    Direct Founder Contact Backup:
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-white">akashyeginati@acranix.com</span>
                    <button
                      type="button"
                      onClick={handleCopyFounderEmail}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#141414] border border-[#333333] hover:border-white text-white transition-colors flex items-center gap-1.5"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      onClose();
                    }}
                    className="px-6 py-2.5 bg-white text-black font-semibold text-[10px] uppercase tracking-widest hover:bg-[#e0e0e0] transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#888888]">
                    <Terminal className="w-3 h-3 text-white" />
                    <span>ACRANIX Builder Intake Protocol</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Join the Collective
                  </h3>
                  <p className="text-xs text-[#777777] font-light">
                    Direct communication line with founder Akash Yeginati (<span className="text-[#aaaaaa]">akashyeginati@acranix.com</span>).
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono">
                    {submitError}
                  </div>
                )}

                <div className="space-y-4 pt-2 text-xs">
                  <div>
                    <label className="block text-[#aaaaaa] font-mono text-[10px] uppercase tracking-wider mb-1.5">
                      Your Full Name <span className="text-white">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#020202] border border-[#222222] text-white placeholder-[#444444] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#aaaaaa] font-mono text-[10px] uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-white">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#020202] border border-[#222222] text-white placeholder-[#444444] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#aaaaaa] font-mono text-[10px] uppercase tracking-wider mb-1.5">
                      Discipline / Role Focus
                    </label>
                    <select
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#020202] border border-[#222222] text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="AI Systems & Reasoning Architecture">AI Systems & Reasoning Architecture</option>
                      <option value="Distributed Infrastructure & Systems">Distributed Infrastructure & Systems</option>
                      <option value="Human-Computer Interface Design">Human-Computer Interface Design</option>
                      <option value="Agentic Tooling & System Interfaces">Agentic Tooling & System Interfaces</option>
                      <option value="Founder Fellow / Generalist Builder">Founder Fellow / Generalist Builder</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#aaaaaa] font-mono text-[10px] uppercase tracking-wider mb-1.5">
                      GitHub / Portfolio / Research Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={formData.portfolioOrGithub}
                      onChange={(e) => setFormData({ ...formData, portfolioOrGithub: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#020202] border border-[#222222] text-white placeholder-[#444444] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#aaaaaa] font-mono text-[10px] uppercase tracking-wider mb-1.5">
                      What meaningful problem do you want to solve?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what you are excited about building..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#020202] border border-[#222222] text-white placeholder-[#444444] focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 border border-white bg-white text-black font-semibold text-[10px] uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Recording Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Application</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
