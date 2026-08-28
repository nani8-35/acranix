import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { AcranixLogoIcon, AcranixTreeIcon } from './AcranixLogo';

interface HeroSectionProps {
  onBeginJourney: () => void;
  onOpenJoinModal: () => void;
}

export function HeroSection({ onBeginJourney, onOpenJoinModal }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 pt-32 pb-16 overflow-hidden select-none"
    >
      {/* Side Vertical Step Meter Indicator */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-3 h-32 justify-center pointer-events-none z-20">
        <div className="w-1 h-8 bg-white" />
        <div className="w-[1px] h-8 bg-[#333333]" />
        <div className="w-[1px] h-8 bg-[#333333]" />
        <div className="w-[1px] h-8 bg-[#333333]" />
      </div>

      {/* Subtle Right Watermark Typography */}
      <div className="hidden xl:flex absolute right-[-80px] top-1/2 -translate-y-1/2 flex-col items-center pointer-events-none opacity-20 z-0">
        <div
          className="rotate-90 text-[130px] font-black tracking-widest text-transparent select-none"
          style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.4)' }}
        >
          FUTURE
        </div>
      </div>

      {/* Top Overline */}
      <div
        className={`w-full flex justify-center transition-all duration-1000 delay-150 transform ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="inline-block overflow-hidden">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#666666] font-mono">
            Intelligent Technology
          </p>
        </div>
      </div>

      {/* Central Hero Monolith */}
      <div className="flex flex-col items-center text-center max-w-5xl mx-auto my-auto relative z-10">
        {/* Emblem Arc Mark */}
        <div
          className={`mb-6 transition-all duration-1000 delay-200 transform ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="p-3 sm:p-4 rounded-full bg-[#050505]/80 border border-[#222222] shadow-[0_0_50px_rgba(255,255,255,0.03)] hover:border-white/40 transition-colors">
            <AcranixLogoIcon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" color="#F5F2EB" />
          </div>
        </div>

        <h1
          id="hero-main-title"
          className={`text-6xl sm:text-8xl md:text-9xl lg:text-[105px] font-black tracking-[0.18em] leading-[0.9] text-[#F5F2EB] uppercase transition-all duration-1000 delay-300 transform select-none ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          ACRANIX
        </h1>

        {/* Company Heritage Badge from Logo */}
        <div
          className={`mt-4 sm:mt-5 flex items-center justify-center gap-2 font-mono text-xs sm:text-sm md:text-base uppercase tracking-[0.35em] transition-all duration-1000 delay-400 transform select-none ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ color: '#D4B26F' }}
        >
          <span className="font-semibold">SINCE 2026</span>
          <AcranixTreeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4B26F]" />
        </div>

        <div className="h-px w-24 bg-[#333333] mx-auto my-8" />

        <p
          id="hero-tagline"
          className={`text-lg sm:text-2xl font-light tracking-[0.1em] text-[#aaaaaa] max-w-lg mx-auto transition-all duration-1000 delay-500 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Intelligence in Action.
        </p>

        <p
          className={`mt-6 max-w-xl text-xs sm:text-sm text-[#777777] font-normal leading-relaxed transition-all duration-1000 delay-700 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Building the next generation of technology designed to help people and businesses
          <span className="text-[#cccccc]"> understand</span>,
          <span className="text-[#cccccc]"> think</span>, and
          <span className="text-white font-medium"> take meaningful action</span>.
        </p>

        {/* Action button cluster */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 delay-900 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            id="hero-explore-journey-btn"
            type="button"
            onClick={onBeginJourney}
            className="w-full sm:w-auto px-8 py-3.5 border border-white bg-white text-black text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-transparent hover:text-white flex items-center justify-center gap-2"
          >
            <span>Explore the System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="hero-join-manifesto-btn"
            type="button"
            onClick={onOpenJoinModal}
            className="w-full sm:w-auto px-8 py-3.5 border border-[#333333] text-[#aaaaaa] hover:text-white hover:border-[#666666] text-[10px] uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-md"
          >
            The Builder Manifest
          </button>
        </div>
      </div>

      {/* Bottom Architectural Telemetry & Status Bar */}
      <div
        className={`w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8 border-t border-[#1a1a1a] transition-all duration-1000 delay-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Left Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white font-mono">
              Live Connection Established
            </span>
          </div>
          <div className="max-w-[320px]">
            <p className="text-[12px] leading-relaxed text-[#777777] font-light">
              The future is not just intelligent. It takes action. We build the systems that help people and businesses understand, think, and execute at scale.
            </p>
          </div>
        </div>

        {/* Right Architectural Phase Block */}
        <div className="relative h-[130px] w-full sm:w-[280px] border-l border-t border-[#222222] p-5 bg-[#050505]/60 backdrop-blur-sm">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[10px] tracking-widest uppercase text-[#888888]">01 Understand</span>
              <div className="w-12 h-px bg-[#444444]" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-widest uppercase text-white font-semibold">02 Think</span>
              <div className="w-16 h-px bg-white" />
            </div>
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[10px] tracking-widest uppercase text-[#888888]">03 Act</span>
              <div className="w-12 h-px bg-[#444444]" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-[#555555] tracking-tighter font-mono flex justify-between items-center">
            <span>SYS: ONLINE</span>
            <span>LAT: 37.7749 | LONG: -122.4194</span>
          </div>
        </div>
      </div>
    </section>
  );
}
