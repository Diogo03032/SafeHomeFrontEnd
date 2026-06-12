export const PALETTES = {
    forest:   { primary: '#1d9e75', primaryDark: '#0f6e56', primaryLight: '#e1f5ee' },
    ocean:    { primary: '#4e87c2', primaryDark: '#2c5f8f', primaryLight: '#dbeaf6' },
    lavender: { primary: '#9b7bc9', primaryDark: '#6e5295', primaryLight: '#ece4f5' },
    coral:    { primary: '#e07d6b', primaryDark: '#a85542', primaryLight: '#fae3dc' },
    sun:      { primary: '#d4a647', primaryDark: '#9f7920', primaryLight: '#faefd6' },
    stone:    { primary: '#5b6770', primaryDark: '#363f47', primaryLight: '#dde1e4' },
} as const;

export type ColorPaletteName = keyof typeof PALETTES;

export const BASE_COLORS = {
    background:     '#f0f5f1',
    backgroundDark: '#0d3b30',
    surface:        '#ffffff',
    surfaceTinted:  '#e9efe9',
    textPrimary:    '#1a1a1a',
    textSecondary:  '#666666',
    textOnPrimary:  '#ffffff',
    border:         '#d0d8d2',
    borderSubtle:   '#e5ebe7',
    shadow:         'rgba(0, 0, 0, 0.08)',
} as const;

export const STATUS_COLORS = {
    success: '#2e8b57',  // Estável
    warning: '#d4a647',  // Atenção
    danger:  '#c83333',  // Crítico / Pânico
    info:    '#4e87c2',
} as const;

export const getThemeColors = (palette: ColorPaletteName = 'forest') => ({
    ...PALETTES[palette],
    ...BASE_COLORS,
    status: STATUS_COLORS,
});

export type ThemeColors = ReturnType<typeof getThemeColors>;