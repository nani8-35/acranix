import { useState } from 'react';
import { Users, ArrowUpRight, Mail } from 'lucide-react';
import { TeamPillar } from '../types';

interface TeamSectionProps {
  onOpenJoinModal: () => void;
}

export function TeamSection({ onOpenJoinModal }: TeamSectionProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const teamDisciplines: TeamPillar[] = [
    {
      discipline: 'Autonomous AI & Cognitive Systems',
      role: 'Research & Model Architecture',
      quote: 'Moving beyond probabilistic conversational responses toward verifiable, deterministic reasoning engines.',
      status: 'Active Engineering',
    },
    {
      discipline: 'High-Assurance Distributed Systems',
      role: 'Core Systems & Infrastructure',
      quote: 'Constructing the resilient substrate required for secure, low-latency, and multi-agent execution at scale.',
      status: 'Active Engineering',
    },
    {
      discipline: 'Human-Computer Symbiosis',
      role: 'Interface & Spatial Design',
      quote: 'Creating interaction patterns that eliminate digital clutter and restore human creative flow.',
      status: 'Active Design',
    },
    {
      discipline: 'Agentic Tooling & System Interfaces',
      role: 'Ecosystem & Execution Layer',
      quote: 'Safely bridging autonomous intelligence with real-world software APIs and enterprise workflows.',
      status: 'Open Seat',
    },
  ];

  return (
    <section id="team" className="relative py-32 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050505] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
          <Users className="w-3 h-3 text-white" />
          <span>Our Collective</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          Built by People Who Want to Build the Future.
        </h2>
        <p className="text-[#777777] text-sm sm:text-base font-light">
          We are builders, thinkers, engineers, designers, and creators united by a belief that technology can create meaningful change.
        </p>
      </div>

      {/* Modern Non-Corporate Discipline & Seat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
        {teamDisciplines.map((pillar, idx) => (
          <div
            key={idx}
            id={`team-discipline-card-${idx}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`p-8 sm:p-10 transition-all duration-300 border relative flex flex-col justify-between ${
              hoveredIdx === idx
                ? 'bg-[#0a0a0a] border-white'
                : 'bg-[#050505] border-[#222222]'
            }`}
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#333333] group-hover:bg-white" />

            {/* Top row */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono text-[10px] text-[#666666] tracking-widest uppercase">
                Discipline 0{idx + 1}
              </span>
              <span
                className={`px-2.5 py-0.5 font-mono text-[10px] border uppercase tracking-wider ${
                  pillar.status === 'Open Seat'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-[#333333] text-[#888888]'
                }`}
              >
                {pillar.status}
              </span>
            </div>

            {/* Core Info */}
            <div className="space-y-3 my-auto">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                {pillar.role}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {pillar.discipline}
              </h3>
              <p className="text-sm text-[#aaaaaa] font-light italic leading-relaxed pt-2">
                "{pillar.quote}"
              </p>
            </div>

            {/* Bottom Status line */}
            <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] font-mono text-[#666666] uppercase tracking-wider">
              <span>Universal Standards</span>
              <span className="text-white">Zero Slop • High Craft</span>
            </div>
          </div>
        ))}
      </div>

      {/* Team Contact & Leadership Banner */}
      <div className="bg-[#050505] border border-[#222222] p-8 sm:p-10 relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
        
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-lg font-bold text-white">Direct Founder & Engineering Channel</h4>
          <p className="text-xs text-[#777777] font-light">
            For technical discussions, research exchange, and builder inquiries:
          </p>
        </div>

        <a
          id="team-founder-email-link"
          href="mailto:akashyeginati@acranix.com"
          className="px-6 py-3 border border-[#333333] hover:border-white bg-[#020202] text-white hover:text-black hover:bg-white font-mono text-xs tracking-wider transition-all flex items-center gap-2"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>akashyeginati@acranix.com</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
