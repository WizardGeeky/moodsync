import type { AuroraBlobConfig } from '@/constants/brand';
import { hexToRgba } from '@/utils/color';

export type AppThemeId =
  | 'midnight'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'aurora'
  | 'rosegold'
  | 'royal'
  | 'orchid';
export type AppMode = 'dark' | 'light';

/**
 * Semantic tokens for the main app (Home/Posts/Chats/Notifications/Settings/Create Post/Theme
 * Picker + the top/tab bar chrome). Welcome/Onboarding/Login/Signup are fixed dark brand screens
 * and never read these — they only use `gradient`/`background`/`blobs` below, unaffected by mode.
 */
export type ModeColors = {
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  barBackground: string;
  barBorder: string;
  iconButtonBackground: string;
};

/**
 * Both helpers tint every surface/border/bar from the theme's own accent + background hue
 * (instead of one universal gray), so each theme reads as genuinely distinct in both modes
 * rather than only showing up in a handful of gradient accents.
 */
function darkColors(background: string, accent: string): ModeColors {
  return {
    background,
    surface: hexToRgba(accent, 0.12),
    surfaceBorder: hexToRgba(accent, 0.24),
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.65)',
    textMuted: 'rgba(255,255,255,0.48)',
    barBackground: hexToRgba(background, 0.88),
    barBorder: hexToRgba(accent, 0.2),
    iconButtonBackground: hexToRgba(accent, 0.22),
  };
}

function lightColors(background: string, accent: string): ModeColors {
  return {
    background,
    surface: hexToRgba(accent, 0.08),
    surfaceBorder: hexToRgba(accent, 0.2),
    text: '#12121A',
    textSecondary: 'rgba(18,18,26,0.65)',
    textMuted: 'rgba(18,18,26,0.48)',
    barBackground: hexToRgba(background, 0.9),
    barBorder: hexToRgba(accent, 0.18),
    iconButtonBackground: hexToRgba(accent, 0.22),
  };
}

export type AppThemePalette = {
  id: AppThemeId;
  name: string;
  background: string;
  gradient: readonly [string, string, string];
  blobs: AuroraBlobConfig[];
  blobsCompact: AuroraBlobConfig[];
  swatch: readonly [string, string];
  dark: ModeColors;
  light: ModeColors;
};

export const APP_THEMES: AppThemePalette[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    background: '#07060D',
    gradient: ['#FF5F6D', '#8B5CF6', '#3B82F6'],
    blobs: [
      { colors: ['#3B82F6', '#1D4ED8'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#8B5CF6', '#5B21B6'], size: 460, top: '28%', left: '35%' },
      { colors: ['#FF5F6D', '#C2255C'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#3B82F6', '#1D4ED8'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#FF5F6D', '#C2255C'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#8B5CF6', '#3B82F6'],
    dark: darkColors('#07060D', '#8B5CF6'),
    light: lightColors('#F7F5FA', '#8B5CF6'),
  },
  {
    id: 'ocean',
    name: 'Ocean',
    background: '#040B14',
    gradient: ['#22D3EE', '#3B82F6', '#1D4ED8'],
    blobs: [
      { colors: ['#22D3EE', '#0E7490'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#3B82F6', '#1D4ED8'], size: 460, top: '28%', left: '35%' },
      { colors: ['#0EA5E9', '#075985'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#22D3EE', '#0E7490'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#0EA5E9', '#075985'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#22D3EE', '#1D4ED8'],
    dark: darkColors('#040B14', '#3B82F6'),
    light: lightColors('#F1F8FC', '#3B82F6'),
  },
  {
    id: 'sunset',
    name: 'Sunset',
    background: '#140609',
    gradient: ['#FDBA74', '#FB7185', '#DB2777'],
    blobs: [
      { colors: ['#FDBA74', '#C2410C'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#FB7185', '#BE123C'], size: 460, top: '28%', left: '35%' },
      { colors: ['#DB2777', '#831843'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#FDBA74', '#C2410C'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#DB2777', '#831843'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#FB7185', '#DB2777'],
    dark: darkColors('#140609', '#FB7185'),
    light: lightColors('#FDF4F2', '#FB7185'),
  },
  {
    id: 'forest',
    name: 'Forest',
    background: '#050F0A',
    gradient: ['#86EFAC', '#22C55E', '#0D9488'],
    blobs: [
      { colors: ['#86EFAC', '#15803D'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#22C55E', '#166534'], size: 460, top: '28%', left: '35%' },
      { colors: ['#0D9488', '#115E59'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#86EFAC', '#15803D'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#0D9488', '#115E59'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#22C55E', '#0D9488'],
    dark: darkColors('#050F0A', '#22C55E'),
    light: lightColors('#F2FAF4', '#22C55E'),
  },
  {
    id: 'aurora',
    name: 'Aurora',
    background: '#050B12',
    gradient: ['#5EEAD4', '#A78BFA', '#F472B6'],
    blobs: [
      { colors: ['#5EEAD4', '#0F766E'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#A78BFA', '#6D28D9'], size: 460, top: '28%', left: '35%' },
      { colors: ['#F472B6', '#BE185D'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#5EEAD4', '#0F766E'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#F472B6', '#BE185D'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#A78BFA', '#5EEAD4'],
    dark: darkColors('#050B12', '#A78BFA'),
    light: lightColors('#F4FBFA', '#A78BFA'),
  },
  {
    id: 'rosegold',
    name: 'Rose Gold',
    background: '#170D0A',
    gradient: ['#FDE68A', '#FCA5A5', '#F43F5E'],
    blobs: [
      { colors: ['#FDE68A', '#B45309'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#FCA5A5', '#B91C1C'], size: 460, top: '28%', left: '35%' },
      { colors: ['#F43F5E', '#9F1239'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#FDE68A', '#B45309'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#F43F5E', '#9F1239'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#FCA5A5', '#F43F5E'],
    dark: darkColors('#170D0A', '#FCA5A5'),
    light: lightColors('#FFF8F0', '#FCA5A5'),
  },
  {
    id: 'royal',
    name: 'Royal',
    background: '#0B0716',
    gradient: ['#C4B5FD', '#8B5CF6', '#4C1D95'],
    blobs: [
      { colors: ['#C4B5FD', '#6D28D9'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#8B5CF6', '#4C1D95'], size: 460, top: '28%', left: '35%' },
      { colors: ['#4C1D95', '#2E1065'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#C4B5FD', '#6D28D9'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#4C1D95', '#2E1065'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#8B5CF6', '#4C1D95'],
    dark: darkColors('#0B0716', '#8B5CF6'),
    light: lightColors('#F8F6FD', '#8B5CF6'),
  },
  {
    id: 'orchid',
    name: 'Orchid',
    background: '#140314',
    gradient: ['#F0ABFC', '#D946EF', '#A21CAF'],
    blobs: [
      { colors: ['#F0ABFC', '#A21CAF'], size: 420, top: '8%', left: '-20%' },
      { colors: ['#D946EF', '#86198F'], size: 460, top: '28%', left: '35%' },
      { colors: ['#A21CAF', '#701A75'], size: 380, top: '58%', left: '-10%' },
    ],
    blobsCompact: [
      { colors: ['#F0ABFC', '#A21CAF'], size: 300, top: '-10%', left: '-18%' },
      { colors: ['#A21CAF', '#701A75'], size: 320, top: '78%', left: '58%' },
    ],
    swatch: ['#D946EF', '#A21CAF'],
    dark: darkColors('#140314', '#D946EF'),
    light: lightColors('#FDF4FD', '#D946EF'),
  },
];

export const DEFAULT_THEME_ID: AppThemeId = 'midnight';
export const DEFAULT_MODE: AppMode = 'dark';
