import { AcranixLogo } from './AcranixLogo';

export function FinalExperienceSection() {
  return (
    <section className="relative py-40 px-6 sm:px-12 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
      <div className="space-y-8 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050505] border border-[#333333] text-[10px] font-mono tracking-widest text-[#888888] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Resolution</span>
        </div>

        <AcranixLogo variant="hero" size="xl" showSince={true} colorScheme="gold-accent" />

        <p className="text-xl sm:text-2xl font-light tracking-widest text-[#aaaaaa] uppercase pt-2">
          Intelligence in Action.
        </p>

        <div className="pt-8 max-w-xl mx-auto space-y-2 text-[#777777] text-sm sm:text-base font-light leading-relaxed">
          <p className="text-[#cccccc] font-normal text-base sm:text-lg">
            The future is not just intelligent.
          </p>
          <p className="text-white font-semibold text-base sm:text-lg">
            It takes action.
          </p>
        </div>
      </div>
    </section>
  );
}
