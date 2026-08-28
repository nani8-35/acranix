import React from 'react';

interface AcranixLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'vertical' | 'hero';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  showSince?: boolean;
  colorScheme?: 'monochrome' | 'gold-accent';
}

/**
 * AcranixLogoIcon - Precise vector representation of the ACRANIX signature
 * concentric aperture arc/radar mark as shown in the company logo.
 */
export function AcranixLogoIcon({
  className = 'w-8 h-8',
  color = 'currentColor',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      aria-label="ACRANIX emblem"
    >
      {/* Outer Arc Band */}
      {/* Top-Right to Top-Center segment */}
      <path
        d="M 112 60 A 52 52 0 0 0 62 8"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="butt"
      />
      {/* Top Vertical Notch Gap is between x=62 and x=58 */}
      {/* Top-Center to Mid-Left segment */}
      <path
        d="M 58 8 A 52 52 0 0 0 8 60"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="butt"
      />
      {/* Vertical slit offset at Left (x=8, y=60 down to y=64) */}
      {/* Bottom-Left continuation with tapering line */}
      <path
        d="M 8 64 A 52 52 0 0 0 28 102"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="butt"
      />
      <path
        d="M 28 102 A 52 52 0 0 0 46 111"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Middle Arc Band */}
      {/* Top-Right to Top-Center */}
      <path
        d="M 100 60 A 40 40 0 0 0 62 20"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="butt"
      />
      {/* Top-Center to Mid-Left */}
      <path
        d="M 58 20 A 40 40 0 0 0 20 60"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="butt"
      />
      {/* Bottom-Left continuation */}
      <path
        d="M 20 64 A 40 40 0 0 0 35 92"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="butt"
      />
      <path
        d="M 35 92 A 40 40 0 0 0 48 99"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Inner Arc Band */}
      {/* Top-Right to Top-Center */}
      <path
        d="M 88 60 A 28 28 0 0 0 62 32"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="butt"
      />
      {/* Top-Center to Mid-Left */}
      <path
        d="M 58 32 A 28 28 0 0 0 32 60"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="butt"
      />
      {/* Bottom-Left continuation */}
      <path
        d="M 32 64 A 28 28 0 0 0 44 83"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="butt"
      />
      <path
        d="M 44 83 A 28 28 0 0 0 52 87"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Micro vertical connector notch guides for crispness */}
      <line x1="60" y1="6" x2="60" y2="34" stroke={color} strokeWidth="1" strokeOpacity="0.15" />
      <line x1="6" y1="60" x2="34" y2="60" stroke={color} strokeWidth="1" strokeOpacity="0.15" />
    </svg>
  );
}

/**
 * AcranixTreeIcon - The golden tree emblem featured in the logo badge
 */
export function AcranixTreeIcon({
  className = 'w-3.5 h-3.5',
  color = 'currentColor',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Stylized full tree crown with trunk matching logo */}
      <path d="M12 2C8.5 2 6 4.5 6 7.5C4.5 8 3.5 9.5 3.5 11.2C3.5 13.5 5.3 15.3 7.6 15.3C8 15.3 8.5 15.2 9 15L9 20C9 20.6 9.4 21 10 21L14 21C14.6 21 15 20.6 15 20L15 15C15.5 15.2 16 15.3 16.4 15.3C18.7 15.3 20.5 13.5 20.5 11.2C20.5 9.5 19.5 8 18 7.5C18 4.5 15.5 2 12 2Z" />
    </svg>
  );
}

export function AcranixLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSince = true,
  colorScheme = 'gold-accent',
}: AcranixLogoProps) {
  // Size configurations
  const sizeMap = {
    xs: {
      icon: 'w-5 h-5',
      text: 'text-sm tracking-[0.2em]',
      since: 'text-[7px] tracking-[0.25em]',
      tree: 'w-2 h-2',
      gap: 'gap-2',
    },
    sm: {
      icon: 'w-7 h-7',
      text: 'text-base sm:text-lg tracking-[0.22em]',
      since: 'text-[8px] sm:text-[9px] tracking-[0.3em]',
      tree: 'w-2.5 h-2.5',
      gap: 'gap-2.5',
    },
    md: {
      icon: 'w-9 h-9 sm:w-10 sm:h-10',
      text: 'text-xl sm:text-2xl tracking-[0.24em]',
      since: 'text-[9px] sm:text-[10px] tracking-[0.32em]',
      tree: 'w-3 h-3',
      gap: 'gap-3 sm:gap-4',
    },
    lg: {
      icon: 'w-12 h-12 sm:w-16 sm:h-16',
      text: 'text-3xl sm:text-4xl lg:text-5xl tracking-[0.25em]',
      since: 'text-xs sm:text-sm tracking-[0.35em]',
      tree: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
      gap: 'gap-4 sm:gap-6',
    },
    xl: {
      icon: 'w-20 h-20 sm:w-28 sm:h-28',
      text: 'text-5xl sm:text-7xl lg:text-8xl tracking-[0.22em]',
      since: 'text-sm sm:text-base tracking-[0.38em]',
      tree: 'w-4 h-4 sm:w-5 sm:h-5',
      gap: 'gap-6 sm:gap-8',
    },
    custom: {
      icon: 'w-full h-full',
      text: '',
      since: '',
      tree: 'w-3 h-3',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size];
  const goldColor = colorScheme === 'gold-accent' ? '#D4B26F' : '#888888';

  if (variant === 'mark') {
    return <AcranixLogoIcon className={className || currentSize.icon} color="#F5F2EB" />;
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col md:flex-row items-center justify-center ${currentSize.gap} ${className}`}>
        <AcranixLogoIcon className={currentSize.icon} color="#F5F2EB" />
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span
            className={`font-black text-[#F5F2EB] uppercase leading-none font-sans select-none ${currentSize.text}`}
          >
            ACRANIX
          </span>
          {showSince && (
            <div
              className={`flex items-center gap-1.5 font-mono uppercase font-medium mt-1.5 sm:mt-2 select-none ${currentSize.since}`}
              style={{ color: goldColor }}
            >
              <span>SINCE 2026</span>
              <AcranixTreeIcon className={currentSize.tree} color={goldColor} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      <AcranixLogoIcon className={currentSize.icon} color="#F5F2EB" />
      <div className="flex flex-col justify-center">
        <span
          className={`font-black text-[#F5F2EB] uppercase leading-none font-sans select-none ${currentSize.text}`}
        >
          ACRANIX
        </span>
        {showSince && (
          <div
            className={`flex items-center gap-1 font-mono uppercase font-semibold mt-1 select-none ${currentSize.since}`}
            style={{ color: goldColor }}
          >
            <span>SINCE 2026</span>
            <AcranixTreeIcon className={currentSize.tree} color={goldColor} />
          </div>
        )}
      </div>
    </div>
  );
}
