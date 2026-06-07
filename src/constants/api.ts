import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiUrl = (): string => {
    // Em produção (APK/build), usa a URL da nuvem definida no app.config.js
    if (!__DEV__) {
        return Constants.expoConfig?.extra?.apiUrl || 'https://safehome-api.onrender.com';
    }

    // Em desenvolvimento, conecta no backend local conforme a plataforma
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:3000';   
    }
    if (Platform.OS === 'ios') {
        return 'http://127.0.0.1:3000';   
    }
    return 'http://localhost:3000';        
};

export const API_CONFIG = {
    BASE_URL: getApiUrl(),
    TIMEOUT: 15000,
} as const;
