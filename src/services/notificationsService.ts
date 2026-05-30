import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configura comportamento das notificações
// (mostrar mesmo se o app estiver aberto + tocar som + mostrar badge)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Pede permissão e retorna o token do dispositivo. Se algo falhar, retorna null.
export const registerForPushNotifications = async (): Promise<string | null> => {
    // Push notifications só funcionam em aparelho real (não em emulador iOS)
    if (!Device.isDevice && Platform.OS === 'ios') {
        console.warn('[notifications] Push só funciona em aparelho físico no iOS');
        return null;
    }

    // No Web, expo-notifications não tem suporte completo — pula
    if (Platform.OS === 'web') {
        console.warn('[notifications] Push não é suportado no Web');
        return null;
    }

    // Verifica se já tem permissão
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Se ainda não pediu, pede agora
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('[notifications] Permissão negada');
        return null;
    }

    try {
        // Em Android, precisa configurar canais de notificação
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Padrão',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#1d9e75',
            });

            await Notifications.setNotificationChannelAsync('emergency', {
                name: 'Emergências',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 500, 250, 500],
                lightColor: '#c83333',
                sound: 'default',
            });
        }

        // Pega o token do dispositivo
        const tokenData = await Notifications.getDevicePushTokenAsync();
        return tokenData.data;
    } catch (error) {
        console.warn('[notifications] Erro ao pegar token:', error);
        return null;
    }
};

// Atalho: registra notificações.
//
// Se o userService.updateFcmToken existir, também envia o token pro backend.
// Se NÃO existir, só configura as notificações locais (sem persistir no servidor).
export const setupPushAfterLogin = async (): Promise<void> => {
    const token = await registerForPushNotifications();
    if (!token) return;

    // Tenta enviar o token pra API (best-effort)
    try {
        // Importação dinâmica pra não quebrar se a função ainda não existir
        const userService = await import('@services/userService');
        if (typeof (userService as any).updateFcmToken === 'function') {
            await (userService as any).updateFcmToken(token);
            console.log('[notifications] Token registrado no backend');
        } else {
            console.log('[notifications] updateFcmToken ainda não implementado no userService — token só configurado localmente');
        }
    } catch (error) {
        console.warn('[notifications] Falha ao salvar token na API:', error);
    }
};