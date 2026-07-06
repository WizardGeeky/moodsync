export const BrandName = 'MoodSync';
export const BrandTagline = 'Share Moments, Connect Hearts';

/** Pink -> purple -> blue, used for the logo mark and the primary button. */
export const BrandGradient = ['#FF5F6D', '#8B5CF6', '#3B82F6'] as const;

/** Near-black base for the Welcome screen, with three drifting aurora blobs. */
export const AuroraBackgroundColor = '#07060D';

export type AuroraBlobConfig = {
  colors: readonly [string, string];
  size: number;
  top: `${number}%`;
  left: `${number}%`;
};

export const AuroraBlobs: AuroraBlobConfig[] = [
  { colors: ['#3B82F6', '#1D4ED8'], size: 420, top: '8%', left: '-20%' },
  { colors: ['#8B5CF6', '#5B21B6'], size: 460, top: '28%', left: '35%' },
  { colors: ['#FF5F6D', '#C2255C'], size: 380, top: '58%', left: '-10%' },
];

/** Calmer set for form screens (Login/Signup) — tucked into the corners, clear of the center. */
export const AuroraBlobsCompact: AuroraBlobConfig[] = [
  { colors: ['#3B82F6', '#1D4ED8'], size: 300, top: '-10%', left: '-18%' },
  { colors: ['#FF5F6D', '#C2255C'], size: 320, top: '78%', left: '58%' },
];
