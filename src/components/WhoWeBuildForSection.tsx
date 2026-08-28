import { useState } from 'react';
import { User, Briefcase, Building2, ArrowRight, CheckCircle, Sparkles, SlidersHorizontal, Cpu, Layers } from 'lucide-react';
import { AudienceWorld } from '../types';

export function WhoWeBuildForSection() {
  const [activeWorld, setActiveWorld] = useState<'people' | 'professionals' | 'businesses'>('people');

  const worlds: AudienceWorld[] = [
    {
      id: 'people',
      tagline: 'Intelligence for Everyday Life',
      title: 'For People',
      description: 'Technology designed to help individuals effortlessly organize chaotic inputs, distill complex knowledge, schedule personal priorities, and get things done without friction.',
      badge: 'Individual Agency',
      features: [
        'Personal context graph preserving priorities across apps',
        'Automatic synthesis of fragmented notes, emails & messages',
        'Adaptive daily planning that dynamically absorbs life changes',
        'Proactive task execution for bookings, reminders & research',
      ],
      sampleScenario: {
        input: '"I need to prepare for my medical checkup and reschedule my afternoon conflicts."',
        processing: 'Cross-analyzing calendar entries, drafting diplomatic reschedule notes with suggested alternate slots, and consolidating medical history records.',
        action: 'Sent 2 reschedule requests, updated calendar, and prepared a 1-page health summary on user device.',
      },
    },
    {
      id: 'professionals',
      tagline: 'Intelligence for Meaningful Work',
      title: 'For Professionals',
      description: 'Technology that strips away administrative overhead, boilerplate generation, and repetitive digital chores so thinkers, creators, and builders can operate in peak flow state.',
      badge: 'Deep Flow Acceleration',
      features: [
        'Automated document, code & architectural analysis',
        'Elimination of repetitive ticketing and context switching',
        'High-bandwidth reasoning copilot for rapid decision trees',
        'Cross-discipline translation (Design ↔ Code ↔ Strategy)',
      ],
      sampleScenario: {
        input: '"Audit this new product feature specification against existing API limitations."',
        processing: 'Reviewing 47 schema definitions, identifying 3 breaking payload contracts, and constructing revised endpoint designs with test suites.',
        action: 'Delivered an architectural diff report with automated migration script ready for merge.',
      },
    },
    {
      id: 'businesses',
      tagline: 'Intelligence at Scale',
      title: 'For Businesses',
      description: 'Intelligent systems that connect siloed enterprise departments, autonomously execute complex cross-stack workflows, and deliver resilient, high-impact business outcomes.',
      badge: 'Enterprise Orchestration',
      features: [
        'End-to-end multi-agent orchestration for supply and operations',
        'Autonomous customer resolution with strict compliance boundaries',
        'Continuous systemic optimization and bottleneck eradication',
        'Enterprise-grade security, air-gapped models & deterministic audit trails',
      ],
      sampleScenario: {
        input: '"Process international compliance filings for 12 incoming vendor agreements."',
        processing: 'Extracting data vectors, verifying anti-money laundering certifications against global registries, checking tax jurisdiction treaties.',
        action: 'Completed 12 verified filings, flagged 1 jurisdiction anomaly with risk rating, and archived compliance logs.',
      },
    },
  ];

  const current = worlds.find((w) => w.id === activeWorld)!;

  return (
    <section id="what-we-build" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050505] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
          <Layers className="w-3 h-3 text-white" />
          <span>Three Spheres of Impact</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          Who We Build For
        </h2>
        <p className="text-[#777777] text-sm sm:text-base font-light">
          Intelligence must not remain a laboratory curiosity. We build tailored paradigms for everyday life, creative professions, and global operations.
        </p>
      </div>

      {/* World Selection Tabs (Monochrome Pill Strip) */}
      <div className="flex items-center justify-center mb-12">
        <div className="inline-flex p-1 bg-[#050505] border border-[#222222] gap-1">
          {worlds.map((w) => {
            const isSelected = activeWorld === w.id;
            const Icon = w.id === 'people' ? User : w.id === 'professionals' ? Briefcase : Building2;
            return (
              <button
                key={w.id}
                id={`world-tab-${w.id}`}
                type="button"
                onClick={() => setActiveWorld(w.id)}
                className={`flex items-center gap-2 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 ${
                  isSelected
                    ? 'bg-white text-black'
                    : 'text-[#888888] hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{w.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spatial Storytelling World Display Card */}
      <div className="bg-[#050505] border border-[#222222] p-8 sm:p-12 lg:p-14 relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Narrative & Key Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[#333333] text-white text-[10px] font-mono uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-white" />
              <span>{current.badge}</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {current.tagline}
            </h3>

            <p className="text-sm sm:text-base text-[#aaaaaa] leading-relaxed font-light">
              {current.description}
            </p>

            <div className="space-y-3 pt-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
                Core Capabilities for {current.title}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#080808] border border-[#1a1a1a] flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-[#888888] leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Workflow Execution Scenario */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 bg-[#020202] border border-[#222222] space-y-5 font-mono text-xs relative">
              {/* Scenario Header */}
              <div className="flex items-center justify-between border-b border-[#222222] pb-3 text-[#666666]">
                <span className="uppercase tracking-wider text-[10px] text-white font-semibold">
                  Interactive Scenario Preview
                </span>
                <span className="text-white font-semibold flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live Trace
                </span>
              </div>

              {/* Step 1: Human Need Input */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-[#666666] uppercase tracking-widest">
                  1. Human Need (Input)
                </span>
                <div className="p-3 bg-[#080808] border border-[#1a1a1a] text-[#cccccc] text-xs font-mono">
                  {current.sampleScenario.input}
                </div>
              </div>

              {/* Step 2: Contextual Synthesis */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-[#666666] uppercase tracking-widest">
                  2. Cognitive Synthesis (Thinking)
                </span>
                <div className="p-3 bg-[#080808] border border-[#222222] text-[#888888] text-xs font-mono">
                  {current.sampleScenario.processing}
                </div>
              </div>

              {/* Step 3: Verified Real-World Action */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-white uppercase tracking-widest font-bold">
                  3. Meaningful Action Taken (Outcome)
                </span>
                <div className="p-3 bg-[#0f0f0f] border border-white text-white text-xs font-mono">
                  {current.sampleScenario.action}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
