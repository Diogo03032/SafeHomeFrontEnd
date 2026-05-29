import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as userService from '@services/userService';
import type { UserStatus } from '@services/userService';
import { useAppStore } from '@store/useAppStore';
import type { TabParamList } from '@navigation/AppNavigator';

type Navigation = BottomTabNavigationProp<TabParamList, 'Home'>;

export function useHomeVM() {
    const navigation = useNavigation<Navigation>();

    const user = useAppStore((s) => s.user);

    const [status, setStatus] = useState<UserStatus | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    const carregarStatus = useCallback(async (modoAtualizacao = false) => {
        if (modoAtualizacao) {
            setAtualizando(true);
        } else {
            setCarregando(true);
        }

        try {
            const data = await userService.getStatus();
            setStatus(data);
        } catch (error: any) {
            console.warn('[useHomeVM] Falha ao carregar status:', error?.message);
            setStatus(null);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarStatus();
        }, [carregarStatus])
    );

    const getSaudacao = (): string => {
        const hora = new Date().getHours();
        if (hora < 12) return 'Bom dia';
        if (hora < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const getPrimeiroNome = (): string => {
        if (!user?.nome) return 'usuário';
        return user.nome.split(' ')[0];
    };

    const acionarPanico = () => {
        Alert.alert(
            'Pânico',
            'O botão de pânico será implementado na próxima sprint.\n\nQuando estiver pronto, ele vai acionar alertas para seus contatos de emergência.',
            [{ text: 'OK' }]
        );
    };

    const irParaPerfil = () => {
        navigation.navigate('Profile');
    };

    return {
        user,
        status,
        carregando,
        atualizando,
        saudacao: getSaudacao(),
        primeiroNome: getPrimeiroNome(),
        carregarStatus,
        acionarPanico,
        irParaPerfil,
    };
}
