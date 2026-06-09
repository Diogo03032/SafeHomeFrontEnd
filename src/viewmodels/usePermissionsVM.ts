import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'unsupported';

interface PermissionInfo {
    id: string;
    icone: string;
    titulo: string;
    descricao: string;
    importancia: 'alta' | 'media' | 'opcional';
    status: PermissionStatus;
}

export function usePermissionsVM() {
    const [notifStatus, setNotifStatus] = useState<PermissionStatus>('undetermined');
    const [locStatus, setLocStatus] = useState<PermissionStatus>('undetermined');
    const [verificando, setVerificando] = useState(true);

    const verificarTodas = async () => {
        setVerificando(true);
        try {
            
            const notif = await Notifications.getPermissionsAsync();
            setNotifStatus(notif.status as PermissionStatus);

            
            const loc = await Location.getForegroundPermissionsAsync();
            setLocStatus(loc.status as PermissionStatus);
        } catch (error) {
            console.warn('[usePermissionsVM] Erro:', error);
        } finally {
            setVerificando(false);
        }
    };

    useEffect(() => {
        verificarTodas();
    }, []);

    const pedirNotificacoes = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        setNotifStatus(status as PermissionStatus);

        if (status !== 'granted') {
            mostrarInstrucoesConfig();
        }
    };

    const pedirLocalizacao = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocStatus(status as PermissionStatus);

        if (status !== 'granted') {
            mostrarInstrucoesConfig();
        }
    };

    
    const mostrarInstrucoesConfig = () => {
        Alert.alert(
            'Permissão necessária',
            'Pra alterar essa permissão, vá em Configurações do seu aparelho.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Abrir Configurações',
                    onPress: () => Linking.openSettings(),
                },
            ]
        );
    };


    const permissoes: PermissionInfo[] = [
        {
            id: 'notifications',
            icone: '🔔',
            titulo: 'Notificações',
            descricao: 'Pra receber alertas e lembretes',
            importancia: 'alta',
            status: notifStatus,
        },
        {
            id: 'location',
            icone: '📍',
            titulo: 'Localização',
            descricao: 'Pra enviar sua posição em emergências',
            importancia: 'alta',
            status: locStatus,
        },
        {
            id: 'camera',
            icone: '📷',
            titulo: 'Câmera',
            descricao: 'Pra tirar foto de perfil (em breve)',
            importancia: 'opcional',
            status: 'undetermined',
        },
        {
            id: 'mic',
            icone: '🎤',
            titulo: 'Microfone',
            descricao: 'Pra mensagens de voz (em breve)',
            importancia: 'opcional',
            status: 'undetermined',
        },
    ];

    const acionar = (id: string) => {
        if (id === 'notifications') pedirNotificacoes();
        else if (id === 'location') pedirLocalizacao();
        else mostrarInstrucoesConfig();
    };

    return {
        permissoes,
        verificando,
        verificarTodas,
        acionar,
        abrirConfiguracoes: () => Linking.openSettings(),
    };
}
