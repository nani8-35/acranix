import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { HeroSection } from './components/HeroSection';
import { CinematicScrollJourney } from './components/CinematicScrollJourney';
import { CorePhilosophySection } from './components/CorePhilosophySection';
import { WhoWeBuildForSection } from './components/WhoWeBuildForSection';
import { EcosystemSection } from './components/EcosystemSection';
import { VisionSection } from './components/VisionSection';
import { JourneyTimelineSection } from './components/JourneyTimelineSection';
import { TeamSection } from './components/TeamSection';
import { JoinSection } from './components/JoinSection';
import { FinalExperienceSection } from './components/FinalExperienceSection';
import { Footer } from './components/Footer';

export default function App() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height > 0 ? winScroll / height : 0;
      setScrollProgress(progress);

      // Section tracking for nav states
      const sections = ['hero', 'philosophy', 'what-we-build', 'ecosystem', 'vision', 'journey', 'team', 'join'];
      const scrollPos = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBeginJourney = () => {
    const el = document.getElementById('cinematic-scroll-journey-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] selection:bg-[#ffffff] selection:text-[#000000] relative overflow-x-hidden">
      {/* Elegant Dark Subtle Architectural Dot Grid & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(25,25,25,0.5)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#222222] to-transparent opacity-30" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-gradient-to-r from-transparent via-[#222222] to-transparent opacity-30" />
        <div
          className="h-full w-full opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* 3D Generative Particle & Neural Matrix Canvas */}
      <InteractiveCanvas scrollProgress={scrollProgress} activeSection={activeSection} />

      {/* Primary Fixed Navigation */}
      <Navigation
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        activeSection={activeSection}
      />

      <main className="relative z-10">
        {/* 1. START — CENTER / HERO */}
        <HeroSection
          onBeginJourney={handleBeginJourney}
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
        />

        {/* 2 - 5. CINEMATIC SCROLL JOURNEY (MOVE RIGHT -> MOVE LEFT -> MOVE DOWN -> ACT) */}
        <CinematicScrollJourney />

        {/* THE CORE PHILOSOPHY (UNDERSTAND -> THINK -> ACT) */}
        <CorePhilosophySection />

        {/* WHO WE BUILD FOR (3 WORLDS: PEOPLE, PROFESSIONALS, BUSINESSES) */}
        <WhoWeBuildForSection />

        {/* WHAT ACRANIX IS BUILDING TOWARD (ECOSYSTEM: 4 AREAS) */}
        <EcosystemSection />

        {/* OUR VISION (FULLSCREEN CINEMATIC) */}
        <VisionSection />

        {/* OUR JOURNEY (HONEST EARLY-STAGE TIMELINE: NOW -> DISCOVER -> BUILD -> EVOLVE -> THE FUTURE) */}
        <JourneyTimelineSection />

        {/* TEAM SECTION (BUILT BY PEOPLE WHO WANT TO BUILD THE FUTURE) */}
        <TeamSection onOpenJoinModal={() => setIsJoinModalOpen(true)} />

        {/* JOIN ACRANIX / THE FUTURE NEEDS BUILDERS */}
        <JoinSection
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onOpen={() => setIsJoinModalOpen(true)}
        />

        {/* FINAL EXPERIENCE (CALM RESOLUTION) */}
        <FinalExperienceSection />
      </main>

      {/* FOOTER (SEAMLESS GRADUAL DESCENT) */}
      <Footer onOpenJoinModal={() => setIsJoinModalOpen(true)} />
    </div>
  );
}
