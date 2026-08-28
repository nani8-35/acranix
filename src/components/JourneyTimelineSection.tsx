import { useState } from 'react';
import { Compass, CheckCircle2, Clock, Zap, Target, Sparkles } from 'lucide-react';
import { TimelineMilestone } from '../types';

export function JourneyTimelineSection() {
  const [selectedStage, setSelectedStage] = useState<string>('NOW');

  const milestones: TimelineMilestone[] = [
    {
      stage: 'NOW',
      title: 'Foundational Incubation & Problem Discovery',
      timeframe: 'Current Phase',
      description: 'Assembling our core engineering and research framework, interviewing leaders, dissecting workflow fragmentation, and establishing deterministic cognitive execution pipelines.',
      focus: [
        'Core architecture blueprinting',
        'Direct problem discovery with target early testers',
        'Algorithmic benchmarking of multi-modal context ingestion',
      ],
      status: 'current',
    },
    {
      stage: 'DISCOVER',
      title: 'Contextual Model Experiments & Prototypes',
      timeframe: 'Near Horizon',
      description: 'Field-testing autonomous agent harnesses in controlled sandboxes, validating safety envelopes, and refining semantic context translation engines.',
      focus: [
        'Safe agentic execution sandboxing',
        'Private developer & creator alpha cohorts',
        'Mathematical formalization of zero-hallucination execution',
      ],
      status: 'upcoming',
    },
    {
      stage: 'BUILD',
      title: 'Core Ecosystem Rollout & Developer APIs',
      timeframe: 'Next Horizon',
      description: 'Launching the initial suite of Personal and Work Intelligence tools to early adopters, opening secure execution endpoints for ecosystem partners.',
      focus: [
        'Release of ACRANIX Personal & Work Core',
        'Cross-platform contextual memory sync',
        'Enterprise safety audit compliance certification',
      ],
      status: 'upcoming',
    },
    {
      stage: 'EVOLVE',
      title: 'Autonomous Multi-Agent Enterprise Scaling',
      timeframe: 'Expansion Phase',
      description: 'Expanding into autonomous business intelligence and complex multi-agent collaborative networks operating across global digital infrastructure.',
      focus: [
        'Enterprise-scale multi-agent coordination',
        'Self-optimizing workflow topology',
        'Global edge-node low-latency mesh',
      ],
      status: 'vision',
    },
    {
      stage: 'THE FUTURE',
      title: 'Ubiquitous Ambient Intelligence in Action',
      timeframe: 'Long-term North Star',
      description: 'A seamless reality where technology natively understands, thinks, and acts on behalf of humanity—elevating human capability and freeing global creativity.',
      focus: [
        'Embodied cognitive agency',
        'Continuous ambient human-AI symbiosis',
        'Universal actionable intelligence for all',
      ],
      status: 'vision',
    },
  ];

  const currentMilestone = milestones.find((m) => m.stage === selectedStage) || milestones[0];

  return (
    <section id="journey" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050505] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
          <Compass className="w-3 h-3 text-white" />
          <span>Roadmap & Trajectory</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          The Journey Begins Here.
        </h2>
        <div className="text-[#777777] text-sm sm:text-base max-w-2xl mx-auto space-y-2 font-light">
          <p>
            ACRANIX is at the beginning of its journey.
          </p>
          <p className="text-[#aaaaaa]">
            We are exploring meaningful problems, experimenting with technology, building ambitious ideas, and working toward a future where intelligence creates real-world action.
          </p>
          <p className="text-white font-medium">
            This is only the beginning.
          </p>
        </div>
      </div>

      {/* Interactive Horizontal Timeline Tracker */}
      <div className="relative mb-16">
        {/* Timeline Connecting Axis Line */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-px bg-[#222222] -translate-y-1/2 z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 relative z-10">
          {milestones.map((m) => {
            const isSelected = selectedStage === m.stage;
            const isCurrent = m.status === 'current';
            return (
              <button
                key={m.stage}
                id={`timeline-btn-${m.stage.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedStage(m.stage)}
                className={`p-4 sm:p-5 text-left transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0f0f0f] border-white text-white'
                    : isCurrent
                    ? 'bg-[#050505] border-[#444444] text-[#cccccc] hover:border-white'
                    : 'bg-[#050505] border-[#222222] text-[#666666] hover:text-[#aaaaaa] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold tracking-widest uppercase">
                    {m.stage}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <div className="text-[10px] font-mono tracking-wider line-clamp-1 opacity-70">
                  {m.timeframe}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Interactive Deep-Dive View */}
      <div className="bg-[#050505] border border-[#222222] p-8 sm:p-12 relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#222222] pb-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 border border-[#333333] font-mono text-[10px] uppercase tracking-wider text-white">
                Phase: {currentMilestone.stage}
              </span>
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest">/ {currentMilestone.timeframe}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {currentMilestone.title}
            </h3>
          </div>

          {currentMilestone.status === 'current' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white bg-white text-black text-[10px] font-mono uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Actively in Development</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-sm sm:text-base text-[#aaaaaa] leading-relaxed font-light">
              {currentMilestone.description}
            </p>
          </div>

          <div className="lg:col-span-5 p-6 bg-[#020202] border border-[#1a1a1a] space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
              Core Technical Deliverables:
            </p>
            <div className="space-y-2">
              {currentMilestone.focus.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#cccccc]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
