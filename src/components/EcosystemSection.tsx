import { useState } from 'react';
import { Compass, Sparkles, Brain, Cpu, Workflow, Orbit, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { EcosystemPillar } from '../types';

export function EcosystemSection() {
  const [selectedPillar, setSelectedPillar] = useState<EcosystemPillar | null>(null);

  const pillars: EcosystemPillar[] = [
    {
      id: 'personal-intelligence',
      title: 'Personal Intelligence',
      summary: 'Intelligent technology designed to help individuals manage information, make decisions, and take action.',
      focus: 'Autonomous daily assistants, proactive attention management, unified memory fabrics, and contextual life copilots.',
      keyInnovations: [
        'Multi-device persistent memory graphs',
        'Frictionless intention-to-execution translation',
        'Privacy-preserving local-first inference nodes',
        'Natural multimodal voice & spatial understanding',
      ],
      status: 'Active Research',
    },
    {
      id: 'intelligent-work',
      title: 'Intelligent Work',
      summary: 'Technology designed to help people accomplish more with less repetitive effort.',
      focus: 'Cognitive accelerators for engineers, designers, researchers, and operators to amplify output and eliminate boilerplate.',
      keyInnovations: [
        'Deep contextual code & schema refactoring engines',
        'Automated synthesis of complex multi-source research',
        'Cross-discipline design system orchestration',
        'Proactive bottleneck detection across team workflows',
      ],
      status: 'Architectural Prototyping',
    },
    {
      id: 'business-intelligence',
      title: 'Business Intelligence',
      summary: 'Intelligent systems that simplify complex operations and workflows.',
      focus: 'Scalable autonomous multi-agent networks that execute high-assurance operations across enterprise systems.',
      keyInnovations: [
        'Deterministic transactional execution pipelines',
        'Self-healing automated supply & operational logic',
        'Continuous regulatory compliance auditing',
        'Enterprise data siloing with mathematical privacy guarantees',
      ],
      status: 'Core Exploration',
    },
    {
      id: 'future-technology',
      title: 'Future Technology',
      summary: 'Exploring the next generation of AI, automation, and intelligent systems.',
      focus: 'Frontier research in embodied agency, causal reasoning models, neuro-symbolic hybrids, and verifiable intelligence.',
      keyInnovations: [
        'Causal reasoning beyond probabilistic prediction',
        'Neuro-symbolic verification for zero-hallucination execution',
        'Self-improving collaborative agent architectures',
        'Low-energy distributed neuromorphic edge computing',
      ],
      status: 'Long-range R&D',
    },
  ];

  return (
    <section id="ecosystem" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050505] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
          <Orbit className="w-3 h-3 text-white" />
          <span>Research & Exploration</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          Building What Comes Next.
        </h2>
        <p className="text-[#777777] text-sm sm:text-base font-light">
          We do not rush to release hype-driven gimmicks. We are methodically building the foundational pillars of actionable intelligence across four core domains.
        </p>
      </div>

      {/* 4 Futuristic Ecosystem Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.id}
            id={`ecosystem-card-${pillar.id}`}
            onClick={() => setSelectedPillar(pillar)}
            className="group bg-[#050505] border border-[#222222] hover:border-white p-8 sm:p-10 transition-all duration-300 cursor-pointer flex flex-col justify-between relative"
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#333333] group-hover:bg-white transition-colors" />

            {/* Top Row: Index & Status */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono text-[10px] text-[#666666] tracking-widest uppercase">
                Area 0{index + 1}
              </span>
              <span className="px-2.5 py-0.5 border border-[#333333] text-white font-mono text-[10px] uppercase tracking-wider">
                {pillar.status}
              </span>
            </div>

            {/* Core Body */}
            <div className="space-y-4 my-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-between">
                <span>{pillar.title}</span>
                <ArrowUpRight className="w-4 h-4 text-[#666666] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>
              <p className="text-sm text-[#888888] font-light leading-relaxed">
                {pillar.summary}
              </p>
            </div>

            {/* Bottom Innovation Highlights */}
            <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex items-center justify-between text-xs font-mono text-[#666666]">
              <span>{pillar.keyInnovations.length} Key Innovations</span>
              <span className="text-white group-hover:underline text-[11px] uppercase tracking-wider">Inspect Blueprint →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Research Blueprint Modal */}
      {selectedPillar && (
        <div
          id="pillar-detail-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedPillar(null)}
        >
          <div
            className="bg-[#050505] border border-[#222222] max-w-2xl w-full p-8 sm:p-10 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
            
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 border border-[#444444] text-white font-mono text-[10px] uppercase tracking-wider">
                  {selectedPillar.status}
                </span>
                <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest">Blueprint Specs</span>
              </div>
              <button
                id="close-pillar-modal-btn"
                type="button"
                onClick={() => setSelectedPillar(null)}
                className="p-1.5 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {selectedPillar.title}
              </h3>
              <p className="text-[#aaaaaa] text-sm mt-2 font-light">
                {selectedPillar.summary}
              </p>
            </div>

            <div className="p-4 bg-[#020202] border border-[#1a1a1a] space-y-1.5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">Core Focus Vector:</p>
              <p className="text-xs text-[#cccccc] font-light leading-relaxed">{selectedPillar.focus}</p>
            </div>

            <div className="space-y-2.5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">Active Research Vectors:</p>
              <div className="space-y-2">
                {selectedPillar.keyInnovations.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#aaaaaa]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-[#666666]">
              <span className="font-mono text-[11px]">akashyeginati@acranix.com</span>
              <button
                type="button"
                onClick={() => setSelectedPillar(null)}
                className="px-6 py-2 border border-white bg-white text-black font-semibold text-[10px] uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
