import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  Compass,
  Activity,
  Workflow,
  GitBranch,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function CinematicScrollJourney() {
  const [activeStage, setActiveStage] = useState('stage-dilemma');
  const [interactiveClarity, setInteractiveClarity] = useState(70);
  const [activeReasoningBranch, setActiveReasoningBranch] = useState(1);
  const [executionCount, setExecutionCount] = useState(28419);

  // Live simulation counter for Act phase
  useEffect(() => {
    const timer = setInterval(() => {
      setExecutionCount((prev) => prev + Math.floor(Math.random() * 3 + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Track active stage with IntersectionObserver for the sticky navigation
  useEffect(() => {
    const stageIds = ['stage-dilemma', 'stage-understand', 'stage-think', 'stage-act'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (const id of stageIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveStage(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStage = (stageId: string) => {
    const el = document.getElementById(stageId);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'stage-dilemma', label: '01 Dilemma', tag: 'The Dilemma' },
    { id: 'stage-understand', label: '02 Understand', tag: 'Understand' },
    { id: 'stage-think', label: '03 Think', tag: 'Think' },
    { id: 'stage-act', label: '04 Act', tag: 'Act' },
  ];

  return (
    <div
      id="cinematic-scroll-journey-container"
      className="relative w-full bg-[#020202] text-[#e0e0e0] border-t border-b border-[#1a1a1a] scroll-mt-20"
    >
      {/* Background Matrix Texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-20" />

      {/* Sticky Fast-Track Navigation Header */}
      <div className="sticky top-16 z-30 w-full bg-[#020202]/90 backdrop-blur-md border-b border-[#1e1e1e] py-3 px-4 transition-all shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[11px] uppercase text-[#888888] tracking-widest">
              Cinematic Architecture Flow
            </span>
            <span className="hidden md:inline text-[#444444]">|</span>
            <span className="hidden md:inline text-xs font-mono text-white">
              {navItems.find((n) => n.id === activeStage)?.tag || 'The Dilemma'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                id={`btn-nav-${item.id}`}
                onClick={() => scrollToStage(item.id)}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeStage === item.id
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-[#777777] hover:text-white hover:bg-[#111111] border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-24 sm:space-y-32 relative">
        {/* Continuous Architecture Timeline Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-transparent via-[#222222] to-transparent pointer-events-none hidden lg:block" />

        {/* ========================================================================= */}
        {/* STAGE 1: The Dilemma (Complexity -> Clarity)                              */}
        {/* ========================================================================= */}
        <section
          id="stage-dilemma"
          className="relative scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-[#333333] text-[10px] font-mono tracking-widest text-[#aaaaaa] uppercase">
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>Phase I — The Dilemma</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              Technology should do <br />
              <span className="text-[#aaaaaa] font-light">more than answer.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#888888] font-light leading-relaxed">
              Modern people and businesses are surrounded by endless information, fragmented applications, noisy notifications, and repetitive digital work.
            </p>

            <div className="border-l-2 border-white pl-4 space-y-1 bg-[#060606] p-3 border-y border-r border-[#1a1a1a]">
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                The shift from query to agency:
              </p>
              <p className="text-xs text-[#888888] leading-relaxed">
                We don't need another chat box. We need intelligence that captures context and transforms noise into crystalline clarity.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToStage('stage-understand')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#e0e0e0] transition-colors cursor-pointer"
              >
                <span>Scroll to 02: Understand</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Complexity -> Clarity Visualizer */}
          <div className="lg:col-span-6 w-full bg-[#050505] border border-[#222222] p-6 sm:p-8 relative shadow-2xl">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
            <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#aaaaaa] uppercase">
                  Signal-To-Entropy Matrix
                </span>
              </div>
              <span className="text-[10px] font-mono text-white tracking-widest uppercase font-semibold">
                Clarity: {interactiveClarity}%
              </span>
            </div>

            {/* Dynamic visual grid demonstrating chaos -> order */}
            <div className="grid grid-cols-6 gap-2 sm:gap-2.5 h-36 sm:h-40 place-content-center p-3 bg-[#020202] border border-[#1a1a1a]">
              {Array.from({ length: 24 }).map((_, idx) => {
                const isOrdered = idx < (interactiveClarity / 100) * 24;
                return (
                  <div
                    key={idx}
                    className={`h-6 sm:h-7 transition-all duration-300 flex items-center justify-center text-[9px] font-mono tracking-wider ${
                      isOrdered
                        ? 'bg-white text-black font-bold'
                        : 'bg-[#0a0a0a] border border-[#1e1e1e] text-[#444444]'
                    }`}
                  >
                    {isOrdered ? 'SYNC' : 'NOISE'}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#666666] uppercase tracking-wider">
                <span>Simulated Noise Level</span>
                <span>Harmonized Order</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={interactiveClarity}
                onChange={(e) => setInteractiveClarity(Number(e.target.value))}
                className="w-full accent-white bg-[#222222] h-1.5 appearance-none cursor-pointer"
                aria-label="Adjust signal clarity"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 2: Understand                                                       */}
        {/* ========================================================================= */}
        <section
          id="stage-understand"
          className="relative scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-[#1a1a1a]"
        >
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-[#333333] text-[10px] font-mono tracking-widest text-[#aaaaaa] uppercase">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Phase II — The Foundation</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none">
              Understand.
            </h2>

            <p className="text-base sm:text-xl font-light text-[#aaaaaa]">
              Intelligence begins with understanding people, context, and problems.
            </p>

            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-light">
              Raw data is inert without situational context. ACRANIX builds cognitive models that perceive the nuanced reality of human intent, team dynamics, and operational landscapes.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-[#050505] border border-[#222222]">
                <p className="text-[10px] font-mono tracking-widest uppercase text-white font-semibold">Multi-Modal Inputs</p>
                <p className="text-xs text-[#777777] mt-1">Code, speech, documents & spatial intent.</p>
              </div>
              <div className="p-3.5 bg-[#050505] border border-[#222222]">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#aaaaaa]">Implicit Context</p>
                <p className="text-xs text-[#777777] mt-1">Grasping what is left unsaid.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToStage('stage-think')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#e0e0e0] transition-colors cursor-pointer"
              >
                <span>Scroll to 03: Think</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Context Synthesizer Visual */}
          <div className="lg:col-span-6 w-full bg-[#050505] border border-[#222222] p-6 sm:p-8 relative shadow-2xl">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
            <div className="text-xs font-mono text-[#888888] mb-4 flex items-center justify-between border-b border-[#222222] pb-3">
              <span className="uppercase tracking-widest text-white text-[10px]">Contextual Ingestion Layer</span>
              <span className="text-white flex items-center gap-1.5 text-[10px] uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Active Ingestion
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 bg-[#020202] border border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#888888]">User Workflow State</span>
                <span className="text-white border border-[#333333] px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold">99.4% Synthesized</span>
              </div>
              <div className="p-3 bg-[#020202] border border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#888888]">Environmental Constraints</span>
                <span className="text-[#aaaaaa] border border-[#222222] px-2 py-0.5 text-[10px] uppercase tracking-wider">Normalized</span>
              </div>
              <div className="p-3 bg-[#020202] border border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#888888]">Human Priority Hierarchy</span>
                <span className="text-white border border-[#444444] px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold">Aligned</span>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#1a1a1a] text-center">
              <span className="text-[10px] text-[#777777] font-mono tracking-widest uppercase">
                → Dispersed Information Transformed into Unified Understanding
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 3: Think                                                            */}
        {/* ========================================================================= */}
        <section
          id="stage-think"
          className="relative scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-[#1a1a1a]"
        >
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-[#333333] text-[10px] font-mono tracking-widest text-[#aaaaaa] uppercase">
              <Cpu className="w-3.5 h-3.5 text-white" />
              <span>Phase III — Cognitive Synthesis</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none">
              Think.
            </h2>

            <p className="text-base sm:text-xl font-light text-[#aaaaaa]">
              Analyze information. Understand context. Determine the right next step.
            </p>

            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-light">
              Thinking is not just pattern matching; it is deliberative reasoning. Our architecture evaluates counterfactuals, predicts consequence cascades, and formulates precise execution plans.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {['Multi-Path Simulation', 'Safety Guardrails', 'Deterministic Logic', 'Long-Horizon Memory'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 border border-[#222222] bg-[#050505] text-[10px] font-mono tracking-wider uppercase text-[#888888]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToStage('stage-act')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#e0e0e0] transition-colors cursor-pointer"
              >
                <span>Scroll to 04: Act</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Decision Graph */}
          <div className="lg:col-span-6 w-full bg-[#050505] border border-[#222222] p-6 sm:p-8 relative shadow-2xl">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
            <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-mono tracking-widest text-[#888888] uppercase">
                  Reasoning Path Simulator
                </span>
              </div>
              <span className="text-[10px] font-mono text-white font-semibold">BRANCH 0{activeReasoningBranch}</span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 1, title: 'Hypothesis α: Direct Task Automation', conf: '98.2%', cost: 'Minimal Latency' },
                { id: 2, title: 'Hypothesis β: Recursive Refinement', conf: '94.6%', cost: 'Deep Audit' },
                { id: 3, title: 'Hypothesis γ: Multi-Agent Parallelism', conf: '91.8%', cost: 'High Bandwidth' },
              ].map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => setActiveReasoningBranch(branch.id)}
                  className={`p-3.5 cursor-pointer transition-all duration-200 border flex items-center justify-between ${
                    activeReasoningBranch === branch.id
                      ? 'bg-[#111111] border-white text-white shadow-md'
                      : 'bg-[#020202] border-[#1a1a1a] text-[#888888] hover:border-[#333333]'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold">{branch.title}</p>
                    <p className="text-[10px] text-[#666666] font-mono mt-0.5">{branch.cost}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">{branch.conf}</span>
                    <p className="text-[9px] text-[#555555] font-mono uppercase tracking-widest">Confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 4: Act                                                              */}
        {/* ========================================================================= */}
        <section
          id="stage-act"
          className="relative scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-[#1a1a1a]"
        >
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#080808] border border-[#333333] text-[10px] font-mono tracking-widest text-[#aaaaaa] uppercase">
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Phase IV — The Essence</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none">
              Act.
            </h2>

            <p className="text-base sm:text-xl font-light text-[#cccccc]">
              Intelligence becomes meaningful when it creates action.
            </p>

            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-light">
              This is the core concept of ACRANIX. Thinking without execution is a thought experiment. We engineer systems that safely interface with software, environments, and enterprise pipelines to produce real-world results.
            </p>

            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#aaaaaa]">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Autonomous Execution</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#aaaaaa]">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Verified Outcomes</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToStage('stage-dilemma')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#e0e0e0] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Back to Top of Journey</span>
              </button>
            </div>
          </div>

          {/* Execution Engine Pulse Visualizer */}
          <div className="lg:col-span-6 w-full bg-[#050505] border border-[#222222] p-6 sm:p-8 relative shadow-2xl">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
            <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Workflow className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-mono tracking-widest text-[#888888] uppercase">
                  Continuous Action Pipeline
                </span>
              </div>
              <span className="text-[10px] font-mono text-white flex items-center gap-1.5 uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                EXECUTING
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-[#020202] border border-[#1a1a1a] flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white">Autonomous Workflow Resolved</p>
                  <p className="text-[10px] font-mono text-[#666666]">Context mapped → Logic parsed → Action taken</p>
                </div>
                <span className="text-xs font-mono font-bold text-white">0.042s</span>
              </div>

              <div className="p-3.5 bg-[#020202] border border-[#1a1a1a] flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#aaaaaa]">Real-World Outcome Delivered</p>
                  <p className="text-[10px] font-mono text-[#666666]">Verified feedback loop & safety validation</p>
                </div>
                <span className="text-xs font-mono text-white font-semibold">100% OK</span>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#1a1a1a] flex items-center justify-between text-xs font-mono text-[#666666]">
              <span className="uppercase text-[10px] tracking-widest">Autonomous Tasks Handled</span>
              <span className="text-white font-bold">{executionCount.toLocaleString()}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}



