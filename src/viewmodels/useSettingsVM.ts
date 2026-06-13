import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { DrawerParamList } from '@navigation/AppNavigator';


type Navigation = DrawerNavigationProp<DrawerParamList, 'Settings'>;

interface SettingsItem {
    id: string;
    titulo: string;
    descricao: string;
    rota: keyof DrawerParamList;
}

export const SETTINGS_ITEMS: SettingsItem[] = [
    {
        id: 'themes',
        titulo: 'Temas',
        descricao: 'Modo claro/escuro e cor principal',
        rota: 'Themes',
    },
    {
        id: 'accessibility',
        titulo: 'Acessibilidade',
        descricao: 'Tamanho de fonte, narração, contraste',
        rota: 'Accessibility',
    },
    {
        id: 'permissions',
        titulo: 'Permissões',
        descricao: 'O que cada contato pode ver',
        rota: 'Permissions',
    },
    {
        id: 'about',
        titulo: 'Sobre',
        descricao: 'Versão, créditos e informações',
        rota: 'About',
    },
];

export function useSettingsVM() {
    const navigation = useNavigation<Navigation>();

    const irPara = (rota: keyof DrawerParamList) => {
        navigation.navigate(rota);
    };

    return {
        itens: SETTINGS_ITEMS,
        irPara,
    };
}

