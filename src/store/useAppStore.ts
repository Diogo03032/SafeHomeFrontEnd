import { create } from 'zustand';
import type { User } from '@models/User';
import * as storage from '@services/storageService';
import { STORAGE_KEYS } from '@constants/storage';
import type { ColorPaletteName } from '@theme/colors';

// Store global do app — agora também gerencia o tema.
//
// NOVIDADES VS VERSÃO ANTERIOR:
//   - themePalette: paleta de cor escolhida pelo usuário
//   - themeMode: 'light' | 'dark' | 'system'
//   - setThemePalette() e setThemeMode(): atualizam tudo (store + storage)

export type AuthStatus = 'loading' | 'logged_in' | 'logged_out';
export type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
    // --- Auth ---
    user: User | null;
    token: string | null;
    authStatus: AuthStatus;

    // --- Tema ---
    themePalette: ColorPaletteName;
    themeMode: ThemeMode;

    // --- Setters ---
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setAuthStatus: (status: AuthStatus) => void;
    setThemePalette: (palette: ColorPaletteName) => Promise<void>;
    setThemeMode: (mode: ThemeMode) => Promise<void>;

    // --- Ações ---
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
    user: null,
    token: null,
    authStatus: 'loading',
    themePalette: 'forest',
    themeMode: 'system',

    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setAuthStatus: (authStatus) => set({ authStatus }),

    // Tema: setar valor + persistir no AsyncStorage
    setThemePalette: async (palette) => {
        await storage.setPreference(STORAGE_KEYS.LOCAL.COLOR_THEME, palette);
        set({ themePalette: palette });
    },

    setThemeMode: async (mode) => {
        await storage.setPreference(STORAGE_KEYS.LOCAL.THEME_MODE, mode);
        set({ themeMode: mode });
    },

    login: async (user, token) => {
        await storage.saveAuthToken(token);
        await storage.saveUserId(user.id_usuario);
        set({ user, token, authStatus: 'logged_in' });
    },

    logout: async () => {
        await storage.clearAuth();
        set({ user: null, token: null, authStatus: 'logged_out' });
    },

    // Hidrata também o tema (lê AsyncStorage e popula a store)
    hydrate: async () => {
        const token = await storage.getAuthToken();

        // Lê preferências de tema
        const savedPalette = await storage.getPreference(STORAGE_KEYS.LOCAL.COLOR_THEME);
        const savedMode = await storage.getPreference(STORAGE_KEYS.LOCAL.THEME_MODE);

        set({
            themePalette: (savedPalette as ColorPaletteName) ?? 'forest',
            themeMode: (savedMode as ThemeMode) ?? 'system',
            ...(token ? { token, authStatus: 'logged_in' } : { authStatus: 'logged_out' }),
        });
    },
}));
