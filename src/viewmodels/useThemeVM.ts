import { Alert } from 'react-native';
import { useAppStore } from '@store/useAppStore';
import type { ThemeMode } from '@store/useAppStore';
import type { ColorPaletteName } from '@theme/colors';

interface ModoOption {
    value: ThemeMode;
    label: string;
    icone: string;
    descricao: string;
}

interface PaletaOption {
    value: ColorPaletteName;
    label: string;
    descricao: string;
    cor: string; 
}

// Opções de modo de exibição
export const MODOS: ModoOption[] = [
    { value: 'light',  label: 'Claro',    icone: '☀️', descricao: 'Fundo branco com texto escuro' },
    { value: 'dark',   label: 'Escuro',   icone: '🌙', descricao: 'Fundo escuro com texto claro' },
    { value: 'system', label: 'Sistema',  icone: '📱', descricao: 'Segue a configuração do celular' },
];

// Opções de paleta. Os hex aqui devem bater com o theme/colors.ts
export const PALETAS: PaletaOption[] = [
    { value: 'forest',   label: 'Floresta', descricao: 'Verde — padrão',         cor: '#1d9e75' },
    { value: 'ocean',    label: 'Oceano',   descricao: 'Azul calmo',             cor: '#4e87c2' },
    { value: 'lavender', label: 'Lavanda',  descricao: 'Roxo suave',             cor: '#9b7bc9' },
    { value: 'coral',    label: 'Coral',    descricao: 'Quente e acolhedor',     cor: '#e07d6b' },
    { value: 'sun',      label: 'Sol',      descricao: 'Amarelo terroso',        cor: '#d4a647' },
    { value: 'stone',    label: 'Pedra',    descricao: 'Cinza-azulado neutro',   cor: '#5b6770' },
];

export function useThemeVM() {
    
    const themePalette  = useAppStore((s) => s.themePalette);
    const themeMode     = useAppStore((s) => s.themeMode);
    const setPalette    = useAppStore((s) => s.setThemePalette);
    const setMode       = useAppStore((s) => s.setThemeMode);

    // Troca o modo (claro/escuro/sistema)
    const escolherModo = async (modo: ThemeMode) => {
        try {
            await setMode(modo);
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar essa preferência.');
        }
    };

    // Troca a paleta de cor principal
    const escolherPaleta = async (paleta: ColorPaletteName) => {
        try {
            await setPalette(paleta);
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar essa preferência.');
        }
    };

    // Restaura tudo pro padrão
    const restaurarPadrao = () => {
        Alert.alert(
            'Restaurar padrão?',
            'Vai voltar pra Floresta (verde) e modo Sistema.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Restaurar',
                    onPress: async () => {
                        await setPalette('forest');
                        await setMode('system');
                    },
                },
            ]
        );
    };

    return {
        themePalette,
        themeMode,
        modos: MODOS,
        paletas: PALETAS,
        escolherModo,
        escolherPaleta,
        restaurarPadrao,
    };
}
