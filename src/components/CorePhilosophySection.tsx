import { useState } from 'react';
import { Eye, Brain, Play, ArrowDown, ChevronRight, Check, Sparkles, Sliders, Shield, Terminal } from 'lucide-react';

export function CorePhilosophySection() {
  const [activeTab, setActiveTab] = useState<'understand' | 'think' | 'act'>('understand');

  const stages = [
    {
      id: 'understand' as const,
      number: '01',
      title: 'UNDERSTAND',
      subtitle: 'Understand people, problems, and context.',
      icon: Eye,
      overview: 'Intelligence begins with situational awareness. Rather than treating queries in isolation, ACRANIX forms a multi-dimensional graph of user goals, team environment, and systemic constraints.',
      capabilities: [
        'Multi-Modal Semantic Perception (Code, Speech, Documents, Spatial)',
        'Continuous Workflow & Intent Tracking',
        'Implicit Context Recognition (Grasping unsaid necessities)',
        'Historical Goal & Preference Mapping',
      ],
      interactiveConsole: {
        title: 'Contextual Graph Ingestion',
        input: 'User prompt: "Draft the Q3 roadmap sync and flag blocker bottlenecks."',
        derivedContext: [
          'Detected 14 active pull requests across 3 repositories',
          'Identified 2 unreviewed architectural dependencies',
          'Aligned with company Q3 OKR milestone deadline (Sept 15)',
        ],
        state: 'Context synthesized with 99.8% precision',
      },
    },
    {
      id: 'think' as const,
      number: '02',
      title: 'THINK',
      subtitle: 'Analyze. Reason. Decide.',
      icon: Brain,
      overview: 'True thinking goes beyond next-token probability. Our architecture evaluates counterfactual paths, performs self-critique, and simulates downstream implications before formulating steps.',
      capabilities: [
        'Recursive Chain-of-Thought & Branch Simulation',
        'Deterministic Boundary Verification & Safety Guardrails',
        'Multi-Agent Collaborative Hypothesis Testing',
        'Optimized Resource Allocation Strategy',
      ],
      interactiveConsole: {
        title: 'Cognitive Evaluation Matrix',
        input: 'Simulating 3 execution permutations against enterprise constraints...',
        derivedContext: [
          'Path A: Direct API Dispatch (High speed, 4% edge failure risk)',
          'Path B: Verified Multi-Stage Execution with Human In Loop (Selected: Optimal)',
          'Path C: Async Deferred Batch (Lower priority)',
        ],
        state: 'Optimal execution path verified & structured',
      },
    },
    {
      id: 'act' as const,
      number: '03',
      title: 'ACT',
      subtitle: 'Turn intelligence into meaningful action.',
      icon: Play,
      overview: 'This is the signature differentiator of ACRANIX. Passive advice does not build the future. We safely execute workflows, resolve tickets, coordinate tasks, and generate verifiable outcomes.',
      capabilities: [
        'Secure Agentic Tool Calling & System Integrations',
        'Deterministic Execution with Real-time Rollback',
        'Automated Verification & Closed-Loop Feedback',
        'Real-world Task Completion Across Digital Ecosystems',
      ],
      interactiveConsole: {
        title: 'Autonomous Execution Pipeline',
        input: 'Executing verified operational bundle...',
        derivedContext: [
          'Generated comprehensive roadmap summary & linked GitHub PR dependencies',
          'Dispatched meeting agenda to core contributors with flagged risk matrices',
          'Triggered notification to lead engineer with suggested resolution',
        ],
        state: 'Action complete: 3 meaningful outcomes generated in 1.4s',
      },
    },
  ];

  const currentStage = stages.find((s) => s.id === activeTab)!;

  return (
    <section id="philosophy" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050505] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
          <Sparkles className="w-3 h-3 text-white" />
          <span>The ACRANIX Triad</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          The Core Philosophy
        </h2>
        <p className="text-[#777777] text-sm sm:text-base font-light">
          Intelligence is not a static store of knowledge. It is a continuous, living transformation from raw observation to decisive outcome.
        </p>
      </div>

      {/* Tri-Pillar Interactive Morphing Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = activeTab === stage.id;
          return (
            <button
              key={stage.id}
              id={`philosophy-stage-btn-${stage.id}`}
              type="button"
              onClick={() => setActiveTab(stage.id)}
              className={`text-left p-6 sm:p-8 transition-all duration-300 relative border ${
                isSelected
                  ? 'bg-[#0f0f0f] border-white text-white'
                  : 'bg-[#050505] border-[#222222] text-[#888888] hover:border-[#444444]'
              }`}
            >
              {isSelected && <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />}
              
              {/* Top Row: Number & Icon */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#666666]">
                  Phase {stage.number}
                </span>
                <div className={`p-2 border transition-colors ${
                  isSelected ? 'border-white text-white' : 'border-[#222222] text-[#666666]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className={`text-xl font-bold tracking-tight transition-colors ${
                isSelected ? 'text-white' : 'text-[#aaaaaa]'
              }`}>
                {stage.title}
              </h3>
              <p className="text-xs text-[#777777] mt-2 line-clamp-2 font-light">
                {stage.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Stage Inspector */}
      <div className="bg-[#050505] border border-[#222222] p-8 sm:p-12 relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Context Description & Key Capabilities */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 border border-[#444444] text-white tracking-widest">
                Pillar {currentStage.number}
              </span>
              <span className="text-[#666666] text-xs font-mono">/ Live Architecture Drilldown</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {currentStage.title}
            </h3>

            <p className="text-sm sm:text-base text-[#aaaaaa] leading-relaxed font-light">
              {currentStage.overview}
            </p>

            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
                Core Architectural Capabilities:
              </p>
              <div className="space-y-2.5">
                {currentStage.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#aaaaaa]">
                    <div className="w-3.5 h-3.5 border border-[#444444] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Execution Terminal Sandbox */}
          <div className="lg:col-span-6">
            <div className="bg-[#020202] border border-[#222222] p-6 font-mono text-xs space-y-4 relative">
              {/* Terminal Window Chrome */}
              <div className="flex items-center justify-between border-b border-[#222222] pb-3 text-[#666666]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] uppercase tracking-wider text-white">{currentStage.interactiveConsole.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              {/* Sample Context Input */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-widest text-[#555555]">Input Payload:</span>
                <p className="p-3 bg-[#080808] border border-[#1a1a1a] text-[#cccccc] text-[11px] font-mono leading-relaxed">
                  {currentStage.interactiveConsole.input}
                </p>
              </div>

              {/* Derived Context Steps */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-[#555555]">Processing Stream:</span>
                <div className="space-y-1.5">
                  {currentStage.interactiveConsole.derivedContext.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[#888888] text-[11px]">
                      <span className="text-white font-bold">›</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Status Output */}
              <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[11px]">
                <span className="text-[#666666] text-[10px] uppercase tracking-widest">Verification:</span>
                <span className="text-white font-semibold flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {currentStage.interactiveConsole.state}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
