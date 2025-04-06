// app/constants/index.ts
export const COLORS = {
    background: '#111827',
    skyBackground: '#1E40AF', // Deep blue
    headerBackground: '#1F2937',
    inputBackground: '#1F2937',
    modalBackground: 'rgba(31, 41, 55, 0.95)',
    text: '#FFFFFF',
    primary: '#EF4444', // Red
    secondary: '#10B981', // Green
    active: '#F59E0B', // Amber
    sliderTrack: '#F59E0B',
    sliderBackground: '#374151',
    sliderThumb: '#F59E0B',
    sun: '#FCD34D',
    windIndicator: '#FFFFFF',
    explosionOuter: '#FCD34D',
    explosionInner: '#EF4444',
  };
  
  export const PLAYER_TYPES = {
    HUMAN: 'human',
    AI: 'ai',
  } as const;
  
  export type PlayerType = typeof PLAYER_TYPES[keyof typeof PLAYER_TYPES];
  
  export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    LEVEL_COMPLETE: 'level_complete',
  } as const;
  
  export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES];
  
  export const BUILDING_COLORS = [
    '#059669', // Emerald
    '#DC2626', // Red
    '#2563EB', // Blue
    '#D97706', // Amber
    '#4F46E5', // Indigo
    '#7C3AED', // Violet
    '#BE185D', // Pink
  ];