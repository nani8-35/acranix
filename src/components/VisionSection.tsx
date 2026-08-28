import { Globe2, ShieldCheck } from 'lucide-react';

export function VisionSection() {
  return (
    <section
      id="vision"
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-32 px-6 sm:px-12 bg-[#020202] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050505] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
          <Globe2 className="w-3 h-3 text-white" />
          <span>Our Guiding Principle</span>
        </div>

        {/* Big Vision Title */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight">
          A World Where Intelligence Works for Everyone.
        </h2>

        {/* Vision Narrative Block */}
        <div className="space-y-6 max-w-2xl mx-auto text-base sm:text-xl text-[#aaaaaa] font-light leading-relaxed">
          <p>
            We believe intelligence should not remain <span className="text-white italic">passive</span>.
          </p>

          {/* Tri-Staccato Core Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
            <div className="p-5 bg-[#050505] border border-[#222222] flex flex-col items-center relative">
              <span className="text-[9px] font-mono text-[#666666] tracking-widest uppercase mb-1">01 Perception</span>
              <span className="text-sm sm:text-base font-semibold text-[#cccccc]">Technology should understand.</span>
            </div>
            <div className="p-5 bg-[#050505] border border-[#222222] flex flex-col items-center relative">
              <span className="text-[9px] font-mono text-[#666666] tracking-widest uppercase mb-1">02 Cognition</span>
              <span className="text-sm sm:text-base font-semibold text-[#cccccc]">Technology should assist.</span>
            </div>
            <div className="p-5 bg-[#0f0f0f] border border-white flex flex-col items-center relative">
              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white" />
              <span className="text-[9px] font-mono text-white tracking-widest uppercase mb-1">03 Execution</span>
              <span className="text-sm sm:text-base font-bold text-white">Technology should act.</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#777777] pt-2 font-normal leading-relaxed">
            Our mission is to build intelligent technology that helps people and businesses accomplish more.
          </p>
        </div>

        {/* Manifesto Signoff */}
        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-center gap-6 text-[10px] font-mono text-[#666666] uppercase tracking-wider">
          <span className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            Human-Centric Sovereign Intelligence
          </span>
          <span className="hidden sm:inline text-[#333333]">•</span>
          <span>Zero-Slop Architectural Philosophy</span>
          <span className="hidden sm:inline text-[#333333]">•</span>
          <span>Global Impact Horizon</span>
        </div>
      </div>
    </section>
  );
}
