import Constants from 'expo-constants';

// URL da API.
// Sempre usa a URL da nuvem (Render), definida em app.config.js -> extra.apiUrl.
const getApiUrl = (): string => {
    return Constants.expoConfig?.extra?.apiUrl || 'https://safehome-api.onrender.com';
};

export const API_CONFIG = {
    BASE_URL: getApiUrl(),
    TIMEOUT: 15000,
} as const;
